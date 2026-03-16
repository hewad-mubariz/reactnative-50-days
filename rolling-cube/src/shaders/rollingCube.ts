import { Skia } from "@shopify/react-native-skia";

export const imageSource = Skia.RuntimeEffect.Make(`
uniform float2 iResolution;
uniform float iMat[16];
uniform shader img1, img2, img3, img4, img5, img6;

float sdBox(vec3 p, vec3 b) {
  vec3 q = abs(p) - b;
  return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0);
}

half4 main(vec2 fragCoord) {
  vec2 uv = (fragCoord - 0.5 * iResolution.xy) / min(iResolution.y, iResolution.x);

  vec3 ro = vec3(0.0, 0.0, -2.5);
  vec3 rd = normalize(vec3(uv, 1.5));

  mat4 m = mat4(
    iMat[0], iMat[1], iMat[2], iMat[3],
    iMat[4], iMat[5], iMat[6], iMat[7],
    iMat[8], iMat[9], iMat[10], iMat[11],
    iMat[12], iMat[13], iMat[14], iMat[15]
  );

  float t = 0.0;
  for (int i = 0; i < 64; i++) {
    vec3 p = (m * vec4(ro + rd * t, 1.0)).xyz;
    float d = sdBox(p, vec3(0.45));
    if (d < 0.001 || t > 10.0) break;
    t += d;
  }

  if (t < 10.0) {
    vec3 p = (m * vec4(ro + rd * t, 1.0)).xyz;
    vec3 absN = abs(normalize(p));
    vec2 texUV;
    vec4 texCol;

    if (absN.x > absN.y && absN.x > absN.z) {
      texUV = (p.zy / 0.9) + 0.5;
      texCol = p.x > 0.0 ? img1.eval(texUV * iResolution) : img2.eval(texUV * iResolution);
    } else if (absN.y > absN.x && absN.y > absN.z) {
      texUV = (p.xz / 0.9) + 0.5;
      texCol = p.y > 0.0 ? img3.eval(texUV * iResolution) : img4.eval(texUV * iResolution);
    } else {
      texUV = (p.xy / 0.9) + 0.5;
      texCol = p.z > 0.0 ? img5.eval(texUV * iResolution) : img6.eval(texUV * iResolution);
    }

    float light = max(dot(normalize(p), normalize(vec3(0.2, 0.45, -1.0))), 0.72);
    return texCol * light;
  }

  return vec4(0.03, 0.03, 0.05, 1.0);
}
`)!;

export const gradientSource = Skia.RuntimeEffect.Make(`
uniform float2 iResolution;
uniform float iMat[16];

float sdBox(vec3 p, vec3 b) {
  vec3 q = abs(p) - b;
  return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0);
}

vec3 paletteA(float t) {
  vec3 c1 = vec3(0.12, 0.29, 0.92);
  vec3 c2 = vec3(0.49, 0.17, 0.98);
  vec3 c3 = vec3(0.97, 0.36, 0.75);
  return mix(mix(c1, c2, smoothstep(0.0, 0.6, t)), c3, smoothstep(0.45, 1.0, t));
}

vec3 paletteB(float t) {
  vec3 c1 = vec3(0.04, 0.78, 0.72);
  vec3 c2 = vec3(0.11, 0.42, 0.98);
  vec3 c3 = vec3(0.72, 0.29, 1.0);
  return mix(mix(c1, c2, smoothstep(0.0, 0.55, t)), c3, smoothstep(0.5, 1.0, t));
}

vec3 paletteC(float t) {
  vec3 c1 = vec3(1.0, 0.55, 0.25);
  vec3 c2 = vec3(0.97, 0.18, 0.49);
  vec3 c3 = vec3(0.48, 0.12, 0.96);
  return mix(mix(c1, c2, smoothstep(0.0, 0.55, t)), c3, smoothstep(0.45, 1.0, t));
}

vec3 paletteD(float t) {
  vec3 c1 = vec3(0.09, 0.09, 0.16);
  vec3 c2 = vec3(0.18, 0.30, 0.64);
  vec3 c3 = vec3(0.73, 0.89, 1.0);
  return mix(mix(c1, c2, smoothstep(0.0, 0.65, t)), c3, smoothstep(0.6, 1.0, t));
}

vec3 meshGradient(vec2 uv, float seed) {
  vec2 p = uv - 0.5;

  vec2 p1 = vec2(0.18 + seed * 0.07, 0.22 + seed * 0.03);
  vec2 p2 = vec2(0.80 - seed * 0.04, 0.28 + seed * 0.05);
  vec2 p3 = vec2(0.28 + seed * 0.03, 0.82 - seed * 0.04);
  vec2 p4 = vec2(0.78 - seed * 0.05, 0.76 - seed * 0.02);

  float g1 = exp(-7.0 * distance(uv, p1) * distance(uv, p1));
  float g2 = exp(-8.0 * distance(uv, p2) * distance(uv, p2));
  float g3 = exp(-7.5 * distance(uv, p3) * distance(uv, p3));
  float g4 = exp(-9.0 * distance(uv, p4) * distance(uv, p4));

  float blend = g1 * 0.95 + g2 * 0.85 + g3 * 0.75 + g4 * 0.9;
  blend = clamp(blend, 0.0, 1.0);

  float diagonal = smoothstep(-0.25, 0.95, uv.x * 0.7 + uv.y * 0.9);
  float radial = 1.0 - smoothstep(0.0, 0.95, length(p) * 1.35);
  float stripe = 0.5 + 0.5 * sin((uv.x - uv.y) * 8.0 + seed * 8.0);
  stripe *= 0.08;

  vec3 col;

  if (seed < 0.2) {
    col = paletteA(blend * 0.9 + diagonal * 0.3);
  } else if (seed < 0.4) {
    col = paletteB(blend * 0.85 + radial * 0.35);
  } else if (seed < 0.6) {
    col = paletteC(blend * 0.9 + diagonal * 0.25);
  } else {
    col = paletteD(blend * 0.8 + radial * 0.45);
  }

  col += stripe;
  col += radial * 0.08;

  // Soft glossy corner highlight
  float gloss = exp(-18.0 * distance(uv, vec2(0.22, 0.18)) * distance(uv, vec2(0.22, 0.18)));
  col += gloss * 0.18;

  return clamp(col, 0.0, 1.0);
}

half4 main(vec2 fragCoord) {
  vec2 uv = (fragCoord - 0.5 * iResolution.xy) / min(iResolution.y, iResolution.x);

  vec3 ro = vec3(0.0, 0.0, -2.5);
  vec3 rd = normalize(vec3(uv, 1.5));

  mat4 m = mat4(
    iMat[0], iMat[1], iMat[2], iMat[3],
    iMat[4], iMat[5], iMat[6], iMat[7],
    iMat[8], iMat[9], iMat[10], iMat[11],
    iMat[12], iMat[13], iMat[14], iMat[15]
  );

  float t = 0.0;
  for (int i = 0; i < 64; i++) {
    vec3 p = (m * vec4(ro + rd * t, 1.0)).xyz;
    float d = sdBox(p, vec3(0.45));
    if (d < 0.001 || t > 10.0) break;
    t += d;
  }

  if (t < 10.0) {
    vec3 p = (m * vec4(ro + rd * t, 1.0)).xyz;
    vec3 n = normalize(p);
    vec3 absN = abs(n);

    vec2 faceUV;
    float seed = 0.0;

    if (absN.x > absN.y && absN.x > absN.z) {
      faceUV = (p.zy / 0.9) + 0.5;
      seed = p.x > 0.0 ? 0.10 : 0.30;
    } else if (absN.y > absN.x && absN.y > absN.z) {
      faceUV = (p.xz / 0.9) + 0.5;
      seed = p.y > 0.0 ? 0.50 : 0.70;
    } else {
      faceUV = (p.xy / 0.9) + 0.5;
      seed = p.z > 0.0 ? 0.15 : 0.55;
    }

    vec3 col = meshGradient(faceUV, seed);

    float light = max(dot(n, normalize(vec3(0.22, 0.55, -1.0))), 0.72);
    float fresnel = pow(1.0 - max(dot(n, normalize(vec3(0.0, 0.0, -1.0))), 0.0), 2.0);

    col += fresnel * 0.10;

    return vec4(col * light, 1.0);
  }

  vec2 bg = fragCoord / iResolution.xy;
  vec3 bgCol = mix(
    vec3(0.03, 0.04, 0.08),
    vec3(0.01, 0.01, 0.03),
    bg.y
  );

  return vec4(bgCol, 1.0);
}
`)!;
