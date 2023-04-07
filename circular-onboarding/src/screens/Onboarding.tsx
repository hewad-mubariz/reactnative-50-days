import { SafeAreaView, StyleSheet, View } from "react-native";
import React, { useState } from "react";
import Animated, {
  runOnJS,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import CircularButton from "../components/onboarding/CircularButton";
import OnboardingItem from "../components/onboarding/OnboardingItem";
import { screens } from "../data/onboarding";
import { SCREEN_WIDTH } from "../constants/screen";
import Paginator from "../components/onboarding/Paginator";
const MAX_LENGHT = screens.length;
const Onboarding = () => {
  const aref = useAnimatedRef<Animated.ScrollView>();
  const [index, setIndex] = useState(0);
  const scrollX = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollX.value = event.contentOffset.x;
    runOnJS(setIndex)(Math.round(event.contentOffset.x / SCREEN_WIDTH));
  });
  const onPressButton = () => {
    if (index !== MAX_LENGHT - 1) {
      aref.current?.scrollTo({
        x: index > 0 ? SCREEN_WIDTH * (index + 1) : SCREEN_WIDTH,
        y: 0,
        animated: true,
      });
      setIndex(index + 1);
    }
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      <Animated.ScrollView
        onScroll={scrollHandler}
        ref={aref}
        horizontal
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        pagingEnabled
      >
        {screens.map((screen, index) => {
          return <OnboardingItem screen={screen} key={index.toString()} />;
        })}
      </Animated.ScrollView>
      <View>
        <Paginator itemsLength={screens.length} scrollX={scrollX} />
        <CircularButton
          screensLenght={screens.length}
          onPress={onPressButton}
          index={index}
        />
      </View>
    </SafeAreaView>
  );
};

export default Onboarding;

const styles = StyleSheet.create({});
