import {
  AMBIENT_LINE_BOOST,
  AMBIENT_WAVE_FREQ,
  AMBIENT_WAVE_SPEED,
  DESYNC_STRENGTH,
  LINE_COLOR_BREATHE,
  LINE_SEGMENTS,
  SECONDARY_WAVE_MIX,
} from "../constants";
import {
  fl,
  PULSE_HELPER_WGSL,
  SHADER_DESYNC_HELPER_WGSL,
  SHARED_U_STRUCT,
} from "./common";

export const LINE_WGSL = /* wgsl */ `
${SHARED_U_STRUCT}
${PULSE_HELPER_WGSL}
${SHADER_DESYNC_HELPER_WGSL}

const SEGMENTS: u32 = ${LINE_SEGMENTS}u;

struct VSOut {
  @builtin(position) pos: vec4f,
  @location(0) t: f32,
  @location(1) edgePhase: f32,
  @location(2) color: vec3f,
  @location(3) pulse: f32,
  @location(4) ambient: f32,
}

@vertex
fn vs(
  @builtin(vertex_index) vi: u32,
  @location(0) startP: vec3f,
  @location(1) endP: vec3f,
  @location(2) edgeIndex: f32,
  @location(3) color: vec3f,
) -> VSOut {
  let segIdx = (vi + 1u) / 2u;
  let t = f32(segIdx) / f32(SEGMENTS);

  // Build a lightly-bowed quadratic-Bezier per edge so wires read as curved
  // rather than zigzag straight lines.
  let dirRaw = endP - startP;
  let len = max(length(dirRaw), 0.0001);
  let dirN = dirRaw / len;
  var perp = cross(dirN, vec3f(0.0, 1.0, 0.0));
  let perpLen = length(perp);
  if (perpLen < 0.001) {
    perp = vec3f(1.0, 0.0, 0.0);
  } else {
    perp = perp / perpLen;
  }

  let bow = sin(t * 3.14159265) * 0.18 * len;
  let mid = mix(startP, endP, 0.5) + perp * bow;

  let p01 = mix(startP, mid, t);
  let p12 = mix(mid, endP, t);
  var p = mix(p01, p12, t);

  let wobble = sin(u.time * 0.4 + edgeIndex * 0.13 + t * 5.0) * 0.04 * len;
  p = p + perp * wobble;

  let edgeSeedA = hash11(edgeIndex * 0.117 + 0.31);
  let edgeSeedB = hash11(edgeIndex * 0.193 + 0.77);
  let desync = ${fl(DESYNC_STRENGTH)};

  let centerDist = length(p);
  let waveFreqA = ${fl(AMBIENT_WAVE_FREQ)} * (1.0 - 0.22 * desync + 0.44 * desync * edgeSeedA);
  let waveSpeedA = ${fl(AMBIENT_WAVE_SPEED)} * (1.0 - 0.25 * desync + 0.50 * desync * edgeSeedB);
  let waveFreqB = waveFreqA * (1.35 + 0.35 * edgeSeedB);
  let waveSpeedB = waveSpeedA * (0.62 + 0.28 * edgeSeedA);
  let waveA = 0.5 + 0.5 * sin(centerDist * waveFreqA - u.time * waveSpeedA + edgeSeedA * 6.28318);
  let waveB = 0.5 + 0.5 * sin(centerDist * waveFreqB - u.time * waveSpeedB + edgeSeedB * 6.28318);
  let ambient = mix(waveA, waveB, ${fl(SECONDARY_WAVE_MIX)});

  var o: VSOut;
  o.pos = u.vp * u.model * vec4f(p, 1.0);
  o.t = t;
  o.edgePhase = edgeIndex * 0.07;
  o.color = color;
  o.pulse = totalPulse(p);
  o.ambient = ambient;
  return o;
}

@fragment
fn fs(in: VSOut) -> @location(0) vec4f {
  let edgeSeed = hash11(in.edgePhase * 17.31);
  let flowSpeedA = 3.2 + 2.1 * edgeSeed;
  let flowSpeedB = 1.9 + 1.4 * (1.0 - edgeSeed);
  let flow1 = sin(in.t * 25.0 - u.time * flowSpeedA + in.edgePhase) * 0.5 + 0.5;
  let flow2 = sin(in.t * 15.0 - u.time * flowSpeedB + 1.57 + in.edgePhase) * 0.5 + 0.5;
  let combined = (flow1 + flow2 * 0.5) / 1.5;

  let breatheC = (1.0 - ${fl(LINE_COLOR_BREATHE)})
               + ${fl(LINE_COLOR_BREATHE)} * sin(u.time * 0.6 + in.t * 12.0 + in.edgePhase);
  let breathed = in.color * breatheC;

  var bright = breathed * (1.0 + 1.4 * combined + in.ambient * ${fl(AMBIENT_LINE_BOOST)});
  var alpha = 0.28 + 0.55 * combined + in.ambient * 0.15;

  if (in.pulse > 0.0) {
    bright = bright * (1.0 + 1.1 * in.pulse);
    alpha = mix(alpha, min(1.0, alpha * 2.4), in.pulse);
  }

  return vec4f(bright * alpha, alpha);
}
`;
