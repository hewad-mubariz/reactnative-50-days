import React, { useEffect } from "react";
import {
  Circle as SkiaCircle,
  Skia,
  SkMatrix,
  Group,
  Line,
  ColorMatrix,
} from "@shopify/react-native-skia";
import {
  BAR_WIDTH,
  DISMISS_DURATION,
  DURATION,
  EMOJI_SIZE,
  EMOJI_TRANSLATE_Y,
} from "../constants/reactions";
import {
  SharedValue,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

type CircleProps = {
  index: number;
  matrix: SharedValue<SkMatrix>;
  isActive: boolean;
};
const Circle = ({ index, matrix, isActive }: CircleProps) => {
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);
  const transform = useDerivedValue(() => {
    return [{ translateY: translateY.value }];
  });

  useEffect(() => {
    if (isActive) {
      opacity.value = withDelay(
        DURATION * 1.2,
        withTiming(0, { duration: 500 })
      );
      translateY.value = withTiming(translateY.value - EMOJI_TRANSLATE_Y, {
        duration: DURATION,
      });
    } else {
      opacity.value = withTiming(1, { duration: DISMISS_DURATION });
      translateY.value = withTiming(0, { duration: DISMISS_DURATION });
    }
  }, [isActive]);

  // Calculate the x position based on the index
  const circleXPosition = -BAR_WIDTH / 2 + 35 + index * 45;

  return (
    <Group transform={transform}>
      {/* Main Circle */}
      <SkiaCircle
        opacity={opacity}
        cx={circleXPosition}
        cy={0}
        r={EMOJI_SIZE}
        color="#FFFFFF"
      />
      {/* Apply the same transform to the lines */}
      <Group
        layer={
          <ColorMatrix
            matrix={[
              1,
              0,
              0,
              0,
              0, // Red channel
              0,
              1,
              0,
              0,
              0, // Green channel
              0,
              0,
              1,
              0,
              0, // Blue channel
              0,
              0,
              0,
              1,
              0, // Alpha channel
            ]}
          />
        }
      ></Group>
    </Group>
  );
};

export default Circle;
