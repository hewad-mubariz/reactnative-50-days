import {
  BLOOM_BLUR_RADIUS,
  BLOOM_DOWNSAMPLE,
  BLOOM_INTENSITY,
  BLOOM_THRESHOLD,
} from "../constants";
import type { BloomPipelines } from "./pipelines";

const TEX_USAGE =
  GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING;

const UNIFORM_USAGE = GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST;

const writeUniform = (
  device: GPUDevice,
  buffer: GPUBuffer,
  values: number[],
): void => {
  // Pad to vec4 (16-byte) alignment so std140-style structs always work.
  const padded = new Float32Array(4);
  for (let i = 0; i < values.length && i < 4; i++) padded[i] = values[i];
  device.queue.writeBuffer(buffer, 0, padded);
};

const createUniform = (
  device: GPUDevice,
  values: number[],
): GPUBuffer => {
  const buffer = device.createBuffer({ size: 16, usage: UNIFORM_USAGE });
  writeUniform(device, buffer, values);
  return buffer;
};

export type BloomResources = {
  sceneTexView: GPUTextureView;
  bloomAView: GPUTextureView;
  bloomBView: GPUTextureView;
  brightBindGroup: GPUBindGroup;
  blurHBindGroup: GPUBindGroup;
  blurVBindGroup: GPUBindGroup;
  compositeBindGroup: GPUBindGroup;
};

/**
 * Allocates the offscreen textures, sampler, uniform buffers and bind groups
 * required by the bloom postprocess pipeline.
 */
export const createBloomResources = (
  device: GPUDevice,
  presentationFormat: GPUTextureFormat,
  sceneW: number,
  sceneH: number,
  pipelines: BloomPipelines,
): BloomResources => {
  const bloomW = Math.max(1, Math.floor(sceneW / BLOOM_DOWNSAMPLE));
  const bloomH = Math.max(1, Math.floor(sceneH / BLOOM_DOWNSAMPLE));

  const sceneTex = device.createTexture({
    size: [sceneW, sceneH],
    format: presentationFormat,
    usage: TEX_USAGE,
  });
  const bloomA = device.createTexture({
    size: [bloomW, bloomH],
    format: presentationFormat,
    usage: TEX_USAGE,
  });
  const bloomB = device.createTexture({
    size: [bloomW, bloomH],
    format: presentationFormat,
    usage: TEX_USAGE,
  });

  const sceneTexView = sceneTex.createView();
  const bloomAView = bloomA.createView();
  const bloomBView = bloomB.createView();

  const sampler = device.createSampler({
    magFilter: "linear",
    minFilter: "linear",
    addressModeU: "clamp-to-edge",
    addressModeV: "clamp-to-edge",
  });

  const brightUniform = createUniform(device, [BLOOM_THRESHOLD]);
  const blurHUniform = createUniform(device, [BLOOM_BLUR_RADIUS / bloomW, 0]);
  const blurVUniform = createUniform(device, [0, BLOOM_BLUR_RADIUS / bloomH]);
  const compositeUniform = createUniform(device, [BLOOM_INTENSITY]);

  const brightBindGroup = device.createBindGroup({
    layout: pipelines.bright.getBindGroupLayout(0),
    entries: [
      { binding: 0, resource: { buffer: brightUniform } },
      { binding: 1, resource: sceneTexView },
      { binding: 2, resource: sampler },
    ],
  });

  // Blur H reads from bloomA (bright result) and writes to bloomB.
  const blurHBindGroup = device.createBindGroup({
    layout: pipelines.blur.getBindGroupLayout(0),
    entries: [
      { binding: 0, resource: { buffer: blurHUniform } },
      { binding: 1, resource: bloomAView },
      { binding: 2, resource: sampler },
    ],
  });
  // Blur V reads from bloomB and writes back to bloomA.
  const blurVBindGroup = device.createBindGroup({
    layout: pipelines.blur.getBindGroupLayout(0),
    entries: [
      { binding: 0, resource: { buffer: blurVUniform } },
      { binding: 1, resource: bloomBView },
      { binding: 2, resource: sampler },
    ],
  });

  const compositeBindGroup = device.createBindGroup({
    layout: pipelines.composite.getBindGroupLayout(0),
    entries: [
      { binding: 0, resource: { buffer: compositeUniform } },
      { binding: 1, resource: sceneTexView },
      { binding: 2, resource: bloomAView },
      { binding: 3, resource: sampler },
    ],
  });

  return {
    sceneTexView,
    bloomAView,
    bloomBView,
    brightBindGroup,
    blurHBindGroup,
    blurVBindGroup,
    compositeBindGroup,
  };
};
