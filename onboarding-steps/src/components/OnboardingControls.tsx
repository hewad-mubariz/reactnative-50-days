import React, { useState } from "react";
import { StyleSheet, Dimensions, Pressable, Text } from "react-native";
import Animated, {
  useSharedValue,
  withSpring,
  useAnimatedStyle,
  interpolate,
  FadeInLeft,
  FadeOutLeft,
} from "react-native-reanimated";
import { Check } from "lucide-react-native";
import { Paginator } from "./Paginator";
import { cardDataArray } from "../data";
import { SPRING_CONFIG } from "../constants/spring";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const { width: SCREEN_WIDTH } = Dimensions.get("window");

const MAIN_BUTTON_WIDTH_COLLAPSED = SCREEN_WIDTH * 0.9;
const MAIN_BUTTON_WIDTH_EXPANDED = SCREEN_WIDTH * 0.67;
const SUB_BUTTON_WIDTH = SCREEN_WIDTH * 0.2;

interface OnboardingControlsProps {
  scrollViewRef: React.RefObject<Animated.ScrollView>;
}

export const OnboardingControls: React.FC<OnboardingControlsProps> = ({
  scrollViewRef,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const animatedIndex = useSharedValue(0);
  const steppedAhead = useSharedValue(0);

  const mainButtonAStyle = useAnimatedStyle(() => {
    const width = interpolate(
      steppedAhead.value,
      [0, 1],
      [MAIN_BUTTON_WIDTH_COLLAPSED, MAIN_BUTTON_WIDTH_EXPANDED]
    );

    return {
      width,
      position: "absolute",
      right: (SCREEN_WIDTH * 0.1) / 2,
      zIndex: -1,
    };
  });

  const subButtonAStyle = useAnimatedStyle(() => {
    const width = interpolate(
      steppedAhead.value,
      [0, 1],
      [0, SUB_BUTTON_WIDTH]
    );
    const translateX = interpolate(
      steppedAhead.value,
      [0, 1],
      [-SUB_BUTTON_WIDTH, 0]
    );

    return {
      width,
      transform: [{ translateX }],
    };
  });

  const handleScroll = (index: number) => {
    scrollViewRef.current?.scrollTo({
      x: index * SCREEN_WIDTH,
      y: 0,
      animated: true,
    });
  };

  const handlePress = () => {
    if (activeIndex < cardDataArray.length - 1) {
      const newIndex = activeIndex + 1;
      steppedAhead.value = withSpring(1, SPRING_CONFIG);
      animatedIndex.value = withSpring(newIndex, SPRING_CONFIG);
      handleScroll(newIndex);
      setActiveIndex(newIndex);
    } else {
      console.log("Finished");
    }
  };

  const handleBackPress = () => {
    if (activeIndex > 0) {
      const newIndex = activeIndex - 1;
      steppedAhead.value = withSpring(newIndex === 0 ? 0 : 1, SPRING_CONFIG);
      animatedIndex.value = withSpring(newIndex, SPRING_CONFIG);
      handleScroll(newIndex);
      setActiveIndex(newIndex);
    }
  };

  return (
    <>
      <Paginator
        animatedIndex={animatedIndex}
        itemsLength={cardDataArray.length}
        activeIndex={0}
      />
      <Animated.View style={styles.controlContainer}>
        <AnimatedPressable
          onPress={handleBackPress}
          style={[styles.backButton, subButtonAStyle]}
        >
          <Text style={styles.backButtonText}>Back</Text>
        </AnimatedPressable>
        <AnimatedPressable
          onPress={handlePress}
          style={[styles.mainButton, mainButtonAStyle]}
        >
          {activeIndex >= cardDataArray.length - 1 && (
            <Animated.View
              entering={FadeInLeft}
              exiting={FadeOutLeft.duration(100)}
              style={styles.checkContainer}
            >
              <Check color={"#006cff"} strokeWidth={4} size={15} />
            </Animated.View>
          )}
          <Animated.Text style={styles.buttonText}>
            {activeIndex >= cardDataArray.length - 1 ? "Finish" : "Continue"}
          </Animated.Text>
        </AnimatedPressable>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  controlContainer: {
    flexDirection: "row",
    marginTop: 25,
    width: "100%",
  },
  mainButton: {
    flexDirection: "row",
    backgroundColor: "#006cff",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    height: 55,
    gap: 8,
  },
  backButton: {
    position: "absolute",
    left: (SCREEN_WIDTH * 0.1) / 2,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f4f4f4",
    borderRadius: 30,
    height: 55,
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 18,
  },
  backButtonText: {
    color: "black",
    fontSize: 16,
    fontWeight: "600",
  },
  checkContainer: {
    width: 20,
    height: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});
