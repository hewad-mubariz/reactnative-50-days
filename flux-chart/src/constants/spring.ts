import { ReduceMotion } from "react-native-reanimated";

const chartTransitionSpring = {
  stiffness: 2000,
  damping: 100,
  mass: 2,
  overshootClamping: undefined,
  energyThreshold: 6e-9,
  velocity: 0,
  reduceMotion: ReduceMotion.System,
};

export { chartTransitionSpring };
