import React, { FC, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
} from "react-native-reanimated";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "../../constants/screen";

type Props = {
  item: TOnboardingItem;
  index: number;
  scrollX: Animated.SharedValue<number>;
};

const BouncyOnbarodingItem: FC<Props> = ({ item, index, scrollX }) => {
  const inputRange = useMemo(() => {
    const start = (index - 1) * SCREEN_WIDTH;
    const end = (index + 1) * SCREEN_WIDTH;
    return [start, index * SCREEN_WIDTH, end];
  }, [index]);

  const titleAStyle = useAnimatedStyle(() => {
    const titleTranslateX = interpolate(scrollX.value, inputRange, [
      SCREEN_WIDTH,
      0,
      -SCREEN_WIDTH,
    ]);

    return {
      transform: [{ translateX: withDelay(0, withSpring(titleTranslateX)) }],
    };
  });
  const descriptionAStyle = useAnimatedStyle(() => {
    const descriptionTrnalsateX = interpolate(scrollX.value, inputRange, [
      SCREEN_WIDTH,
      0,
      -SCREEN_WIDTH,
    ]);

    return {
      transform: [
        { translateX: withDelay(100, withSpring(descriptionTrnalsateX)) },
      ],
    };
  });
  const imageAStyle = useAnimatedStyle(() => {
    const imageTranslateX = interpolate(scrollX.value, inputRange, [
      SCREEN_WIDTH,
      0,
      -SCREEN_WIDTH,
    ]);

    return {
      transform: [{ translateX: withDelay(300, withTiming(imageTranslateX)) }],
    };
  });
  return (
    <View style={[styles.container]}>
      <Animated.Text style={[styles.title, titleAStyle]}>
        {item.title}
      </Animated.Text>
      <Animated.Text style={[styles.description, descriptionAStyle]}>
        {item.description}
      </Animated.Text>
      <Animated.Image style={[styles.image, imageAStyle]} source={item.image} />
    </View>
  );
};

export default BouncyOnbarodingItem;

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    width: "80%",
    textAlign: "center",
    marginBottom: 10,
  },
  image: {
    width: "80%",
    height: SCREEN_HEIGHT / 4,
    resizeMode: "contain",
  },
});
