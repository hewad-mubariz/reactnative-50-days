import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import Animated, {
  useAnimatedRef,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import Button from "../components/shared/Button";
import { bouncyData } from "../data/onboarding";
import { SCREEN_WIDTH } from "../constants/screen";
import Paginator from "../components/onboarding/Paginator";
import { ReText } from "react-native-redash";
import BouncyOnbarodingItem from "../components/onboarding/BouncyOnbarodingItem";
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const Onboarding = () => {
  const scrollX = useSharedValue(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollViewRef = useAnimatedRef<ScrollView>();

  //Handle Scroll Either to left or Right
  const handleScroll = (direction: "left" | "right") => {
    const newIndex = activeIndex + (direction === "right" ? 1 : -1);
    if (newIndex >= 0 && newIndex < bouncyData.length) {
      setActiveIndex(newIndex);
      const newScrollX = SCREEN_WIDTH * newIndex;
      scrollX.value = newScrollX;
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({
          x: newScrollX,
          y: 0,
          animated: true,
        });
      }, 400);
    }
  };

  //Set button width and Label s
  const setButtonWidthAndLabel = () => {
    if (activeIndex === bouncyData.length - 1) {
      buttonWidth.value = withDelay(150, withTiming((SCREEN_WIDTH / 3) * 2));
      buttonLabelOpacity.value = withSequence(
        withDelay(
          100,
          withTiming(0, {}, (finished) => {
            if (finished) {
              buttonLabel.value = "Login";
            }
          })
        ),
        withDelay(100, withTiming(1))
      );
    } else {
      buttonWidth.value = withDelay(150, withTiming(100));
      buttonLabel.value = "Next";
    }
  };

  const handleNextPress = () => {
    handleScroll("right");
  };

  const handleBackPress = () => {
    handleScroll("left");
  };

  //If user pressed skip jump to Last Screen
  const handleSkipPress = () => {
    setActiveIndex(bouncyData.length - 1);
    const newScrollX = SCREEN_WIDTH * (bouncyData.length - 1);
    scrollX.value = newScrollX;
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({
        x: newScrollX,
        y: 0,
        animated: false,
      });
    }, 400);
  };
  const buttonWidth = useSharedValue(100);
  const animatedButtonLabelStyle = useAnimatedStyle(() => {
    return {
      width: buttonWidth.value,
    };
  });
  const buttonLabel = useSharedValue("Next");
  const buttonLabelOpacity = useSharedValue(1);

  useEffect(() => {
    setButtonWidthAndLabel();
  }, [activeIndex]);

  const buttonLabelAStyle = useAnimatedStyle(() => {
    return {
      opacity: buttonLabelOpacity.value,
      color: "white",
    };
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F7ECE4" }}>
      <View style={styles.header}>
        <Button
          onPress={handleBackPress}
          title="Back"
          variant="text"
          titleStyle={{ color: "black" }}
        />
        <Button
          title="Skip"
          onPress={handleSkipPress}
          variant="text"
          titleStyle={{ color: "black" }}
        />
      </View>
      <ScrollView
        scrollEnabled={false}
        contentContainerStyle={{ alignItems: "center" }}
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        ref={scrollViewRef}
        scrollEventThrottle={16}
        horizontal
        style={styles.container}
      >
        {bouncyData.map((item, index) => {
          return (
            <BouncyOnbarodingItem
              key={index}
              scrollX={scrollX}
              index={index}
              item={item}
            />
          );
        })}
      </ScrollView>
      <View style={styles.footer}>
        <Paginator itemsLength={bouncyData.length} activeIndex={activeIndex} />
        <AnimatedPressable
          onPress={handleNextPress}
          style={[animatedButtonLabelStyle, styles.buttonStyle]}
        >
          <ReText
            onPressIn={handleNextPress}
            text={buttonLabel}
            style={buttonLabelAStyle}
          />
        </AnimatedPressable>
      </View>
    </SafeAreaView>
  );
};

export default Onboarding;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginTop: 10,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
  },
  footer: {
    justifyContent: "center",
    rowGap: 20,
    flex: 0.4,
    paddingBottom: 20,
    alignItems: "center",
  },
  buttonStyle: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#39554B",
    height: 40,
    borderRadius: 50,
  },
});
