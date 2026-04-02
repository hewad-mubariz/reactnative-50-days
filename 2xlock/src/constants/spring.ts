import { ReduceMotion } from "react-native-reanimated";

export const springConfig = {
  stiffness: 840,
  damping: 70,
  mass: 2,
  overshootClamping: undefined,
  energyThreshold: 6e-9,
  velocity: 0,
  reduceMotion: ReduceMotion.System,
} as const;
