import React from "react";
import { View, StyleSheet, Pressable, useWindowDimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
} from "react-native-reanimated";
import {
  Heart,
  Star,
  Bell,
  Camera,
  Cloud,
  Sun,
  Moon,
  Plus,
} from "lucide-react-native";
import { RadialFabIcon } from "./RadialFabIcon";
const AnimatedPlusIcon = Animated.createAnimatedComponent(Plus);
const icons = [Star, Heart, Bell, Camera, Cloud, Sun, Moon];

export const RadialFab = () => {
  const { height: SCREEN_HEIGHT } = useWindowDimensions();
  const progress = useSharedValue(0);

  const plusIconAnimatedStyle = useAnimatedStyle(() => {
    const rotate = interpolate(progress.value, [0, 1], [0, 45]);
    return {
      transform: [{ rotate: `${rotate}deg` }],
    };
  });
  const toggleExpansion = () => {
    progress.value = withTiming(progress.value ? 0 : 1, { duration: 500 });
  };

  return (
    <View
      style={{
        justifyContent: "flex-end",
        alignItems: "center",
        height: SCREEN_HEIGHT * 0.95,
        overflow: "hidden",
      }}
    >
      <View style={styles.buttonContainer}>
        {icons.map((Icon, index) => (
          <RadialFabIcon key={index} {...{ index, Icon, progress }} />
        ))}
        <Pressable style={styles.fab} onPress={toggleExpansion}>
          <AnimatedPlusIcon
            style={plusIconAnimatedStyle}
            size={32}
            color="white"
          />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  fab: {
    bottom: 25,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#6200ee",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
});
