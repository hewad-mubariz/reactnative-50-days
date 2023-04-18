import randomColor from "randomcolor";
import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

const VIEW_SIZE = 30;
const CIRCLE_SIZE = 300;
const CIRCLE_RADIUS = CIRCLE_SIZE / 2;
const ANGLE_PER_VIEW = (2 * Math.PI) / 9;

interface Props {
  index: number;
}

const LoaderItem: React.FC<Props> = ({ index }) => {
  const angle = ANGLE_PER_VIEW * index;
  const rotation = useSharedValue(0);
  const color = randomColor();

  const animatedStyle = useAnimatedStyle(() => {
    const radius = interpolate(
      rotation.value,
      [0, 180],
      [CIRCLE_RADIUS - VIEW_SIZE / 2, VIEW_SIZE * 3]
    );

    const x = CIRCLE_RADIUS + radius * Math.cos(angle) - VIEW_SIZE / 2;
    const y = CIRCLE_RADIUS + radius * Math.sin(angle) - VIEW_SIZE / 2;

    const scale = interpolate(rotation.value, [0, 180], [1, 2]);

    return {
      backgroundColor: color,
      borderRadius: interpolate(rotation.value, [0, 180], [VIEW_SIZE / 2, 0]),
      borderColor: "white",
      borderWidth: interpolate(rotation.value, [0, 180], [1, 2]),

      transform: [
        { translateX: x },
        { translateY: y },
        { scale: scale },
        { rotate: `${rotation.value}deg` },
      ],
    };
  });
  useEffect(() => {
    rotation.value = withRepeat(withTiming(180, { duration: 700 }), -1, true);
  }, []);
  return <Animated.View style={[styles.view, animatedStyle]} />;
};

export default LoaderItem;

const styles = StyleSheet.create({
  view: {
    width: VIEW_SIZE,
    height: VIEW_SIZE,
    borderRadius: VIEW_SIZE / 2,
    backgroundColor: "blue",
    position: "absolute",
  },
});
