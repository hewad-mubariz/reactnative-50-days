import { Dimensions, StyleSheet } from "react-native";
import React, { FC, useEffect } from "react";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");
const INITIAL_SIZE = width * 0.9;

type Props = {
  color: string;
  index: number;
};

const Shape: FC<Props> = ({ color, index }) => {
  const targetRotation = 30 + index * 15;
  const rotation = useSharedValue(0);
  const size = INITIAL_SIZE * (1 - index * 0.1);
  console.log(size * 0.02);

  const shapeAStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: color,
      width: size,
      height: size,
      borderRadius: interpolate(
        rotation.value,
        [0, targetRotation],
        [size / 2, 10]
      ),
      transform: [
        {
          scale: interpolate(rotation.value, [0, targetRotation], [1, 0.78]),
        },
        { rotate: `${rotation.value}deg` },
      ],
    };
  });

  useEffect(() => {
    rotation.value = withRepeat(
      withSequence(
        withTiming(targetRotation, { duration: 2000 }),
        withTiming(0, { duration: 2000 })
      ),
      -1,
      true
    );
  }, []);

  return <Animated.View style={[styles.shape, shapeAStyle]} />;
};

export default Shape;

const styles = StyleSheet.create({
  shape: {
    position: "absolute",
  },
});
