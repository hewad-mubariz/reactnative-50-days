import { PULSE_SPEED } from "../constants";
import type { PulseState } from "../types";

// 52 floats — see SHARED_U_STRUCT in shaders/common.ts for the layout.
export const SHARED_UNIFORM_FLOATS = 52;

const VP_OFFSET = 0;
const MODEL_OFFSET = 16;
const RES_X_OFFSET = 32;
const RES_Y_OFFSET = 33;
const TIME_OFFSET = 34;
const PULSE_SPEED_OFFSET = 35;
const PULSE_SLOTS_OFFSET = 36; // 3 vec4f slots
const PULSE_TINT_OFFSET = 48;

/**
 * Writes the per-frame values into a pre-allocated 52-float `Float32Array`,
 * matching `SHARED_U_STRUCT` in the shader.
 */
export const writeFrameUniforms = (
  out: Float32Array,
  vp: Float32Array,
  model: Float32Array,
  canvasW: number,
  canvasH: number,
  time: number,
  pulse: PulseState,
): void => {
  out.set(vp, VP_OFFSET);
  out.set(model, MODEL_OFFSET);
  out[RES_X_OFFSET] = canvasW;
  out[RES_Y_OFFSET] = canvasH;
  out[TIME_OFFSET] = time;
  out[PULSE_SPEED_OFFSET] = PULSE_SPEED;

  for (let i = 0; i < 3; i++) {
    const o = PULSE_SLOTS_OFFSET + i * 4;
    const p = pulse.pos[i];
    out[o + 0] = p[0];
    out[o + 1] = p[1];
    out[o + 2] = p[2];
    out[o + 3] = pulse.times[i];
  }

  out[PULSE_TINT_OFFSET + 0] = pulse.tint[0];
  out[PULSE_TINT_OFFSET + 1] = pulse.tint[1];
  out[PULSE_TINT_OFFSET + 2] = pulse.tint[2];
  out[PULSE_TINT_OFFSET + 3] = 0;
};
