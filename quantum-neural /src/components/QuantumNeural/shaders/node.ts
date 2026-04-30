import {
  AMBIENT_BRIGHT_BOOST,
  AMBIENT_SIZE_BOOST,
  AMBIENT_WAVE_FREQ,
  AMBIENT_WAVE_SPEED,
  DESYNC_STRENGTH,
  NODE_BREATHE_SPEED,
  NODE_COLOR_BREATHE,
  NODE_CORE_RADIUS,
  NODE_CORE_SHINE,
  NODE_CROSS_SHINE,
  NODE_INNER_GLOW_RADIUS,
  NODE_OUTER_GLOW,
  NODE_RECT_BG_EDGE,
  NODE_RECT_BG_GLOW,
  NODE_RECT_EDGE,
  NODE_RECT_GLOW,
  PULSE_FLASH_BOOST,
  PULSE_RECT_BOOST,
  PULSE_SIZE_BOOST,
  SECONDARY_WAVE_MIX,
} from "../constants";
import {
  fl,
  PULSE_HELPER_WGSL,
  SHADER_DESYNC_HELPER_WGSL,
  SHARED_U_STRUCT,
} from "./common";

export const NODE_WGSL = /* wgsl */ `
${SHARED_U_STRUCT}
${PULSE_HELPER_WGSL}
${SHADER_DESYNC_HELPER_WGSL}

struct VSOut {
  @builtin(position) pos: vec4f,
  @location(0) uv: vec2f,
  @location(1) color: vec3f,
  @location(2) pulse: f32,
  @location(3) phase: f32,
  @location(4) ambient: f32,
}

@vertex
fn vs(
  @builtin(vertex_index) vi: u32,
  @builtin(instance_index) ii: u32,
  @location(0) center: vec3f,
  @location(1) size: f32,
  @location(2) color: vec3f,
) -> VSOut {
  var quad = array<vec2f, 6>(
    vec2f(-1.0, -1.0), vec2f(1.0, -1.0), vec2f(-1.0, 1.0),
    vec2f(-1.0,  1.0), vec2f(1.0, -1.0), vec2f( 1.0, 1.0)
  );

  let pulse = totalPulse(center);
  let seedA = hash11(f32(ii) * 13.73);
  let seedB = hash11(f32(ii) * 29.41 + 0.37);
  let desync = ${fl(DESYNC_STRENGTH)};

  // Two desynced ambient waves so the network reads as alive instead of pulsing
  // in lockstep.
  let centerDist = length(center);
  let waveFreqA = ${fl(AMBIENT_WAVE_FREQ)} * (1.0 - 0.22 * desync + 0.44 * desync * seedA);
  let waveSpeedA = ${fl(AMBIENT_WAVE_SPEED)} * (1.0 - 0.25 * desync + 0.50 * desync * seedB);
  let waveFreqB = waveFreqA * (1.35 + 0.35 * seedB);
  let waveSpeedB = waveSpeedA * (0.62 + 0.28 * seedA);
  let waveA = 0.5 + 0.5 * sin(centerDist * waveFreqA - u.time * waveSpeedA + seedA * 6.28318);
  let waveB = 0.5 + 0.5 * sin(centerDist * waveFreqB - u.time * waveSpeedB + seedB * 6.28318);
  let ambient = mix(waveA, waveB, ${fl(SECONDARY_WAVE_MIX)});

  let breatheSpeed = ${fl(NODE_BREATHE_SPEED + 0.1)} * (1.0 - 0.2 * desync + 0.4 * desync * seedA);
  let breatheAmp = 0.08 + 0.08 * seedB;
  let breathe = 0.9 + breatheAmp * sin(u.time * breatheSpeed + seedB * 6.28318);
  let ambientSize = 1.0 + ambient * ${fl(AMBIENT_SIZE_BOOST)};
  let pulseSize = 1.0 + pulse * ${fl(PULSE_SIZE_BOOST)};
  let s = size * breathe * ambientSize * pulseSize;

  var clip = u.vp * u.model * vec4f(center, 1.0);
  let aspect = u.resolution.x / max(u.resolution.y, 1.0);
  let c = quad[vi];
  clip.x = clip.x + c.x * s * clip.w;
  clip.y = clip.y + c.y * s * aspect * clip.w;

  var o: VSOut;
  o.pos = clip;
  o.uv = c;
  o.color = color;
  o.pulse = pulse;
  o.phase = f32(ii);
  o.ambient = ambient;
  return o;
}

@fragment
fn fs(in: VSOut) -> @location(0) vec4f {
  let r = length(in.uv);
  if (r > 1.2) { discard; }

  // Layered glow: bright inner falloff + softer outer halo.
  let glow1 = 1.0 - smoothstep(0.0, ${fl(NODE_INNER_GLOW_RADIUS)}, r);
  let glow2 = 1.0 - smoothstep(0.0, 1.0, r);
  var glowStrength = pow(glow1, 1.2) + glow2 * ${fl(NODE_OUTER_GLOW)};

  // Square halo + cross flare to match the Three.js reference look.
  let box = max(abs(in.uv.x), abs(in.uv.y));
  let rectGlow = 1.0 - smoothstep(0.0, ${fl(NODE_RECT_EDGE)}, box);
  let rectGlowBg = 1.0 - smoothstep(0.0, ${fl(NODE_RECT_BG_EDGE)}, box);
  let crossX = (1.0 - smoothstep(0.0, 0.08, abs(in.uv.x)))
             * (1.0 - smoothstep(0.2, 1.0, abs(in.uv.y)));
  let crossY = (1.0 - smoothstep(0.0, 0.08, abs(in.uv.y)))
             * (1.0 - smoothstep(0.2, 1.0, abs(in.uv.x)));
  let cross = max(crossX, crossY);
  glowStrength += rectGlow * ${fl(NODE_RECT_GLOW)}
               + rectGlowBg * ${fl(NODE_RECT_BG_GLOW)}
               + cross * ${fl(NODE_CROSS_SHINE)};

  // Per-node color breathing, desynced via the instance index.
  let phaseSeed = hash11(in.phase * 0.013);
  let cSpeed = ${fl(NODE_BREATHE_SPEED)} * (0.8 + 0.5 * phaseSeed);
  let breatheC = (1.0 - ${fl(NODE_COLOR_BREATHE)})
               + ${fl(NODE_COLOR_BREATHE)} * sin(u.time * cSpeed + in.phase * 0.25 + phaseSeed * 6.28318);
  let activeBrightness = 1.0 + in.ambient * ${fl(AMBIENT_BRIGHT_BOOST)};
  var finalColor = in.color * breatheC * activeBrightness;

  // Tap pulse: scale + brighten in the rect's own color (no white-out).
  if (in.pulse > 0.0) {
    finalColor *= (1.0 + in.pulse * ${fl(PULSE_FLASH_BOOST)});
    glowStrength *= (1.0 + in.pulse * 1.2);
    glowStrength += (rectGlow + rectGlowBg * 0.75) * in.pulse * ${fl(PULSE_RECT_BOOST)};
  }

  // White core dot, faded during a pulse so the colored rect dominates.
  let coreBrightness = smoothstep(${fl(NODE_CORE_RADIUS)}, 0.0, r);
  let coreFade = 1.0 - in.pulse * 0.7;
  finalColor += vec3f(1.0) * coreBrightness * ${fl(NODE_CORE_SHINE)} * coreFade;

  let edgeSoftRadial = 1.0 - smoothstep(0.95, 1.2, r);
  let edgeSoftRect = 1.0 - smoothstep(0.9, 1.25, box);
  let edgeSoft = max(edgeSoftRadial, edgeSoftRect * 0.92);
  let alpha = glowStrength * (0.95 - 0.3 * r) * edgeSoft;
  return vec4f(finalColor * alpha, alpha);
}
`;
