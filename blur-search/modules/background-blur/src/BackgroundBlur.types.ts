import type { ViewProps } from "react-native";

export type BackgroundBlurViewProps = ViewProps & {
  /**
   * Gaussian blur radius applied to content behind the view.
   * @default 20
   */
  radius?: number;

  /**
   * Tint color overlaid on top of the blur.
   * Accepts `#RRGGBB` or `#RRGGBBAA` hex strings.
   */
  tintColor?: string;

  /**
   * Opacity multiplier applied to the tint overlay, independent of the blur.
   * Clamped to [0, 1]. At 0 the tint is fully hidden regardless of `tintColor`.
   * Designed to be driven by a Reanimated shared value via `useAnimatedProps`.
   * @default 1
   */
  tintOpacity?: number;
};

export type ChangeEventPayload = {
  value: string;
};

export type BackgroundBlurModuleEvents = {
  onChange: (params: ChangeEventPayload) => void;
};
