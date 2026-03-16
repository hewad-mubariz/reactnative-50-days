import { SharedValue } from "react-native-reanimated";

type Cursor = { x: number; y: number; value: number };

type CursorPoint = {
  x: number;
  y: number;
  value: number;
};
type CursorAnimated = {
  x: SharedValue<number>;
  y: SharedValue<number>;
  value: SharedValue<number>;
  isCursorVisible: SharedValue<number>;
};
type AnimatedTextProps = {
  /** Numeric value — when it changes, the platform animates the transition. */
  value: number;
  fontSize?: number;
  fontWeight?: "normal" | "bold" | "600" | "700";
  style?: object;
};
export type { AnimatedTextProps, Cursor, CursorAnimated, CursorPoint };
