import React, { useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { SCREEN_WIDTH } from "../constants/screen";

import Icon from "./Icon";
import IconIndicator from "./IconIndicator";
const CIRCLE_SIZE = SCREEN_WIDTH * 0.9;
const BUTTON_SIZE = CIRCLE_SIZE / 3;
export type IconName =
  | "home"
  | "search"
  | "star"
  | "more-vertical"
  | "refresh-cw"
  | "arrow-left";

const icons: IconName[] = [
  "home",
  "search",
  "star",
  "more-vertical",
  "refresh-cw",
  "arrow-left",
];
const DialButton = () => {
  const scale = useSharedValue(0);
  const open = useSharedValue(0);
  const selectedIcon = useSharedValue(0);
  const circleAStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });
  const handlePress = () => {
    if (scale.value === 0) {
      scale.value = withTiming(1, { duration: 700 }, (finished) => {
        if (finished) {
          open.value = 1;
        }
      });
    } else {
      scale.value = withTiming(0, { duration: 700 }, (finished) => {
        if (finished) {
          open.value = 0;
        }
      });
    }
  };

  const handleIconPress = (index: number) => {
    selectedIcon.value = withTiming(index);
  };
  const buttonContainerAStyle = useAnimatedStyle(() => {
    return {
      width: interpolate(
        scale.value,
        [0, 1],
        [CIRCLE_SIZE / 2.6, CIRCLE_SIZE / 2.2]
      ),
      height: interpolate(
        scale.value,
        [0, 1],
        [CIRCLE_SIZE / 2.6, CIRCLE_SIZE / 2.2]
      ),
      borderRadius: CIRCLE_SIZE / 2.2,
    };
  });
  return (
    <View style={styles.parent}>
      <Animated.View style={[styles.buttonContainer, buttonContainerAStyle]}>
        <View style={styles.buttonBorder}>
          <Pressable style={styles.button} onPress={handlePress}>
            <IconIndicator selectedIcon={selectedIcon} />
          </Pressable>
        </View>
      </Animated.View>
      <Animated.View style={[styles.circle, circleAStyle]}>
        {icons.map((icon, i) => (
          <Icon
            selectedIcon={selectedIcon}
            onPress={handleIconPress}
            open={open}
            icon={icon}
            key={i}
            index={i}
          />
        ))}
      </Animated.View>
    </View>
  );
};

export default DialButton;

const styles = StyleSheet.create({
  parent: {
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    position: "absolute",
    backgroundColor: "#E8E8E8",
  },
  buttonContainer: {
    zIndex: 1,
    backgroundColor: "#e9f2f2",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
  },
  buttonBorder: {
    backgroundColor: "#DBDADB",
    alignItems: "center",
    justifyContent: "center",
    width: CIRCLE_SIZE / 2.6,
    height: CIRCLE_SIZE / 2.6,
    borderRadius: CIRCLE_SIZE / 2.6,
  },
  button: {
    backgroundColor: "#FBFFFF",
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    justifyContent: "flex-start",
    alignItems: "center",
    position: "relative",
  },
});
