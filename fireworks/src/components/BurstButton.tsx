import React from "react";
import {
  LayoutChangeEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  Atlas,
  BlurMask,
  Canvas,
  Circle,
  Group,
  rect,
  useRSXformBuffer,
  useTexture,
} from "@shopify/react-native-skia";
import { useFrameCallback, useSharedValue } from "react-native-reanimated";

type Props = {
  onTrigger: () => void;
};

export function BurstButton({ onTrigger }: Props) {
  const [buttonWidth, setButtonWidth] = React.useState(260);
  const onButtonLayout = (e: LayoutChangeEvent) => {
    setButtonWidth(Math.max(1, Math.round(e.nativeEvent.layout.width)));
  };

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.actionBtn}
        onPress={onTrigger}
        onLayout={onButtonLayout}
      >
        <View style={styles.canvasWrap}>
          <ButtonAtlas width={buttonWidth} />
        </View>
        <Text style={styles.actionText}>BOOM</Text>
      </Pressable>
    </View>
  );
}

type MiniParticle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  fixedRotation: number;
  size: number;
};
const BTN_H = 52;
const MINI_TEX = 16;
const MINI_COUNT = 100;

const random = (min: number, max: number): number => {
  "worklet";
  return Math.random() * (max - min) + min;
};

function ButtonAtlas({ width }: { width: number }) {
  const spawnBurst = (
    cx: number,
    cy: number,
    count: number,
  ): MiniParticle[] => {
    "worklet";
    return new Array(count).fill(0).map((_, i) => {
      const angle = (i / count) * Math.PI * 2 + random(-0.08, 0.08);
      const speed = random(35, 120);
      const life = random(0.45, 0.95);
      return {
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life,
        maxLife: life,
        fixedRotation: angle,
        size: random(0.55, 1.1),
      };
    });
  };

  const spawnWave = (clusters: number): MiniParticle[] => {
    "worklet";
    const out: MiniParticle[] = [];
    const perCluster = Math.max(8, Math.floor(MINI_COUNT / 7));
    for (let c = 0; c < clusters; c++) {
      const zone = Math.floor(random(0, 8));
      const cx =
        zone === 0 || zone === 2
          ? random(6, width * 0.22)
          : zone === 1 || zone === 3
            ? random(width * 0.78, width - 6)
            : random(width * 0.1, width * 0.9);
      const cy =
        zone === 0 || zone === 1
          ? random(4, BTN_H * 0.28)
          : zone === 2 || zone === 3
            ? random(BTN_H * 0.72, BTN_H - 4)
            : random(BTN_H * 0.2, BTN_H * 0.8);
      out.push(...spawnBurst(cx, cy, perCluster));
    }
    return out;
  };

  const burstTimer = useSharedValue(0.06);
  const particles = useSharedValue<MiniParticle[]>(
    new Array(MINI_COUNT).fill(0).map(() => ({
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      life: -1,
      maxLife: 1,
      fixedRotation: 0,
      size: 0,
    })),
  );

  const sprites = new Array(MINI_COUNT)
    .fill(0)
    .map(() => rect(0, 0, MINI_TEX, MINI_TEX));
  const transforms = useRSXformBuffer(MINI_COUNT, (val, i) => {
    "worklet";
    const p = particles.value[i];
    if (!p || p.life <= 0) {
      val.set(0, 0, -1000, -1000);
      return;
    }
    const age = 1 - p.life / p.maxLife;
    const s = p.size * (1 - age * 0.85);
    val.set(
      s * Math.cos(p.fixedRotation),
      s * Math.sin(p.fixedRotation),
      p.x,
      p.y,
    );
  });

  useFrameCallback((frame) => {
    "worklet";
    const dt = Math.min((frame.timeSincePreviousFrame ?? 16) / 1000, 1 / 20);
    burstTimer.value -= dt;
    if (burstTimer.value <= 0) {
      const burst = spawnWave(Math.floor(random(1, 4))); // 1-3 mini explosions, desynced
      const next = particles.value.slice();
      let bi = 0;
      // Fill dead slots first
      for (let i = 0; i < next.length && bi < burst.length; i++) {
        if (next[i].life <= 0) {
          next[i] = burst[bi++];
        }
      }
      // If no slots left, overwrite random particles
      while (bi < burst.length) {
        next[Math.floor(random(0, next.length))] = burst[bi++];
      }
      particles.value = next;
      burstTimer.value = random(0.09, 0.26);
    }
    const next = particles.value.slice();
    for (let i = 0; i < next.length; i++) {
      const p = next[i];
      if (!p) continue;
      const vx = p.vx * 0.965;
      const vy = p.vy * 0.965;
      next[i] = {
        ...p,
        x: p.x + vx * dt,
        y: p.y + vy * dt,
        vx,
        vy,
        life: p.life - dt,
      };
    }
    particles.value = next;
  });

  const texture = useTexture(
    <Group>
      <Circle cx={MINI_TEX / 2} cy={MINI_TEX / 2} r={3} color="#ffffff">
        <BlurMask blur={4} style="normal" />
      </Circle>
      <Circle cx={MINI_TEX / 2} cy={MINI_TEX / 2} r={1.2} color="#a5c3ff" />
    </Group>,
    { width: MINI_TEX, height: MINI_TEX },
  );

  return (
    <Canvas style={{ width, height: BTN_H }}>
      <Atlas image={texture} sprites={sprites} transforms={transforms} />
    </Canvas>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 60,
  },
  actionBtn: {
    borderRadius: 999,
    paddingVertical: 15,
    alignItems: "center",
    overflow: "hidden",
    backgroundColor: "#4a6bff",
    borderWidth: 2,
    borderColor: "#8ea5ff",
  },
  canvasWrap: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.7,
  },
  actionText: {
    color: "#fff",
    fontWeight: "900",
    letterSpacing: 0.4,
    fontSize: 13,
  },
});
