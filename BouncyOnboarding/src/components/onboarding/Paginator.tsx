import { StyleSheet, Text, View } from "react-native";
import React, { FC, Fragment } from "react";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
type Props = {
  itemsLength: number;
  activeIndex: number;
};
const SIZE = 10;
const GAP = 4;
const Paginator: FC<Props> = ({ itemsLength, activeIndex }) => {
  const dotAstyle = useAnimatedStyle(() => {
    return {
      left: withTiming(activeIndex * (SIZE + GAP)),
    };
  });
  return (
    <View
      style={{ flexDirection: "row", columnGap: GAP, position: "relative" }}
    >
      {Array.from({ length: itemsLength }).map((_, index) => {
        return <View key={index} style={[styles.dot]} />;
      })}
      <Animated.View style={[styles.activeDot, dotAstyle]} />
    </View>
  );
};

export default Paginator;

const styles = StyleSheet.create({
  dot: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE,
    backgroundColor: "#E7DBD3",
  },
  activeDot: {
    position: "absolute",
    backgroundColor: "black",
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE,
  },
});
