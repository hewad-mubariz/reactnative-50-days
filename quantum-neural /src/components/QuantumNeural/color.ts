import type { RGB, Vec3 } from "./types";

export const rgbToHsl = (r: number, g: number, b: number): Vec3 => {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  return [h, s, l];
};

const hue2rgb = (p: number, q: number, t: number): number => {
  let tt = t;
  if (tt < 0) tt += 1;
  if (tt > 1) tt -= 1;
  if (tt < 1 / 6) return p + (q - p) * 6 * tt;
  if (tt < 1 / 2) return q;
  if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6;
  return p;
};

export const hslToRgb = (h: number, s: number, l: number): Vec3 => {
  if (s === 0) return [l, l, l];
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  return [hue2rgb(p, q, h + 1 / 3), hue2rgb(p, q, h), hue2rgb(p, q, h - 1 / 3)];
};

export const offsetHsl = (
  rgb: RGB,
  dh: number,
  ds: number,
  dl: number,
): Vec3 => {
  const [h, s, l] = rgbToHsl(rgb[0], rgb[1], rgb[2]);
  let nh = (h + dh) % 1;
  if (nh < 0) nh += 1;
  const ns = Math.max(0, Math.min(1, s + ds));
  const nl = Math.max(0, Math.min(1, l + dl));
  return hslToRgb(nh, ns, nl);
};

export const spread = (range: number) => (Math.random() - 0.5) * range;
