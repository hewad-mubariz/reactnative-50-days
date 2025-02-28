import React, { FC } from "react";
import { Path, Skia, useClock, vec } from "@shopify/react-native-skia";
import {
  runOnJS,
  SharedValue,
  useAnimatedReaction,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";
import { createNoise2D } from "simplex-noise";
import { Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");
// Center Position (Make sure this matches the ApproxClock)
const CENTER = vec(width / 2, height / 2);

interface NoiseCircleProps {
  radius: number;
  color: string;
  strokeWidth: number | SharedValue<number>;
}

const C = 0.55228474983079;
const F = 1500; // Speed of noise changes
const A = 0.125; // Subtle noise
const n1 = createNoise2D();
const n2 = createNoise2D();
const n3 = createNoise2D();
const n4 = createNoise2D();

const NoiseCircle: FC<NoiseCircleProps> = ({ radius, color, strokeWidth }) => {
  const clock = useClock();
  const noiseValues = useSharedValue({ C1: C, C2: C, C3: C, C4: C });
  const updateNoiseValues = (t: number) => {
    runOnJS(() => {
      noiseValues.value = {
        C1: C + A * n1(t / F, 0),
        C2: C + A * n2(t / F, 0),
        C3: C + A * n3(t / F, 0),
        C4: C + A * n4(t / F, 0),
      };
    })();
  };
  useAnimatedReaction(
    () => clock.value,
    (t) => {
      runOnJS(updateNoiseValues)(t);
    },
    []
  );

  const path = useDerivedValue(() => {
    const { C1, C2, C3, C4 } = noiseValues.value;

    const p = Skia.Path.Make();
    p.moveTo(CENTER.x, CENTER.y - radius);
    p.cubicTo(
      CENTER.x + radius * C1,
      CENTER.y - radius,
      CENTER.x + radius,
      CENTER.y - radius * C1,
      CENTER.x + radius,
      CENTER.y
    );
    p.cubicTo(
      CENTER.x + radius,
      CENTER.y + radius * C2,
      CENTER.x + radius * C2,
      CENTER.y + radius,
      CENTER.x,
      CENTER.y + radius
    );
    p.cubicTo(
      CENTER.x - radius * C3,
      CENTER.y + radius,
      CENTER.x - radius,
      CENTER.y + radius * C3,
      CENTER.x - radius,
      CENTER.y
    );
    p.cubicTo(
      CENTER.x - radius,
      CENTER.y - radius * C4,
      CENTER.x - radius * C4,
      CENTER.y - radius,
      CENTER.x,
      CENTER.y - radius
    );

    p.close();
    return p;
  });

  return (
    <Path path={path} color={color} style="stroke" strokeWidth={strokeWidth} />
  );
};

export default NoiseCircle;
