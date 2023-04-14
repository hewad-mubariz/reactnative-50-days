import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { FC } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, {
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const ICON_SIZE = 60;
type Props = {
  action: any;
  translateX: Animated.SharedValue<number>;
  direction: string;
  onButtonPress: (action: string) => void;
};
const AnimatedButton: FC<Props> = ({
  action,
  translateX,
  direction,
  onButtonPress,
}) => {
  const iconStyle = useAnimatedStyle(() => {
    const translate = interpolate(
      translateX.value,
      [0, direction === "right" ? -120 : 120],
      [0, direction === "right" ? -60 : 60]
    );
    return {
      transform: [{ translateX: translate * action.position }],
    };
  });
  return (
    <AnimatedPressable
      onPress={() => onButtonPress(action.title)}
      style={[iconStyle, styles.buttonStyle, { backgroundColor: action.color }]}
    >
      <MaterialCommunityIcons name={action.icon} size={30} color={"white"} />
      <Text style={styles.iconButtonTitle}>{action.title}</Text>
    </AnimatedPressable>
  );
};

export default AnimatedButton;

const styles = StyleSheet.create({
  iconButtonTitle: {
    color: "white",
  },
  buttonStyle: {
    height: ICON_SIZE,
    position: "absolute",
    backgroundColor: "#128c7e",
    width: ICON_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
});
