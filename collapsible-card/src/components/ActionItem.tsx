import { LinearGradient } from "expo-linear-gradient";
import { LucideIcon } from "lucide-react-native";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export type Action = {
  Icon: LucideIcon;
  title: string;
  subtitle: string;
  time: string;
};
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const ActionItem = (action: Action) => {
  const { Icon, title, subtitle, time } = action;
  const scale = useSharedValue(1);
  const handleScale = () => {
    scale.value = withTiming(scale.value === 1 ? 0.96 : 1);
  };
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });
  return (
    <AnimatedPressable
      onPressIn={handleScale}
      onPressOut={handleScale}
      style={[styles.actionContainer, animatedStyle]}
    >
      <LinearGradient
        colors={["#f5f5f5", "#e9eaf1"]}
        style={styles.iconContainer}
      >
        <Icon fill={"white"} strokeWidth={1.2} color={"#d2d1db"} size={26} />
      </LinearGradient>
      <View style={styles.textContainer}>
        <Text style={styles.actionTitle}>{title}</Text>
        <Text style={styles.actionSubtitle} numberOfLines={1}>
          {subtitle}
        </Text>
      </View>
      <Text style={styles.actionTime}>{time}</Text>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  actionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0.5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 1.4,
    elevation: 5,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#eeeff6",
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
    gap: 2,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  actionSubtitle: {
    color: "#9f9fa1",
  },
  actionTime: {
    color: "#9f9fa1",
  },
});
