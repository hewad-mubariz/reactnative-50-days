import { mat4 } from "wgpu-matrix";

import { CAMERA_POS } from "../constants";
import type { Network, Vec3 } from "../types";

/**
 * Manual mat4 * vec4 — wgpu-matrix focuses on vec3 helpers.
 */
const transformVec4 = (
  out: number[],
  m: Float32Array,
  x: number,
  y: number,
  z: number,
  w: number,
): void => {
  out[0] = m[0] * x + m[4] * y + m[8] * z + m[12] * w;
  out[1] = m[1] * x + m[5] * y + m[9] * z + m[13] * w;
  out[2] = m[2] * x + m[6] * y + m[10] * z + m[14] * w;
  out[3] = m[3] * x + m[7] * y + m[11] * z + m[15] * w;
};

const NODE_SNAP_DISTANCE2 = 0.06;

/**
 * Builds a function that maps a normalized [0..1] tap coordinate to the
 * corresponding pulse origin in network-local space, snapping to the closest
 * network node when the hit lands within `NODE_SNAP_DISTANCE2`.
 */
export const createPulseRaycaster = (
  vp: Float32Array,
  model: Float32Array,
  network: Network,
) => {
  const tmpInvVP = mat4.identity();
  const tmpInvModel = mat4.identity();
  const tmpV4a: number[] = [0, 0, 0, 0];
  const tmpV4b: number[] = [0, 0, 0, 0];

  const camLen = Math.hypot(CAMERA_POS[0], CAMERA_POS[1], CAMERA_POS[2]);
  const planeNX = CAMERA_POS[0] / camLen;
  const planeNY = CAMERA_POS[1] / camLen;
  const planeNZ = CAMERA_POS[2] / camLen;

  return (nx: number, ny: number): Vec3 | null => {
    const ndcX = nx * 2 - 1;
    const ndcY = -(ny * 2 - 1);

    mat4.invert(vp, tmpInvVP);
    transformVec4(tmpV4a, tmpInvVP as Float32Array, ndcX, ndcY, 0, 1);
    const nearW: Vec3 = [
      tmpV4a[0] / tmpV4a[3],
      tmpV4a[1] / tmpV4a[3],
      tmpV4a[2] / tmpV4a[3],
    ];
    transformVec4(tmpV4b, tmpInvVP as Float32Array, ndcX, ndcY, 1, 1);
    const farW: Vec3 = [
      tmpV4b[0] / tmpV4b[3],
      tmpV4b[1] / tmpV4b[3],
      tmpV4b[2] / tmpV4b[3],
    ];
    const dirX = farW[0] - nearW[0];
    const dirY = farW[1] - nearW[1];
    const dirZ = farW[2] - nearW[2];

    // Intersect ray with the plane through origin perpendicular to the camera.
    const denom = planeNX * dirX + planeNY * dirY + planeNZ * dirZ;
    if (Math.abs(denom) < 1e-6) return null;
    const tHit =
      -(planeNX * nearW[0] + planeNY * nearW[1] + planeNZ * nearW[2]) / denom;
    const hitX = nearW[0] + tHit * dirX;
    const hitY = nearW[1] + tHit * dirY;
    const hitZ = nearW[2] + tHit * dirZ;

    // World → network local: invert the model matrix.
    mat4.invert(model, tmpInvModel);
    transformVec4(tmpV4a, tmpInvModel as Float32Array, hitX, hitY, hitZ, 1);
    const lx = tmpV4a[0] / tmpV4a[3];
    const ly = tmpV4a[1] / tmpV4a[3];
    const lz = tmpV4a[2] / tmpV4a[3];

    // Snap to the nearest node if the hit is close enough.
    let bestI = -1;
    let bestD2 = Number.POSITIVE_INFINITY;
    for (let i = 0; i < network.nodes.length; i++) {
      const np = network.nodes[i].position;
      const dx = np[0] - lx;
      const dy = np[1] - ly;
      const dz = np[2] - lz;
      const d2 = dx * dx + dy * dy + dz * dz;
      if (d2 < bestD2) {
        bestD2 = d2;
        bestI = i;
      }
    }
    if (bestI >= 0 && bestD2 < NODE_SNAP_DISTANCE2) {
      return [...network.nodes[bestI].position] as Vec3;
    }
    return [lx, ly, lz];
  };
};
