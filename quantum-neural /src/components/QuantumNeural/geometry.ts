import { offsetHsl, spread } from "./color";
import {
  CROSS_SHELL_CONNECTIONS,
  NETWORK_LAYERS,
  NETWORK_POINT_FACTOR,
  PREV_LAYER_NEIGHBORS,
  RADIUS_PER_LAYER,
  SAME_LAYER_NEIGHBORS,
  STAR_BLUE_FRACTION,
  STAR_BRIGHT_SIZE_MAX,
  STAR_BRIGHT_SIZE_MIN,
  STAR_COUNT,
  STAR_INNER_RADIUS,
  STAR_OUTER_RADIUS,
  STAR_STRIDE_FLOATS,
  STAR_TINY_FRACTION,
  STAR_TINY_SIZE_MAX,
  STAR_TINY_SIZE_MIN,
  STAR_WHITE_FRACTION,
} from "./constants";
import { THEMES } from "./themes";
import type { Network, NetworkNode, Vec3 } from "./types";

const dist2 = (a: Vec3, b: Vec3): number => {
  const dx = a[0] - b[0];
  const dy = a[1] - b[1];
  const dz = a[2] - b[2];
  return dx * dx + dy * dy + dz * dz;
};

/**
 * Builds the instanced star vertex buffer.
 * Layout per star: vec3 pos, f32 size, vec3 color, f32 phase  (8 floats).
 */
export const generateStarBuffer = (): Float32Array<ArrayBuffer> => {
  const data = new Float32Array(STAR_COUNT * STAR_STRIDE_FLOATS);
  const blueThreshold = STAR_WHITE_FRACTION + STAR_BLUE_FRACTION;

  for (let i = 0; i < STAR_COUNT; i++) {
    const o = i * STAR_STRIDE_FLOATS;

    // Uniform-on-sphere sample then scale to a random radius shell.
    const cosPhi = Math.random() * 2 - 1;
    const sinPhi = Math.sqrt(Math.max(0, 1 - cosPhi * cosPhi));
    const theta = Math.random() * Math.PI * 2;
    const r =
      STAR_INNER_RADIUS +
      (STAR_OUTER_RADIUS - STAR_INNER_RADIUS) * Math.random();
    data[o + 0] = r * sinPhi * Math.cos(theta);
    data[o + 1] = r * cosPhi;
    data[o + 2] = r * sinPhi * Math.sin(theta);

    const sizeSample = Math.random();
    data[o + 3] =
      sizeSample < STAR_TINY_FRACTION
        ? STAR_TINY_SIZE_MIN +
          Math.random() * (STAR_TINY_SIZE_MAX - STAR_TINY_SIZE_MIN)
        : STAR_BRIGHT_SIZE_MIN +
          Math.random() * (STAR_BRIGHT_SIZE_MAX - STAR_BRIGHT_SIZE_MIN);

    const colorSample = Math.random();
    if (colorSample < STAR_WHITE_FRACTION) {
      data[o + 4] = 1.0;
      data[o + 5] = 1.0;
      data[o + 6] = 1.0;
    } else if (colorSample < blueThreshold) {
      data[o + 4] = 0.78;
      data[o + 5] = 0.86;
      data[o + 6] = 1.0;
    } else {
      data[o + 4] = 1.0;
      data[o + 5] = 0.92;
      data[o + 6] = 0.78;
    }

    data[o + 7] = Math.random() * Math.PI * 2;
  }

  return data;
};

/**
 * Builds the layered crystalline neural network: nested sphere shells with
 * Fibonacci-distributed nodes and short-edge connectivity.
 */
export const generateNetwork = (): Network => {
  const nodes: NetworkNode[] = [];
  nodes.push({ position: [0, 0, 0], level: 0, size: 0.024 });

  const goldenRatio = (1 + Math.sqrt(5)) / 2;
  for (let layer = 1; layer <= NETWORK_LAYERS; layer++) {
    const radius = layer * RADIUS_PER_LAYER;
    const numPoints = Math.max(
      1,
      Math.round(layer * 12 * NETWORK_POINT_FACTOR),
    );
    for (let i = 0; i < numPoints; i++) {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / numPoints);
      const theta = (2 * Math.PI * i) / goldenRatio;
      nodes.push({
        position: [
          radius * Math.sin(phi) * Math.cos(theta),
          radius * Math.sin(phi) * Math.sin(theta),
          radius * Math.cos(phi),
        ],
        level: layer,
        size: 0.013 + 0.009 * (1 - layer / NETWORK_LAYERS),
      });
    }
  }

  const seen = new Set<number>();
  const edges: Array<[number, number]> = [];
  const totalNodes = nodes.length;
  const addEdge = (i: number, j: number) => {
    if (i === j) return;
    const a = i < j ? i : j;
    const b = i < j ? j : i;
    const key = a * totalNodes + b;
    if (!seen.has(key)) {
      seen.add(key);
      edges.push([a, b]);
    }
  };

  const indicesByLevel: number[][] = Array.from(
    { length: NETWORK_LAYERS + 1 },
    () => [],
  );
  nodes.forEach((n, idx) => indicesByLevel[n.level].push(idx));

  for (const idx of indicesByLevel[1]) addEdge(0, idx);

  // Connect each shell to its closest few neighbors in the previous shell.
  for (let layer = 2; layer <= NETWORK_LAYERS; layer++) {
    const prev = indicesByLevel[layer - 1];
    for (const idx of indicesByLevel[layer]) {
      const sorted = prev
        .slice()
        .sort(
          (a, b) =>
            dist2(nodes[idx].position, nodes[a].position) -
            dist2(nodes[idx].position, nodes[b].position),
        );
      for (let k = 0; k < Math.min(PREV_LAYER_NEIGHBORS, sorted.length); k++) {
        addEdge(idx, sorted[k]);
      }
    }
  }

  // Same-shell connectivity, gated by an arc-length threshold so edges only
  // form between physically nearby points.
  for (let layer = 1; layer <= NETWORK_LAYERS; layer++) {
    const radius = layer * RADIUS_PER_LAYER;
    const threshold2 = (radius * 0.8) ** 2;
    const layerIdx = indicesByLevel[layer];
    for (const idx of layerIdx) {
      const sorted = layerIdx
        .filter((j) => j !== idx)
        .sort(
          (a, b) =>
            dist2(nodes[idx].position, nodes[a].position) -
            dist2(nodes[idx].position, nodes[b].position),
        );
      let added = 0;
      for (const candidate of sorted) {
        if (added >= SAME_LAYER_NEIGHBORS) break;
        if (
          dist2(nodes[idx].position, nodes[candidate].position) < threshold2
        ) {
          addEdge(idx, candidate);
          added++;
        }
      }
    }
  }

  // A few long cross-shell wires for visual interest.
  const outer: number[] = [];
  nodes.forEach((n, i) => {
    if (n.level >= 3) outer.push(i);
  });
  for (let i = 0; i < CROSS_SHELL_CONNECTIONS && outer.length > 1; i++) {
    const a = outer[Math.floor(Math.random() * outer.length)];
    const b = outer[Math.floor(Math.random() * outer.length)];
    if (a !== b && Math.abs(nodes[a].level - nodes[b].level) > 1) {
      addEdge(a, b);
    }
  }

  return { nodes, edges };
};

/**
 * Computes per-instance node + line colors for a given theme palette,
 * applying per-instance HSL jitter so the sphere reads as a chorus rather
 * than monochromatic shells.
 */
export const computeColors = (
  network: Network,
  themeIdx: number,
): {
  nodeColors: Float32Array<ArrayBuffer>;
  lineColors: Float32Array<ArrayBuffer>;
} => {
  const palette = THEMES[themeIdx];
  const nodeColors = new Float32Array(network.nodes.length * 3);
  const lineColors = new Float32Array(network.edges.length * 3);

  for (let i = 0; i < network.nodes.length; i++) {
    const n = network.nodes[i];
    const idx = Math.min(n.level, palette.length - 1);
    const c = offsetHsl(palette[idx], spread(0.03), spread(0.08), spread(0.08));
    nodeColors[i * 3 + 0] = c[0];
    nodeColors[i * 3 + 1] = c[1];
    nodeColors[i * 3 + 2] = c[2];
  }

  for (let i = 0; i < network.edges.length; i++) {
    const [a, b] = network.edges[i];
    const avg = Math.min(
      Math.floor((network.nodes[a].level + network.nodes[b].level) / 2),
      palette.length - 1,
    );
    const c = offsetHsl(palette[avg], spread(0.03), spread(0.08), spread(0.08));
    lineColors[i * 3 + 0] = c[0];
    lineColors[i * 3 + 1] = c[1];
    lineColors[i * 3 + 2] = c[2];
  }

  return { nodeColors, lineColors };
};

/**
 * Packs node positions and per-node sizes into the instanced vertex layout
 * (`vec3 pos, f32 size`). Static data — written once at creation.
 */
export const packNodePositions = (
  network: Network,
): Float32Array<ArrayBuffer> => {
  const data = new Float32Array(network.nodes.length * 4);
  for (let i = 0; i < network.nodes.length; i++) {
    const n = network.nodes[i];
    data[i * 4 + 0] = n.position[0];
    data[i * 4 + 1] = n.position[1];
    data[i * 4 + 2] = n.position[2];
    data[i * 4 + 3] = n.size;
  }
  return data;
};

/**
 * Packs edge endpoints and edge indices into the instanced line vertex layout
 * (`vec3 startP, _pad, vec3 endP, f32 edgeIndex`).
 */
export const packLinePositions = (
  network: Network,
): Float32Array<ArrayBuffer> => {
  const data = new Float32Array(network.edges.length * 8);
  for (let i = 0; i < network.edges.length; i++) {
    const [a, b] = network.edges[i];
    const o = i * 8;
    const pa = network.nodes[a].position;
    const pb = network.nodes[b].position;
    data[o + 0] = pa[0];
    data[o + 1] = pa[1];
    data[o + 2] = pa[2];
    data[o + 3] = 0;
    data[o + 4] = pb[0];
    data[o + 5] = pb[1];
    data[o + 6] = pb[2];
    data[o + 7] = i;
  }
  return data;
};
