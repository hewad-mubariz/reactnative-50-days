import { Pressable, StyleSheet, TextInput } from "react-native";
import { Feather } from "@expo/vector-icons";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { FC } from "react";
type Props = {
  scrollY: Animated.SharedValue<number>;
  externalOpacity: Animated.SharedValue<number>;
  onSearchPress: () => void;
};
const AnimatedIcon = Animated.createAnimatedComponent(Feather);
const Input: FC<Props> = ({ scrollY, externalOpacity, onSearchPress }) => {
  const handleSearchPress = () => {
    onSearchPress();
  };
  const containerAnimatedStyle = useAnimatedStyle(() => {
    const opacity = externalOpacity.value
      ? externalOpacity.value
      : interpolate(scrollY.value, [0, 50], [1, 0]);
    return {
      opacity: opacity,
    };
  });
  const animatedIconStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      scrollY.value,
      [0, 50],
      [2, -10],
      Extrapolation.CLAMP
    );

    return {
      transform: [
        {
          translateX: externalOpacity.value
            ? withTiming(2)
            : withTiming(translateX, { duration: 100 }),
        },
      ],
      fontSize: 18,
    };
  });
  return (
    <>
      <Pressable
        onPress={handleSearchPress}
        style={{ zIndex: 2, position: "absolute", left: 10 }}
      >
        <AnimatedIcon style={animatedIconStyle} name="search" color={"white"} />
      </Pressable>
      <Animated.View style={[styles.container, containerAnimatedStyle]}>
        <TextInput
          placeholder="Search"
          style={{ color: "white", paddingHorizontal: 40, zIndex: 10 }}
          placeholderTextColor={"white"}
        />
      </Animated.View>
    </>
  );
};

export default Input;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#D07C75",
    borderRadius: 4,
    height: 35,
    flex: 0.95,
  },
});
