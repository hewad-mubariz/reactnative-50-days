import type { MutableRefObject } from "react";
import { mat4 } from "wgpu-matrix";

import type { Scene } from "@/hooks/useWebGPU";

import {
  CAMERA_POS,
  LINE_VERTS_PER_EDGE,
  MOMENTUM_DECAY,
  STAR_COUNT,
  TILT_LIMIT,
} from "../constants";
import {
  computeColors,
  generateNetwork,
  generateStarBuffer,
  packLinePositions,
  packNodePositions,
} from "../geometry";
import { THEMES } from "../themes";
import type {
  Interaction,
  PulseState,
  PulseTrigger,
  ThemeUpdater,
  Vec3,
} from "../types";
import { createBloomResources } from "./bloom";
import { createBloomPipelines, createScenePipelines } from "./pipelines";
import { createPulseRaycaster } from "./raycast";
import { SHARED_UNIFORM_FLOATS, writeFrameUniforms } from "./uniforms";

const VERTEX_USAGE = GPUBufferUsage.VERTEX;
const VERTEX_DST_USAGE = GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST;

const writeVertexBufferStatic = (
  device: GPUDevice,
  data: Float32Array<ArrayBuffer>,
): GPUBuffer => {
  const buffer = device.createBuffer({
    size: data.byteLength,
    usage: VERTEX_USAGE,
    mappedAtCreation: true,
  });
  new Float32Array(buffer.getMappedRange()).set(data);
  buffer.unmap();
  return buffer;
};

const writeVertexBufferDynamic = (
  device: GPUDevice,
  data: Float32Array<ArrayBuffer>,
): GPUBuffer => {
  const buffer = device.createBuffer({
    size: data.byteLength,
    usage: VERTEX_DST_USAGE,
  });
  device.queue.writeBuffer(buffer, 0, data);
  return buffer;
};

const beginColorPass = (
  encoder: GPUCommandEncoder,
  view: GPUTextureView,
  clear: GPUColor,
): GPURenderPassEncoder =>
  encoder.beginRenderPass({
    colorAttachments: [
      { view, clearValue: clear, loadOp: "clear", storeOp: "store" },
    ],
  });

const runFullscreenPass = (
  encoder: GPUCommandEncoder,
  view: GPUTextureView,
  pipeline: GPURenderPipeline,
  bindGroup: GPUBindGroup,
): void => {
  const pass = beginColorPass(encoder, view, { r: 0, g: 0, b: 0, a: 1 });
  pass.setPipeline(pipeline);
  pass.setBindGroup(0, bindGroup);
  pass.draw(3);
  pass.end();
};

const SCENE_CLEAR: GPUColor = { r: 0.005, g: 0.006, b: 0.014, a: 1 };

const buildPulseState = (): PulseState => ({
  pos: [
    [1000, 1000, 1000],
    [1000, 1000, 1000],
    [1000, 1000, 1000],
  ],
  times: [-1000, -1000, -1000],
  tint: [1, 1, 1],
  nextSlot: 0,
});

const tintFromTheme = (idx: number): Vec3 => {
  const palette = THEMES[idx];
  const c = palette[2] ?? palette[0];
  return [c[0], c[1], c[2]];
};

export type SceneRefs = {
  interactionRef: MutableRefObject<Interaction>;
  themeUpdaterRef: MutableRefObject<ThemeUpdater | null>;
  pulseTriggerRef: MutableRefObject<PulseTrigger | null>;
};

/**
 * Builds the WebGPU scene callback consumed by `useWebGPU`. The closure
 * allocates all GPU resources up front, wires the imperative refs that the
 * UI uses to drive theme/pulse state, and returns the per-frame render loop.
 */
export const createSceneCallback =
  ({ interactionRef, themeUpdaterRef, pulseTriggerRef }: SceneRefs): Scene =>
  ({ device, presentationFormat, canvas, context }) => {
    // ----- 1. Geometry --------------------------------------------------------
    const network = generateNetwork();
    const nodeCount = network.nodes.length;
    const edgeCount = network.edges.length;
    const initialColors = computeColors(network, 0);

    // ----- 2. GPU buffers -----------------------------------------------------
    const uniformData = new Float32Array(SHARED_UNIFORM_FLOATS);
    const uniformBuffer = device.createBuffer({
      size: uniformData.byteLength,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    const nodePosBuffer = writeVertexBufferStatic(
      device,
      packNodePositions(network),
    );
    const nodeColorBuffer = writeVertexBufferDynamic(
      device,
      initialColors.nodeColors,
    );
    const linePosBuffer = writeVertexBufferStatic(
      device,
      packLinePositions(network),
    );
    const lineColorBuffer = writeVertexBufferDynamic(
      device,
      initialColors.lineColors,
    );
    const starBuffer = writeVertexBufferStatic(device, generateStarBuffer());

    // ----- 3. Cameras + matrices ---------------------------------------------
    const projection = mat4.perspective(
      Math.PI / 4,
      canvas.width / Math.max(1, canvas.height),
      0.1,
      200,
    );
    const view = mat4.identity();
    const vp = mat4.identity();
    const model = mat4.identity();
    mat4.lookAt([...CAMERA_POS], [0, 0, 0], [0, 1, 0], view);
    mat4.multiply(projection, view, vp);

    const startTime = Date.now();

    // ----- 4. Pulse state + theme/tap wiring ---------------------------------
    const pulseState = buildPulseState();
    pulseState.tint = tintFromTheme(0);

    themeUpdaterRef.current = (idx: number) => {
      const safe = Math.max(0, Math.min(THEMES.length - 1, idx));
      const next = computeColors(network, safe);
      device.queue.writeBuffer(nodeColorBuffer, 0, next.nodeColors);
      device.queue.writeBuffer(lineColorBuffer, 0, next.lineColors);
      pulseState.tint = tintFromTheme(safe);
    };

    const raycast = createPulseRaycaster(
      vp as Float32Array,
      model as Float32Array,
      network,
    );
    pulseTriggerRef.current = (nx: number, ny: number) => {
      const origin = raycast(nx, ny);
      if (!origin) return;
      const slot = pulseState.nextSlot;
      pulseState.nextSlot = (slot + 1) % 3;
      pulseState.pos[slot] = origin;
      pulseState.times[slot] = (Date.now() - startTime) / 1000;
    };

    // ----- 5. Pipelines + bind groups ----------------------------------------
    const scenePipelines = createScenePipelines(device, presentationFormat);
    const bloomPipelines = createBloomPipelines(device, presentationFormat);

    const sharedUniformEntry = [
      { binding: 0, resource: { buffer: uniformBuffer } },
    ];
    const starBindGroup = device.createBindGroup({
      layout: scenePipelines.star.getBindGroupLayout(0),
      entries: sharedUniformEntry,
    });
    const lineBindGroup = device.createBindGroup({
      layout: scenePipelines.line.getBindGroupLayout(0),
      entries: sharedUniformEntry,
    });
    const nodeBindGroup = device.createBindGroup({
      layout: scenePipelines.node.getBindGroupLayout(0),
      entries: sharedUniformEntry,
    });

    const bloom = createBloomResources(
      device,
      presentationFormat,
      canvas.width,
      canvas.height,
      bloomPipelines,
    );

    // ----- 6. Render loop -----------------------------------------------------
    return () => {
      const t = (Date.now() - startTime) / 1000;
      const s = interactionRef.current;
      const dt = s.lastT === 0 ? 0 : t - s.lastT;
      s.lastT = t;

      if (!s.isDragging) {
        s.userY += s.velY * dt;
        s.userX += s.velX * dt;
        if (s.userX > TILT_LIMIT) {
          s.userX = TILT_LIMIT;
          s.velX = 0;
        } else if (s.userX < -TILT_LIMIT) {
          s.userX = -TILT_LIMIT;
          s.velX = 0;
        }
        const decay = Math.exp(-dt * MOMENTUM_DECAY);
        s.velY *= decay;
        s.velX *= decay;
        s.autoY += dt * 0.12;
      }

      const wobble = Math.sin(t * 0.04) * 0.05;
      mat4.identity(model);
      mat4.rotateY(model, s.autoY + s.userY + wobble, model);
      mat4.rotateX(model, s.userX, model);
      mat4.scale(model, [s.scale, s.scale, s.scale], model);

      writeFrameUniforms(
        uniformData,
        vp as Float32Array,
        model as Float32Array,
        canvas.width,
        canvas.height,
        t,
        pulseState,
      );
      device.queue.writeBuffer(uniformBuffer, 0, uniformData.buffer);

      const encoder = device.createCommandEncoder();

      // 1. Render the scene (stars + lines + nodes) into the offscreen target.
      const scenePass = beginColorPass(encoder, bloom.sceneTexView, SCENE_CLEAR);

      scenePass.setPipeline(scenePipelines.star);
      scenePass.setBindGroup(0, starBindGroup);
      scenePass.setVertexBuffer(0, starBuffer);
      scenePass.draw(6, STAR_COUNT);

      scenePass.setPipeline(scenePipelines.line);
      scenePass.setBindGroup(0, lineBindGroup);
      scenePass.setVertexBuffer(0, linePosBuffer);
      scenePass.setVertexBuffer(1, lineColorBuffer);
      scenePass.draw(LINE_VERTS_PER_EDGE, edgeCount);

      scenePass.setPipeline(scenePipelines.node);
      scenePass.setBindGroup(0, nodeBindGroup);
      scenePass.setVertexBuffer(0, nodePosBuffer);
      scenePass.setVertexBuffer(1, nodeColorBuffer);
      scenePass.draw(6, nodeCount);
      scenePass.end();

      // 2. Bright extract (sceneTex → bloomA at half-res).
      runFullscreenPass(
        encoder,
        bloom.bloomAView,
        bloomPipelines.bright,
        bloom.brightBindGroup,
      );

      // 3. Horizontal blur (bloomA → bloomB).
      runFullscreenPass(
        encoder,
        bloom.bloomBView,
        bloomPipelines.blur,
        bloom.blurHBindGroup,
      );

      // 4. Vertical blur (bloomB → bloomA).
      runFullscreenPass(
        encoder,
        bloom.bloomAView,
        bloomPipelines.blur,
        bloom.blurVBindGroup,
      );

      // 5. Composite scene + blurred bloom into the swapchain.
      runFullscreenPass(
        encoder,
        context.getCurrentTexture().createView(),
        bloomPipelines.composite,
        bloom.compositeBindGroup,
      );

      device.queue.submit([encoder.finish()]);
    };
  };
