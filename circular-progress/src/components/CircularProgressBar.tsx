import React from "react";
import { View, StyleSheet, Text, Pressable } from "react-native";
import Svg, { G } from "react-native-svg";
import Animated, {
  useSharedValue,
  withTiming,
  useDerivedValue,
  useAnimatedStyle,
  withSequence,
} from "react-native-reanimated";
import { ReText } from "react-native-redash";
import ProgressLine from "./ProgressLine";
import {
  CENTER,
  LINE_COUNT,
  SIZE,
  STROKE_WIDTH,
} from "../constants/progressCircle";
import { SCREEN_WIDTH } from "../constants/window";
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const svgHeight = SIZE + STROKE_WIDTH * 10; // Increased height to prevent overflow
const CircularProgressBar = () => {
  const progress = useSharedValue(0);
  const scale = useSharedValue(1);
  const startAnimation = () => {
    scale.value = withSequence(withTiming(0.9), withTiming(1));
    if (progress.value > 0) {
      progress.value = withTiming(0, { duration: 2000 });
    } else {
      const randomValue = 0.6 + Math.random() * 0.4;
      const roundedValue = Math.round(randomValue * 10) / 10;
      progress.value = withTiming(roundedValue, { duration: 2000 });
    }
  };
  // Create a derived value to display as text
  const progressText = useDerivedValue(() => {
    return `${Math.floor(progress.value * 100)}%`;
  });
  const buttonAStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <>
      <View style={styles.container}>
        <Svg
          width={SCREEN_WIDTH}
          height={svgHeight}
          viewBox={`0 -${STROKE_WIDTH * 5} ${SIZE} ${svgHeight}`}
          style={styles.svg}
        >
          <G origin={`${CENTER}, ${CENTER + STROKE_WIDTH * 5}`}>
            {Array.from({ length: LINE_COUNT }).map((_, index) => (
              <ProgressLine key={index} {...{ progress, index }} />
            ))}
          </G>
        </Svg>
        <View style={styles.progressContainer}>
          <ReText style={styles.text} text={progressText} />
          <Text style={{ color: "#ababab", fontSize: 20 }}>Processing</Text>
        </View>
      </View>
      <AnimatedPressable
        style={[styles.button, buttonAStyle]}
        onPress={startAnimation}
      >
        <Text style={styles.buttonText}>Start</Text>
      </AnimatedPressable>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  svg: {
    position: "absolute",
  },
  text: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  progressContainer: {
    position: "absolute",
    gap: 8,
    alignItems: "center",
  },
  button: {
    paddingVertical: 15,
    backgroundColor: "#FF6347",
    borderRadius: 25,
    alignItems: "center",
    width: SCREEN_WIDTH * 0.6,
    position: "absolute",
    bottom: 100,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default CircularProgressBar;
