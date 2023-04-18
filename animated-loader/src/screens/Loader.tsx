import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import LoaderItem from "../components/LoaderItem";

const CIRCLE_SIZE = 300;

const Loader = () => {
  const rotation = useSharedValue(0);
  const loaderAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });
  useEffect(() => {
    //rotation.value = withRepeat(withTiming(120, { duration: 700 }), -1, true);
  }, []);
  return (
    <Animated.View style={[styles.container, loaderAnimatedStyle]}>
      {[...Array(9)].map((_, i) => (
        <LoaderItem key={i} index={i} />
      ))}
    </Animated.View>
  );
};

export default Loader;

const styles = StyleSheet.create({
  container: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    position: "relative",
  },
});
