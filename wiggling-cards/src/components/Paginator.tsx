import { StyleSheet, View } from "react-native";
import React, { FC } from "react";
import Animated, {
  useAnimatedStyle,
  withTiming,
  interpolateColor,
} from "react-native-reanimated";

type DotProps = {
  index: number;
  activeIndex: number;
};

const SIZE = 14;
const GAP = 4;

const Dot: FC<DotProps> = ({ index, activeIndex }) => {
  const animatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      activeIndex,
      [index - 1, index, index + 1],
      ["#E7DBD3", "black", "#E7DBD3"]
    );
    return {
      backgroundColor: withTiming(backgroundColor, { duration: 300 }),
    };
  });

  return <Animated.View style={[styles.dot, animatedStyle]} />;
};

export const Paginator: FC<{ itemsLength: number; activeIndex: number }> = ({
  itemsLength,
  activeIndex,
}) => {
  return (
    <View style={{ flexDirection: "row", columnGap: GAP }}>
      {Array.from({ length: itemsLength }).map((_, index) => (
        <Dot key={index} index={index} activeIndex={activeIndex} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  dot: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE,
  },
});
