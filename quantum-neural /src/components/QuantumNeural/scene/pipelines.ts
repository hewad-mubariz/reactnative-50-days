import {
  LINE_COLOR_STRIDE,
  LINE_POS_STRIDE,
  NODE_COLOR_STRIDE,
  NODE_POS_STRIDE,
  STAR_STRIDE_FLOATS,
} from "../constants";
import { BLOOM_BLUR_WGSL, BLOOM_BRIGHT_WGSL, BLOOM_COMPOSITE_WGSL } from "../shaders/bloom";
import { LINE_WGSL } from "../shaders/line";
import { NODE_WGSL } from "../shaders/node";
import { STAR_WGSL } from "../shaders/star";

const additiveBlend: GPUBlendState = {
  color: { srcFactor: "src-alpha", dstFactor: "one", operation: "add" },
  alpha: { srcFactor: "zero", dstFactor: "one", operation: "add" },
};

const additiveColorTarget = (format: GPUTextureFormat): GPUColorTargetState => ({
  format,
  blend: additiveBlend,
});

const opaqueTarget = (format: GPUTextureFormat): GPUColorTargetState => ({
  format,
});

export type ScenePipelines = {
  star: GPURenderPipeline;
  line: GPURenderPipeline;
  node: GPURenderPipeline;
};

/**
 * Builds the three additive-blended scene pipelines (stars, lines, nodes).
 * All share the same uniform-only bind group at @group(0) @binding(0).
 */
export const createScenePipelines = (
  device: GPUDevice,
  presentationFormat: GPUTextureFormat,
): ScenePipelines => {
  const starModule = device.createShaderModule({ code: STAR_WGSL });
  const lineModule = device.createShaderModule({ code: LINE_WGSL });
  const nodeModule = device.createShaderModule({ code: NODE_WGSL });

  const star = device.createRenderPipeline({
    layout: "auto",
    vertex: {
      module: starModule,
      entryPoint: "vs",
      buffers: [
        {
          arrayStride: STAR_STRIDE_FLOATS * 4,
          stepMode: "instance",
          attributes: [
            { shaderLocation: 0, offset: 0, format: "float32x3" },
            { shaderLocation: 1, offset: 12, format: "float32" },
            { shaderLocation: 2, offset: 16, format: "float32x3" },
            { shaderLocation: 3, offset: 28, format: "float32" },
          ],
        },
      ],
    },
    fragment: {
      module: starModule,
      entryPoint: "fs",
      targets: [additiveColorTarget(presentationFormat)],
    },
    primitive: { topology: "triangle-list" },
  });

  const line = device.createRenderPipeline({
    layout: "auto",
    vertex: {
      module: lineModule,
      entryPoint: "vs",
      buffers: [
        {
          arrayStride: LINE_POS_STRIDE,
          stepMode: "instance",
          attributes: [
            { shaderLocation: 0, offset: 0, format: "float32x3" },
            { shaderLocation: 1, offset: 16, format: "float32x3" },
            { shaderLocation: 2, offset: 28, format: "float32" },
          ],
        },
        {
          arrayStride: LINE_COLOR_STRIDE,
          stepMode: "instance",
          attributes: [
            { shaderLocation: 3, offset: 0, format: "float32x3" },
          ],
        },
      ],
    },
    fragment: {
      module: lineModule,
      entryPoint: "fs",
      targets: [additiveColorTarget(presentationFormat)],
    },
    primitive: { topology: "line-list" },
  });

  const node = device.createRenderPipeline({
    layout: "auto",
    vertex: {
      module: nodeModule,
      entryPoint: "vs",
      buffers: [
        {
          arrayStride: NODE_POS_STRIDE,
          stepMode: "instance",
          attributes: [
            { shaderLocation: 0, offset: 0, format: "float32x3" },
            { shaderLocation: 1, offset: 12, format: "float32" },
          ],
        },
        {
          arrayStride: NODE_COLOR_STRIDE,
          stepMode: "instance",
          attributes: [
            { shaderLocation: 2, offset: 0, format: "float32x3" },
          ],
        },
      ],
    },
    fragment: {
      module: nodeModule,
      entryPoint: "fs",
      targets: [additiveColorTarget(presentationFormat)],
    },
    primitive: { topology: "triangle-list" },
  });

  return { star, line, node };
};

export type BloomPipelines = {
  bright: GPURenderPipeline;
  blur: GPURenderPipeline;
  composite: GPURenderPipeline;
};

/**
 * Bloom postprocess pipelines: bright extract, separable blur, final composite.
 */
export const createBloomPipelines = (
  device: GPUDevice,
  presentationFormat: GPUTextureFormat,
): BloomPipelines => {
  const brightModule = device.createShaderModule({ code: BLOOM_BRIGHT_WGSL });
  const blurModule = device.createShaderModule({ code: BLOOM_BLUR_WGSL });
  const compositeModule = device.createShaderModule({ code: BLOOM_COMPOSITE_WGSL });

  const buildFullscreenPipeline = (module: GPUShaderModule) =>
    device.createRenderPipeline({
      layout: "auto",
      vertex: { module, entryPoint: "vs" },
      fragment: {
        module,
        entryPoint: "fs",
        targets: [opaqueTarget(presentationFormat)],
      },
      primitive: { topology: "triangle-list" },
    });

  return {
    bright: buildFullscreenPipeline(brightModule),
    blur: buildFullscreenPipeline(blurModule),
    composite: buildFullscreenPipeline(compositeModule),
  };
};
