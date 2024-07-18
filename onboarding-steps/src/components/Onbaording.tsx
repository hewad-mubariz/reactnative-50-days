import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Animated, {
  useAnimatedRef,
  ReduceMotion,
} from "react-native-reanimated";
import { cardDataArray } from "../data";

import { Card } from "./Card";
import { OnboardingControls } from "./OnboardingControls";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export const Onboarding = () => {
  const scrollViewRef = useAnimatedRef<Animated.ScrollView>();

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        horizontal
        scrollEnabled={false}
        pagingEnabled
        ref={scrollViewRef}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContainer}
        scrollEventThrottle={16}
        decelerationRate="normal"
      >
        {cardDataArray.map((_, index) => {
          return <Card key={index} />;
        })}
      </Animated.ScrollView>
      <OnboardingControls scrollViewRef={scrollViewRef} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  scrollViewContainer: {
    paddingVertical: 50,
    backgroundColor: "#ffffff",
  },
  buttonsContainer: {
    flexDirection: "row",
    marginTop: 25,
    width: "100%",
  },
  cardContainer: {
    width: SCREEN_WIDTH,
    justifyContent: "center",
    alignItems: "center",
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
  subButton: {
    position: "absolute",
    left: (SCREEN_WIDTH * 0.1) / 2,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f4f4f4",
    borderRadius: 30,
    height: 55,
  },
  title: {
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
