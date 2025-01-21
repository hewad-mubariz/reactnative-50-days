import React from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

type PaginationProps = {
  totalLength: number;
  currentIndex: number;
};

const Pagination: React.FC<PaginationProps> = ({
  totalLength,
  currentIndex,
}) => {
  const getStyle = (index: number) => {
    if (index === currentIndex) {
      return useAnimatedStyle(() => {
        return {
          opacity: withTiming(1, { duration: 300 }),
          transform: [{ scale: withTiming(1.2, { duration: 300 }) }],
        };
      });
    }
    return useAnimatedStyle(() => {
      return {
        opacity: withTiming(0.5, { duration: 300 }),
        transform: [{ scale: withTiming(1, { duration: 300 }) }],
      };
    });
  };

  return (
    <View style={styles.container}>
      {Array.from({ length: totalLength }).map((_, index) => {
        return (
          <Animated.View key={index} style={[styles.dot, getStyle(index)]} />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#333",
    marginHorizontal: 5,
  },
});

export default Pagination;
