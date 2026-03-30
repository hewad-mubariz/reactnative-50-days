import {
  Atlas,
  BlurMask,
  Canvas,
  Group,
  LinearGradient,
  Path,
  Skia,
  vec,
  rect,
  useRSXformBuffer,
  useTexture,
} from "@shopify/react-native-skia";
import React from "react";
import { useWindowDimensions } from "react-native";
import {
  interpolate,
  useFrameCallback,
  useSharedValue,
  Extrapolation,
} from "react-native-reanimated";

const PARTICLE_COUNT = 400;
const TEX_W = 90;
const TEX_H = 40;
const BASE_SPEED = 450;
const GRAVITY = 60;
const DRAG = 0.96;

const rand = (min: number, max: number) => {
  "worklet";
  return Math.random() * (max - min) + min;
};

export function FireworkField({
  burst,
}: {
  burst: { x: number; y: number; power: number; tick: number };
}) {
  const { width, height } = useWindowDimensions();

  const palette = React.useMemo(
    () => ({ edge: "#c8ff63", core: "#f5ff9f", glow: "#98e73a" }),
    [],
  );

  const particles = useSharedValue<any[]>([]);
  const sprites = new Array(PARTICLE_COUNT)
    .fill(0)
    .map(() => rect(0, 0, TEX_W, TEX_H));

  const transforms = useRSXformBuffer(PARTICLE_COUNT, (val, i) => {
    "worklet";
    const p = particles.value[i];
    if (!p || p.life <= 0) {
      val.set(0, 0, -1000, -1000);
      return;
    }

    const age = 1 - p.life / p.maxLife;
    const scale = interpolate(
      age,
      [0, 0.1, 0.8, 1],
      [0, p.size, p.size, 0],
      Extrapolation.CLAMP,
    );

    /**
     * THE TRANSFORM FIX:
     * We want the pivot to be the 'Head' (x=65, y=20).
     * By subtracting the rotated and scaled offset from the position,
     * we move the 'origin' from the tail to the head.
     */
    const pivotX = 65;
    const pivotY = 20;

    const cos = Math.cos(p.fixedRotation);
    const sin = Math.sin(p.fixedRotation);

    // Offset math: position - (rotatedPivot * scale)
    const tx = p.x - (pivotX * scale * cos - pivotY * scale * sin);
    const ty = p.y - (pivotX * scale * sin + pivotY * scale * cos);

    val.set(scale * cos, scale * sin, tx, ty);
  });

  useFrameCallback((frame) => {
    "worklet";
    if (particles.value.length === 0) return;
    const dt = (frame.timeSincePreviousFrame ?? 16) / 1000;

    particles.value = particles.value.map((p) => {
      const vx = p.vx * DRAG;
      const vy = p.vy * DRAG + GRAVITY * dt;
      return {
        ...p,
        x: p.x + vx * dt,
        y: p.y + vy * dt,
        vx,
        vy,
        life: p.life - dt,
      };
    });
  });

  React.useEffect(() => {
    if (!burst.tick) return;
    const newParticles = new Array(PARTICLE_COUNT).fill(0).map((_, i) => {
      const angle = rand(0, Math.PI * 2);

      // Keep center filled by making some particles very slow
      const isFiller = i % 5 === 0;
      const speed = isFiller
        ? rand(10, 50)
        : BASE_SPEED * burst.power * rand(0.3, 1.6);

      const life = rand(1.2, 2.0);
      return {
        x: burst.x,
        y: burst.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life,
        maxLife: life,
        fixedRotation: angle,
        size: isFiller ? rand(0.4, 0.6) : rand(0.7, 1.3),
      };
    });
    particles.value = newParticles;
  }, [burst.tick]);

  const needlePath = React.useMemo(() => {
    const path = Skia.Path.Make();
    const tailX = 0;
    const headX = 65;
    const midY = 20;
    const headWidth = 7;

    path.moveTo(tailX, midY);
    path.lineTo(headX, midY - headWidth / 2);
    path.arcToOval(
      rect(headX - headWidth / 2, midY - headWidth / 2, headWidth, headWidth),
      270,
      180,
      true,
    );
    path.lineTo(tailX, midY);
    path.close();
    return path;
  }, []);

  const texture = useTexture(
    <Group>
      <Path path={needlePath}>
        <LinearGradient
          start={vec(0, 20)}
          end={vec(70, 20)}
          colors={["transparent", palette.edge, palette.core, "#faffd6"]}
        />
        <BlurMask blur={1} style="normal" />
      </Path>
    </Group>,
    { width: TEX_W, height: TEX_H },
  );

  return (
    <Canvas style={{ width, height, backgroundColor: "#000" }}>
      <Group blendMode="plus">
        <Atlas image={texture} sprites={sprites} transforms={transforms} />
      </Group>
    </Canvas>
  );
}
