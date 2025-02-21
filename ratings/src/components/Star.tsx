import React, { useEffect } from "react";
import {
  BlurMask,
  Circle,
  Group,
  interpolateColors,
  Path,
} from "@shopify/react-native-skia";
import {
  interpolate,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";

// Constants
const CIRCLE_CX = 2.6;
const CIRCLE_CY = 2.4;
const scaleFactor = 1.3;
const path1 = `M 25 3 L 31 19 L 16 31 L 3 19 L 19 19 Z`;
const path2 = `M 26 19 L 31 19 L 47 19 L 34 31 L 38.5 48 L 25 38.5 L 11.5 48 L 16 31 Z`;

const Star = ({
  index,
  starSize,
  spacing,
  isActive,
}: {
  index: number;
  starSize: number;
  spacing: number;
  isActive: boolean;
}) => {
  const scale = useSharedValue(0);
  const progress = useSharedValue(0);
  const translateY = useSharedValue(0);
  const circleScale = useSharedValue(1);

  useEffect(() => {
    if (isActive) {
      scale.value = withSpring(1, { damping: 15, stiffness: 160 });
      circleScale.value = withSpring(0);
    } else if (scale.value === 1) {
      progress.value = withTiming(1);
      circleScale.value = withDelay(250, withSpring(1));
      translateY.value = withDelay(
        300,
        withTiming(100, { duration: 200 }, () => {
          scale.value = 0;
          translateY.value = 0;
          progress.value = 0;
        })
      );
    }
  }, [isActive]);

  // Derived values
  const transform = useDerivedValue(() => [
    { scale: scale.value },
    { translateY: translateY.value },
  ]);

  const path1Transform = useDerivedValue(() => [
    { rotate: interpolate(progress.value, [0, 1], [0, -0.15]) },
  ]);

  const path2Transform = useDerivedValue(() => [
    { rotate: interpolate(progress.value, [0, 1], [0, 0.3]) },
    { translateX: interpolate(progress.value, [0, 1], [0, 12]) },
  ]);

  const blurIntensity = useDerivedValue(() =>
    interpolate(translateY.value, [0, 85], [0, 25])
  );

  const color = useDerivedValue(() =>
    interpolateColors(progress.value, [0, 1], ["#fdd00e", "#8a91b4"])
  );

  const circleTransform = useDerivedValue(() => [{ scale: circleScale.value }]);

  return (
    <Group
      key={index}
      transform={[
        { translateX: index * (starSize + spacing) },
        { scale: scaleFactor },
      ]}
    >
      {/* Circle (Initially visible, disappears when the star appears) */}
      {!isActive && (
        <Circle
          origin={{ x: starSize / CIRCLE_CX, y: starSize / CIRCLE_CY }}
          transform={circleTransform}
          cx={starSize / CIRCLE_CX}
          cy={starSize / CIRCLE_CY}
          r={starSize / 6}
          color="gray"
        />
      )}

      {/* Animated Star */}
      <Group
        origin={{ x: starSize / 2, y: starSize / 2 }}
        transform={transform}
        layer={<BlurMask blur={blurIntensity} />}
      >
        {/* Top Portion */}
        <Group transform={path1Transform}>
          <Path path={path1} color={color} />
        </Group>

        {/* Bottom Portion */}
        <Group transform={path2Transform}>
          <Path path={path2} color={color} />
        </Group>
      </Group>
    </Group>
  );
};

export default Star;
