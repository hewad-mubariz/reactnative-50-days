import { requireNativeView } from "expo";
import * as React from "react";

import type { BackgroundBlurViewProps } from "./BackgroundBlur.types";

const NativeView: React.ComponentType<BackgroundBlurViewProps> =
  requireNativeView("BackgroundBlur");

const BackgroundBlurView = React.forwardRef<
  React.ComponentRef<typeof NativeView>,
  BackgroundBlurViewProps
>(function BackgroundBlurView(props, ref) {
  return <NativeView ref={ref} {...props} />;
});

export default BackgroundBlurView;
