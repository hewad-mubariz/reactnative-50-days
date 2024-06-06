import { Pressable, StyleSheet, View } from "react-native";
import React, { FC } from "react";
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { TAction } from "./Card";

type Props = {
  translateX: SharedValue<number>;
  action: TAction;
  index: number;
  isActive: boolean;
  onPress: () => void;
  onExpand: () => void;
};
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const ACTIONS_LENGHT = 3;
const BASE_OFFSET = 60;
const STEP = BASE_OFFSET / (ACTIONS_LENGHT - 1);

export const Action: FC<Props> = ({
  translateX,
  action,
  index,
  isActive,
  onPress,
  onExpand,
}) => {
  const { Icon, color, ActiveIcon } = action;
  const ActionIcon = isActive ? ActiveIcon : Icon;

  const dotStyle = useAnimatedStyle(() => {
    const tX = interpolate(
      translateX.value,
      [0, -90],
      [0, -BASE_OFFSET + STEP * index]
    );
    const opacity = interpolate(translateX.value, [-90, -70], [0, 1]);

    return {
      opacity,
      transform: [{ translateX: tX }],
    };
  });

  const iconStyle = useAnimatedStyle(() => {
    const tX = interpolate(
      translateX.value,
      [0, -90],
      [0, -BASE_OFFSET + STEP * index]
    );
    const size = interpolate(translateX.value, [0, -90], [0, 30], "clamp");
    const opacity = interpolate(translateX.value, [-90, -70], [1, 0]);

    return {
      width: size,
      height: size,
      opacity,
      transform: [{ translateX: tX }],
    };
  });

  return (
    <Pressable style={styles.actionContainer}>
      <AnimatedPressable
        hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
        onPress={onExpand}
        style={[styles.dot, dotStyle]}
      />
      <AnimatedPressable
        style={[styles.iconContainer, iconStyle]}
        onPress={onPress}
      >
        <ActionIcon color={color} fill={color} />
      </AnimatedPressable>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  actionContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "gray",
  },
  iconContainer: {
    overflow: "hidden",
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
});
