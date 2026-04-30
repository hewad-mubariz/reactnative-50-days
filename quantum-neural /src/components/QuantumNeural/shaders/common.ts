import { PULSE_ATTACK, PULSE_DECAY, PULSE_LIFETIME } from "../constants";

/**
 * Formats a JS number into a WGSL-safe float literal (always has a `.`).
 */
export const fl = (n: number): string => {
  const s = n.toString();
  return s.includes(".") ? s : `${s}.0`;
};

/**
 * Shared uniform block bound at @group(0) @binding(0) by every scene shader.
 *
 * Memory layout (52 floats / 208 bytes):
 *   0..15  vp        16..31 model
 *   32..33 resolution 34    time
 *   35     pulseSpeed 36..39 pulse0   (xyz origin, w trigger time)
 *   40..43 pulse1     44..47 pulse2
 *   48..51 pulseTint  (rgb, _pad)
 */
export const SHARED_U_STRUCT = /* wgsl */ `
struct U {
  vp: mat4x4f,
  model: mat4x4f,
  resolution: vec2f,
  time: f32,
  pulseSpeed: f32,
  pulse0: vec4f,
  pulse1: vec4f,
  pulse2: vec4f,
  pulseTint: vec4f,
}
@group(0) @binding(0) var<uniform> u: U;
`;

/**
 * Helpers for tap-driven pulse propagation. Each pulse slot stores its local
 * origin (xyz) and trigger time (w). Points flash with attack/decay envelope
 * once the spherical wavefront reaches them.
 */
export const PULSE_HELPER_WGSL = /* wgsl */ `
fn pulseAt(localPos: vec3f, pulse: vec4f) -> f32 {
  if (pulse.w < 0.0) { return 0.0; }
  let since = u.time - pulse.w;
  if (since < 0.0 || since > ${fl(PULSE_LIFETIME)}) { return 0.0; }

  let dist = distance(localPos, pulse.xyz);
  let arrival = dist / max(u.pulseSpeed, 0.0001);
  let localT = since - arrival;
  if (localT < 0.0) { return 0.0; }

  let attack = smoothstep(0.0, ${fl(PULSE_ATTACK)}, localT);
  let decay = exp(-localT * ${fl(PULSE_DECAY)});
  let sparkle = 0.9 + 0.1 * sin(localT * 24.0 + dist * 10.0);
  let tailFade = smoothstep(${fl(PULSE_LIFETIME)}, ${fl(PULSE_LIFETIME * 0.6)}, since);
  return attack * decay * sparkle * tailFade;
}

fn totalPulse(localPos: vec3f) -> f32 {
  let p = pulseAt(localPos, u.pulse0)
        + pulseAt(localPos, u.pulse1)
        + pulseAt(localPos, u.pulse2);
  return clamp(p, 0.0, 1.0);
}
`;

/**
 * Cheap pseudo-random hash used to desynchronize per-instance animation phases.
 */
export const SHADER_DESYNC_HELPER_WGSL = /* wgsl */ `
fn hash11(x: f32) -> f32 {
  return fract(sin(x * 127.1 + 311.7) * 43758.5453123);
}
`;

/**
 * Generic fullscreen-triangle vertex shader, shared by every postprocess pass.
 * Outputs UVs that match WebGPU's render-to-texture convention (NDC y=+1 maps
 * to texel row 0 → uv.y = 0).
 */
export const FS_VS_WGSL = /* wgsl */ `
struct FsVSOut {
  @builtin(position) pos: vec4f,
  @location(0) uv: vec2f,
}

@vertex
fn vs(@builtin(vertex_index) vi: u32) -> FsVSOut {
  var pos = array<vec2f, 3>(
    vec2f(-1.0, -1.0),
    vec2f( 3.0, -1.0),
    vec2f(-1.0,  3.0),
  );
  let p = pos[vi];
  var o: FsVSOut;
  o.pos = vec4f(p, 0.0, 1.0);
  o.uv = vec2f((p.x + 1.0) * 0.5, (1.0 - p.y) * 0.5);
  return o;
}
`;
