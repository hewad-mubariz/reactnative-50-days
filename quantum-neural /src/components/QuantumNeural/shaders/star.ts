import {
  STAR_COLOR_AMP,
  STAR_COLOR_BASE,
  STAR_CORE_SHARPNESS,
  STAR_HALO_SOFTNESS,
  STAR_HALO_STRENGTH,
  STAR_ROTATION_SPEED,
  STAR_SIZE_PULSE_AMP,
  STAR_SIZE_PULSE_BASE,
  STAR_TWINKLE_SPEED,
} from "../constants";
import { fl, SHARED_U_STRUCT } from "./common";

export const STAR_WGSL = /* wgsl */ `
${SHARED_U_STRUCT}

struct VSOut {
  @builtin(position) pos: vec4f,
  @location(0) uv: vec2f,
  @location(1) color: vec3f,
}

@vertex
fn vs(
  @builtin(vertex_index) vi: u32,
  @location(0) starPos: vec3f,
  @location(1) starSize: f32,
  @location(2) starColor: vec3f,
  @location(3) starPhase: f32,
) -> VSOut {
  var quad = array<vec2f, 6>(
    vec2f(-1.0, -1.0), vec2f(1.0, -1.0), vec2f(-1.0, 1.0),
    vec2f(-1.0,  1.0), vec2f(1.0, -1.0), vec2f( 1.0, 1.0)
  );

  let angle = u.time * ${fl(STAR_ROTATION_SPEED)};
  let cs = cos(angle);
  let sn = sin(angle);
  let rotated = vec3f(
    cs * starPos.x + sn * starPos.z,
    starPos.y,
    -sn * starPos.x + cs * starPos.z
  );

  var clip = u.vp * vec4f(rotated, 1.0);

  let twinkle = 0.5 + 0.5 * sin(u.time * ${fl(STAR_TWINKLE_SPEED)} + starPhase);
  let aspect = u.resolution.x / max(u.resolution.y, 1.0);

  let baseSize = starSize * (${fl(STAR_SIZE_PULSE_BASE)} + ${fl(STAR_SIZE_PULSE_AMP)} * twinkle);
  let corner = quad[vi];
  clip.x = clip.x + corner.x * baseSize;
  clip.y = clip.y + corner.y * baseSize * aspect;

  var o: VSOut;
  o.pos = clip;
  o.uv = corner;
  o.color = starColor * (${fl(STAR_COLOR_BASE)} + ${fl(STAR_COLOR_AMP)} * twinkle);
  return o;
}

@fragment
fn fs(in: VSOut) -> @location(0) vec4f {
  let r = length(in.uv);
  if (r > 1.0) { discard; }
  let core = pow(max(1.0 - r, 0.0), ${fl(STAR_CORE_SHARPNESS)});
  let halo = pow(max(1.0 - r, 0.0), ${fl(STAR_HALO_SOFTNESS)}) * ${fl(STAR_HALO_STRENGTH)};
  let intensity = core + halo;
  return vec4f(in.color * intensity, intensity);
}
`;
