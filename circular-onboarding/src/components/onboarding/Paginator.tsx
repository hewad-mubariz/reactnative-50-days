import { StyleSheet, Text, View } from "react-native";
import React, { FC, useCallback } from "react";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { SCREEN_WIDTH } from "../../constants/screen";
const SIZE = 10;

type Props = {
  scrollX: Animated.SharedValue<number>;
  itemsLength: number;
};
const Paginator: FC<Props> = ({ scrollX, itemsLength }) => {
  const inputRange = new Array(itemsLength)
    .fill("")
    .map((_, i) => i * SCREEN_WIDTH);

  const getDotAnimatedStyle = useCallback((index: number) => {
    const outputRange = new Array(itemsLength)
      .fill("")
      .map((_, i) => (i === index ? SIZE * 2 : SIZE));
    return useAnimatedStyle(() => {
      const dotWidth = interpolate(
        scrollX.value,
        inputRange,
        outputRange,
        Extrapolate.CLAMP
      );
      return {
        width: dotWidth,
        borderRadius: dotWidth / 2,
      };
    });
  }, []);
  return (
    <View style={styles.container}>
      {new Array(itemsLength).fill("").map((_, index) => {
        return (
          <Animated.View
            key={index}
            style={[styles.item, getDotAnimatedStyle(index)]}
          />
        );
      })}
    </View>
  );
};

export default Paginator;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  item: {
    marginHorizontal: 4,
    height: SIZE,
    borderRadius: SIZE,
    backgroundColor: "#B9B7C7",
  },
});
