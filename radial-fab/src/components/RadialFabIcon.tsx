import { Pressable, StyleSheet } from "react-native";
import React, { FC } from "react";
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { LucideIcon } from "lucide-react-native";
type Props = {
  index: number;
  Icon: LucideIcon;
  progress: SharedValue<number>;
};
const ICON_COUNT = 7;
const RADIUS = 100;
const ICON_SIZE = 35;
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const calculatePosition = (index: number) => {
  const angleRange = Math.PI; // Total angle covered by the arc (180 degrees)
  const angleStep = angleRange / (ICON_COUNT - 1); // Calculate the angle step between each icon
  return angleStep * index;
};
export const RadialFabIcon: FC<Props> = ({ index, Icon, progress }) => {
  const scale = useSharedValue(1);
  const animatedStyle = () => {
    const middlePoint = Math.floor(ICON_COUNT / 2);
    const startAngle = index >= middlePoint ? Math.PI * 1.3 : -Math.PI / 2;
    const endAngle = calculatePosition(index); // Target angle position on the arc

    return useAnimatedStyle(() => {
      // Interpolating the angle from the top of the circle to the target position
      const currentAngle = interpolate(
        progress.value,
        [0, 1],
        [startAngle, endAngle]
      );

      // Calculating the current x and y based on the interpolated angle
      const translateX = RADIUS * Math.cos(currentAngle);
      const translateY = -RADIUS * Math.sin(currentAngle); // Negative to make the arc open upwards

      // Interpolating opacity
      const opacity = interpolate(progress.value, [0, 1], [0, 1]);

      return {
        opacity,
        transform: [
          { translateX: translateX },
          { translateY: translateY },
          { scale: scale.value },
        ],
      };
    });
  };

  const handleScaleEffect = () => {
    scale.value = withTiming(scale.value === 1 ? 0.85 : 1);
  };

  return (
    <AnimatedPressable
      onPressIn={handleScaleEffect}
      onPressOut={handleScaleEffect}
      key={index}
      style={[styles.iconWrapper, animatedStyle()]}
    >
      <Icon size={ICON_SIZE} color="#c8523e" />
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  iconWrapper: {
    position: "absolute",
  },
});
