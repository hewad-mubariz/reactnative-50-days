import React, { useState } from "react";
import { StyleSheet, Pressable } from "react-native";
import Animated, {
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import { SCREEN_WIDTH } from "../constants/screen";
import { IconName } from "./DialButton";
const VIEW_SIZE = 80;
const CIRCLE_SIZE = SCREEN_WIDTH * 0.9;
const CIRCLE_RADIUS = CIRCLE_SIZE / 2;
const ANGLE_PER_VIEW = (2 * Math.PI) / 6;
const START_ANGLE = (-1 * Math.PI) / 2;
const AnimatedPressabe = Animated.createAnimatedComponent(Pressable);

type Props = {
  index: number;
  icon: IconName;
  open: Animated.SharedValue<number>;
  onPress: (index: number) => void;
  selectedIcon: Animated.SharedValue<number>;
};

const Icon: React.FC<Props> = ({
  index,
  icon,
  open,
  onPress,
  selectedIcon,
}) => {
  const angle = START_ANGLE + ANGLE_PER_VIEW * index;
  const angleFirstIcon = START_ANGLE;

  const progress = useSharedValue(0);
  const opacity = useSharedValue(0);
  const [iconColor, setIconColor] = useState("#AAAAAA");
  useAnimatedReaction(
    () => open.value,
    (value) => {
      if (value === 1) {
        opacity.value = withTiming(1, { duration: 300 });
        progress.value = withTiming(1, { duration: 300 });
      } else {
        progress.value = 0;
        opacity.value = 0;
      }
    }
  );
  const animatedStyle = useAnimatedStyle(() => {
    const currentAngle =
      angleFirstIcon + progress.value * (angle - angleFirstIcon);
    const x =
      CIRCLE_RADIUS +
      (CIRCLE_RADIUS - VIEW_SIZE / 2) * Math.cos(currentAngle) -
      VIEW_SIZE / 2;
    const y =
      CIRCLE_RADIUS +
      (CIRCLE_RADIUS - VIEW_SIZE / 2) * Math.sin(currentAngle) -
      VIEW_SIZE / 2;

    return {
      transform: [{ translateX: x }, { translateY: y }],
      opacity: progress.value,
    };
  });
  useAnimatedReaction(
    () => selectedIcon.value,
    (value) => {
      if (value === index) {
        runOnJS(setIconColor)("#393839");
      } else {
        runOnJS(setIconColor)("#AAAAAA");
      }
    }
  );
  return (
    <AnimatedPressabe
      onPress={() => onPress(index)}
      style={[styles.view, animatedStyle]}
    >
      <Feather name={icon} size={30} color={iconColor} />
    </AnimatedPressabe>
  );
};
const styles = StyleSheet.create({
  view: {
    width: VIEW_SIZE,
    height: VIEW_SIZE,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
  },
});
export default Icon;
