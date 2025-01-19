import React, { useState, useEffect } from "react";
import { StyleSheet, TextStyle, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

const DIGIT_HEIGHT = 45;
const WRAPPER_WIDTH = 25;
interface DigitProps {
  value: number;
  style?: TextStyle | TextStyle[];
}
export const Digit: React.FC<DigitProps> = React.memo(
  ({ value, style }) => {
    const translateY = useSharedValue(0);
    const [previousValue, setPreviousValue] = useState(value);
    const [currentValue, setCurrentValue] = useState(value);

    const previousAnimatedStyle = useAnimatedStyle(() => {
      return {
        transform: [{ translateY: translateY.value }],
      };
    });

    const currentAnimatedStyle = useAnimatedStyle(() => {
      return {
        transform: [{ translateY: translateY.value + DIGIT_HEIGHT }],
      };
    });

    useEffect(() => {
      if (currentValue !== value) {
        translateY.value = 0;
        setPreviousValue(currentValue);
        setCurrentValue(value);
        translateY.value = withTiming(-DIGIT_HEIGHT, { duration: 300 });
      }
    }, [value]);

    return (
      <View style={styles.digitContainer}>
        <Animated.Text style={[styles.digit, previousAnimatedStyle, style]}>
          {previousValue}
        </Animated.Text>
        <Animated.Text style={[styles.digit, currentAnimatedStyle, style]}>
          {currentValue}
        </Animated.Text>
      </View>
    );
  },
  (prevProps, nextProps) => prevProps.value === nextProps.value
);

const styles = StyleSheet.create({
  digitContainer: {
    height: DIGIT_HEIGHT,
    width: WRAPPER_WIDTH, // Slightly narrower to ensure digits are close together
    overflow: "hidden",
  },
  digit: {
    fontSize: 36,
    height: DIGIT_HEIGHT,
    lineHeight: DIGIT_HEIGHT,
    textAlign: "center",
    fontFamily: "Anton",
    color: "white",
    position: "absolute", // Ensure the text stays within the bounds
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
