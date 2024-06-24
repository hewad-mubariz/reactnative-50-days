import {
  LayoutChangeEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { FC, useRef } from "react";
import { Plus } from "lucide-react-native";
import Animated, {
  interpolate,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
type Props = {
  title: string;
  description: string;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedPlusIcon = Animated.createAnimatedComponent(Plus);
const COLLAPSED_HEIGHT = 50;

const baseSpringConfig = {
  mass: 1,
  overshootClamping: false,
  restDisplacementThreshold: 0.01,
  restSpeedThreshold: 2,
  reduceMotion: ReduceMotion.System,
};

const getSpringConfig = (isExpanding: boolean) => ({
  ...baseSpringConfig,
  damping: isExpanding ? 10 : 15, // Less bounce when collapsing
  stiffness: isExpanding ? 100 : 120, // Faster when collapsing
});

export const Accordion: FC<Props> = ({ title, description }) => {
  const fullHeight = useRef(0);
  const progress = useSharedValue(0);
  const height = useSharedValue<number | undefined>(undefined);
  const handleAccordionPress = () => {
    const isExpanding = progress.value === 0;
    progress.value = withSpring(
      isExpanding ? 1 : 0,
      getSpringConfig(isExpanding)
    );
    height.value = withSpring(
      isExpanding ? fullHeight.current : COLLAPSED_HEIGHT,
      getSpringConfig(isExpanding)
    );
  };

  const accordionAnimatedStyle = useAnimatedStyle(() => {
    return { height: height.value };
  });

  const plusIconAStyle = useAnimatedStyle(() => {
    const degree = interpolate(progress.value, [0, 1], [0, 45]);
    return {
      transform: [{ rotateZ: `${degree}deg` }],
    };
  });

  const handleOnLayout = (event: LayoutChangeEvent) => {
    if (!fullHeight.current) {
      fullHeight.current = Math.ceil(event.nativeEvent.layout.height);
      height.value = COLLAPSED_HEIGHT;
    }
  };

  return (
    <AnimatedPressable
      onLayout={handleOnLayout}
      style={[styles.container, accordionAnimatedStyle]}
      onPress={handleAccordionPress}
    >
      <Animated.View style={{ gap: 16 }}>
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <AnimatedPlusIcon style={plusIconAStyle} color={"white"} size={20} />
        </View>
        <Text style={styles.description}>{description}</Text>
      </Animated.View>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1a1a1a",
    width: "100%",
    borderRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#313434",
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  description: {
    color: "#4e5252",
  },
});
