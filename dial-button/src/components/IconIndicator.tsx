import { StyleSheet } from "react-native";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { SCREEN_WIDTH } from "../constants/screen";

const VIEW_SIZE = 6;
const CIRCLE_SIZE = (SCREEN_WIDTH * 0.9) / 3;
const CIRCLE_RADIUS = CIRCLE_SIZE / 2;
const ANGLE_PER_VIEW = (2 * Math.PI) / 6;
const START_ANGLE = (-1 * Math.PI) / 2;
const PADDING = 10;

interface Props {
  selectedIcon: Animated.SharedValue<number>;
}

const IconIndicator: React.FC<Props> = ({ selectedIcon }) => {
  const borderWidth = VIEW_SIZE;
  const borderHeight = VIEW_SIZE * 2.5;
  const animatedStyle = useAnimatedStyle(() => {
    const angle = START_ANGLE + ANGLE_PER_VIEW * selectedIcon.value;
    const x =
      CIRCLE_RADIUS +
      (CIRCLE_RADIUS - borderHeight / 2 - PADDING) * Math.cos(angle) -
      borderWidth / 2;
    const y =
      CIRCLE_RADIUS +
      (CIRCLE_RADIUS - borderHeight / 2 - PADDING) * Math.sin(angle) -
      borderHeight / 2;
    const rotation = angle + Math.PI / 2;

    return {
      top: y,
      left: x,
      transform: [{ rotate: rotation + "rad" }],
    };
  });

  return <Animated.View style={[styles.view, animatedStyle]} />;
};

const styles = StyleSheet.create({
  view: {
    width: VIEW_SIZE,
    height: VIEW_SIZE * 2.5,
    backgroundColor: "#8349EC",
    position: "absolute",
    borderRadius: 8,
  },
});

export default IconIndicator;
