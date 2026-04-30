import { FS_VS_WGSL } from "./common";

/**
 * Bright-pass + downsample. Soft-knee threshold so bright pixels fade in
 * smoothly instead of hard-clipping at the cutoff.
 */
export const BLOOM_BRIGHT_WGSL = /* wgsl */ `
${FS_VS_WGSL}

struct BrU {
  threshold: f32,
  _pad0: f32,
  _pad1: f32,
  _pad2: f32,
}
@group(0) @binding(0) var<uniform> u: BrU;
@group(0) @binding(1) var inputTex: texture_2d<f32>;
@group(0) @binding(2) var inputSampler: sampler;

@fragment
fn fs(in: FsVSOut) -> @location(0) vec4f {
  let c = textureSample(inputTex, inputSampler, in.uv).rgb;
  let lum = max(c.r, max(c.g, c.b));
  if (lum <= u.threshold) {
    return vec4f(0.0, 0.0, 0.0, 1.0);
  }
  let knee = lum - u.threshold;
  let scale = knee / max(lum, 0.0001);
  return vec4f(c * scale, 1.0);
}
`;

/**
 * Separable 9-tap gaussian blur. Run twice — once horizontal, once vertical.
 */
export const BLOOM_BLUR_WGSL = /* wgsl */ `
${FS_VS_WGSL}

struct BlU {
  texelDirection: vec2f,
  _pad: vec2f,
}
@group(0) @binding(0) var<uniform> u: BlU;
@group(0) @binding(1) var inputTex: texture_2d<f32>;
@group(0) @binding(2) var inputSampler: sampler;

@fragment
fn fs(in: FsVSOut) -> @location(0) vec4f {
  let w0 = 0.227027;
  let w1 = 0.1945946;
  let w2 = 0.1216216;
  let w3 = 0.054054;
  let w4 = 0.016216;

  var color = textureSample(inputTex, inputSampler, in.uv).rgb * w0;
  let off1 = u.texelDirection;
  color = color + textureSample(inputTex, inputSampler, in.uv + off1).rgb * w1;
  color = color + textureSample(inputTex, inputSampler, in.uv - off1).rgb * w1;
  let off2 = u.texelDirection * 2.0;
  color = color + textureSample(inputTex, inputSampler, in.uv + off2).rgb * w2;
  color = color + textureSample(inputTex, inputSampler, in.uv - off2).rgb * w2;
  let off3 = u.texelDirection * 3.0;
  color = color + textureSample(inputTex, inputSampler, in.uv + off3).rgb * w3;
  color = color + textureSample(inputTex, inputSampler, in.uv - off3).rgb * w3;
  let off4 = u.texelDirection * 4.0;
  color = color + textureSample(inputTex, inputSampler, in.uv + off4).rgb * w4;
  color = color + textureSample(inputTex, inputSampler, in.uv - off4).rgb * w4;
  return vec4f(color, 1.0);
}
`;

/**
 * Composite: scene + bloom * intensity → swapchain.
 */
export const BLOOM_COMPOSITE_WGSL = /* wgsl */ `
${FS_VS_WGSL}

struct CmpU {
  intensity: f32,
  _pad0: f32,
  _pad1: f32,
  _pad2: f32,
}
@group(0) @binding(0) var<uniform> u: CmpU;
@group(0) @binding(1) var sceneTex: texture_2d<f32>;
@group(0) @binding(2) var bloomTex: texture_2d<f32>;
@group(0) @binding(3) var inputSampler: sampler;

@fragment
fn fs(in: FsVSOut) -> @location(0) vec4f {
  let scene = textureSample(sceneTex, inputSampler, in.uv).rgb;
  let bloom = textureSample(bloomTex, inputSampler, in.uv).rgb;
  return vec4f(scene + bloom * u.intensity, 1.0);
}
`;
