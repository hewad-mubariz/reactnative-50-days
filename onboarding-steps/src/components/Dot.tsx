import React, { FC } from "react";
import { StyleSheet } from "react-native";

import Animated, {
  useAnimatedStyle,
  interpolateColor,
  SharedValue,
} from "react-native-reanimated";

type DotProps = {
  index: number;
  activeIndex: number;
  animatedIndex: SharedValue<number>;
};

export const DOT_SIZE = 10;

export const Dot: FC<DotProps> = ({ index, animatedIndex }) => {
  const animatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      animatedIndex.value,
      [index - 1, index],
      ["#E7DBD3", "white"]
    );
    return { backgroundColor };
  });

  return <Animated.View style={[styles.dot, animatedStyle]} />;
};
const styles = StyleSheet.create({
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE,
    backgroundColor: "#E7DBD3",
  },
});
