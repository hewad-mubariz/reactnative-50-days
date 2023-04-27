import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";

const SIZE = 300;
const BUTTON_SIZE = 50;
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const actionButtons = [
  { iconName: "home", color: "#4CAF50" },
  { iconName: "settings", color: "#FF9800" },
  { iconName: "users", color: "#2196F3" },
];

const FloatingButton = () => {
  const animationProgress = useSharedValue(0);
  const rotation = useSharedValue(0);
  const toggleMenu = () => {
    if (animationProgress.value === 0) {
      rotation.value = withTiming(45, { duration: 200 });
      animationProgress.value = withTiming(1, { duration: 300 });
    } else {
      rotation.value = withTiming(0, { duration: 200 });

      animationProgress.value = withTiming(0, { duration: 300 });
    }
  };

  const actionButtonAnimatedStyles = actionButtons.map((_, index) => {
    return useAnimatedStyle(() => {
      const translateY = interpolate(
        animationProgress.value,
        [0, 1],
        [0, -(index + 1) * (BUTTON_SIZE + 15)],
        Extrapolate.CLAMP
      );
      return {
        transform: [{ translateY }],
        opacity: animationProgress.value,
      };
    });
  });

  return (
    <>
      {actionButtons.map((button, index) => (
        <AnimatedPressable
          onPress={toggleMenu}
          key={button.iconName}
          style={[
            styles.actionButton,
            { backgroundColor: button.color },
            actionButtonAnimatedStyles[index],
          ]}
        >
          <Feather name={button.iconName} color={"white"} size={25} />
        </AnimatedPressable>
      ))}
      <AnimatedPressable style={[styles.button]} onPress={toggleMenu}>
        <Feather name="more-vertical" color={"white"} size={25} />
      </AnimatedPressable>
    </>
  );
};

export default FloatingButton;

const styles = StyleSheet.create({
  container: {
    borderRadius: SIZE / 2,
    backgroundColor: "#F73B71",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: -80,
    right: -100,
  },
  button: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#D24271",
    position: "absolute",
    bottom: 50,
    zIndex: 2,
    left: 25,
  },
  actionButton: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 50,
    zIndex: 1,
    left: 25,
  },
});
