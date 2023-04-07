import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import Svg, { Circle } from "react-native-svg";
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import IconButton from "../shared/IconButton";
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const radius = 50;
const circumference = radius * Math.PI * 2;
type Props = {
  index: number;
  onPress: () => void;
  screensLenght: number;
};
const centerX = 70;
const centerY = 70;
const CircularButton = ({ screensLenght, onPress, index }: Props) => {
  const strokeOffset = useSharedValue(circumference);
  const animatedCircleProps = useAnimatedProps(() => {
    return {
      strokeDashoffset: withTiming(strokeOffset.value, { duration: 500 }),
    };
  });
  useEffect(() => {
    let percentage = circumference / screensLenght;
    strokeOffset.value = circumference - percentage * (index + 1);
  }, [index]);
  return (
    <View
      style={{
        alignSelf: "center",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
      }}
    >
      <IconButton
        icon="arrow-right"
        onPress={onPress}
        roundness="full"
        size="big"
        style={{
          position: "absolute",
          zIndex: 2,
        }}
      />
      <Svg height={centerY * 2} width={centerX * 2}>
        <Circle
          cx={centerX}
          cy={centerY}
          r={radius}
          stroke="lightblue"
          strokeWidth="2"
        />
        <AnimatedCircle
          animatedProps={animatedCircleProps}
          cx={centerX}
          cy={centerY}
          r={radius}
          stroke="#4fafb0"
          strokeWidth="4"
          strokeLinecap={"round"}
          strokeDasharray={`${radius * Math.PI * 2}`}
        />
      </Svg>
    </View>
  );
};

export default CircularButton;

const styles = StyleSheet.create({});
