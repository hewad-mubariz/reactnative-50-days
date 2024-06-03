import React, { useImperativeHandle, forwardRef, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { SCREEN_WIDTH } from "../constants/window";
import { ActionItem } from "./ActionItem";
import { Home, Plus } from "lucide-react-native";

export const SPRING_CONFIG = {
  damping: 27,
  mass: 1,
  stiffness: 300,
  overshootClamping: false,
  restSpeedThreshold: 0.001,
  restDisplacementThreshold: 0.001,
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedPlusIcon = Animated.createAnimatedComponent(Plus);

export interface FABHandle {
  closeFAB: () => void;
}

import { MessageCircle, Camera, Settings } from "lucide-react-native";

const actionItems = [
  {
    icon: MessageCircle,
    color: "orange",
    title: "Message",
    description: "Send and receive messages from your contacts.",
  },
  {
    icon: Camera,
    color: "pink",
    title: "Capture",
    description: "Capture photos and videos of your moments.",
  },
  {
    icon: Home,
    color: "teal",
    title: "Settings",
    description: "Adjust your preferences and settings.",
  },
];

export const FAB = forwardRef<FABHandle>((props, ref) => {
  const width = useSharedValue(65);
  const height = useSharedValue(65);

  //No need to use shared values for these
  const [iconSize, setIconSize] = useState(45);
  const [iconOpacity, setIconOpacity] = useState(1);
  const [isExpanded, setIsExpanded] = useState(false);

  const aStyle = useAnimatedStyle(() => {
    const borderRadius = interpolate(
      width.value,
      [65, SCREEN_WIDTH * 0.8],
      [35.2, 20]
    );
    return {
      width: width.value,
      height: height.value,
      borderRadius,
    };
  });

  const handlePress = () => {
    setIsExpanded(true);
    setIconSize(0);
    setIconOpacity(0);
    width.value = withTiming(SCREEN_WIDTH * 0.85, { duration: 250 });
    height.value = withTiming(360, { duration: 250 });
  };

  useImperativeHandle(ref, () => ({
    closeFAB() {
      setIsExpanded(false);
      setIconSize(45);
      width.value = withSpring(65, SPRING_CONFIG);
      height.value = withSpring(65, SPRING_CONFIG);
      setTimeout(() => {
        setIconOpacity(1);
      }, 150);
    },
  }));

  return (
    <AnimatedPressable style={[styles.fab, aStyle]} onPress={handlePress}>
      <AnimatedPlusIcon
        color="white"
        size={iconSize}
        style={{ opacity: iconOpacity }}
      />
      {isExpanded && (
        <View style={styles.expandedContainer}>
          {actionItems.map((item, index) => {
            const { icon, color, title, description } = item;
            return (
              <ActionItem
                key={index}
                icon={icon}
                color={color}
                title={title}
                description={description}
              />
            );
          })}
        </View>
      )}
    </AnimatedPressable>
  );
});

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    right: 30,
    bottom: 60,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  expandedContainer: {
    justifyContent: "space-evenly",
    height: 350,
  },
});
