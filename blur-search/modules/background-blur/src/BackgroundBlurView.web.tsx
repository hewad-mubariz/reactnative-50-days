import * as React from "react";

import { BackgroundBlurViewProps } from "./BackgroundBlur.types";

export default function BackgroundBlurView(props: BackgroundBlurViewProps) {
  const { style, tintColor, children } = props;
  return (
    <div
      style={{
        position: "relative",
        backdropFilter: `blur(${Math.max(props.radius ?? 20, 0)}px)`,
        WebkitBackdropFilter: `blur(${Math.max(props.radius ?? 20, 0)}px)`,
        backgroundColor: tintColor,
        // @ts-expect-error RN style types don't fully overlap with CSSProperties
        ...style,
      }}
    >
      {children}
    </div>
  );
}
