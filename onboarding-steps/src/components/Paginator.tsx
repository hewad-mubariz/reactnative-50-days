import { StyleSheet, View } from "react-native";
import React, { FC } from "react";
import Animated, {
  useAnimatedStyle,
  SharedValue,
  interpolate,
} from "react-native-reanimated";
import { Dot, DOT_SIZE } from "./Dot";

const GAP = DOT_SIZE * 2;
const PROGRESS_VIEW_SIZE = DOT_SIZE * 2.6;
const LEFT_SPACE = -(PROGRESS_VIEW_SIZE - DOT_SIZE) / 2;

export const Paginator: FC<{
  itemsLength: number;
  activeIndex: number;
  animatedIndex: SharedValue<number>;
}> = ({ itemsLength, activeIndex, animatedIndex }) => {
  const processView = useAnimatedStyle(() => {
    const width = interpolate(
      animatedIndex.value,
      [0, itemsLength - 1],
      [
        PROGRESS_VIEW_SIZE,
        itemsLength * (DOT_SIZE + GAP) - GAP + PROGRESS_VIEW_SIZE - DOT_SIZE,
      ]
    );

    return { width, left: LEFT_SPACE };
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[processView, styles.processView]} />
      {Array.from({ length: itemsLength }).map((_, index) => (
        <Dot
          activeIndex={activeIndex}
          key={index}
          index={index}
          animatedIndex={animatedIndex}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    columnGap: GAP,
    position: "relative",
    alignItems: "center",
  },
  processView: {
    backgroundColor: "#1fbe52",
    position: "absolute",
    height: PROGRESS_VIEW_SIZE,
    borderRadius: PROGRESS_VIEW_SIZE / 2,
    zIndex: -1,
  },
});
