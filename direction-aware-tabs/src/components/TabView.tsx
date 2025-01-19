import { StyleSheet, View } from "react-native";
import React, { useRef, useState } from "react";
import Animated, { useSharedValue } from "react-native-reanimated";
import { BlurView } from "expo-blur";
import PagerView from "react-native-pager-view";
import { TabBar } from "./TabBar";

import { TopEarners } from "./lists/TopEarners";
import MostValuables from "./lists/MostValuables";
export const SPRING_CONFIG = {
  damping: 20,
  mass: 1,
  overshootClamping: false,
  restDisplacementThreshold: 0.1,
  restSpeedThreshold: 0.01,
  stiffness: 150,
};
const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

const renderScene = (index: number) => {
  switch (index) {
    case 0:
      return <TopEarners />;
    case 1:
      return <MostValuables />;
  }
};

export const TabView = () => {
  const [page, setPage] = useState<any>(0);
  const [renderBlur, setRenderBlur] = useState(false);

  const ref = useRef<PagerView>(null);
  const translateX = useSharedValue(0);

  const handleTabPress = (index: number) => {
    setPage(index);
    ref.current?.setPage(index);
  };

  return (
    <View style={{ flex: 1 }}>
      <TabBar onPress={(index) => handleTabPress(index)} activeIndex={page} />
      <Animated.View style={[styles.springContainer]}>
        <PagerView
          ref={ref}
          scrollEnabled={false}
          testID={"pager-view"}
          style={styles.pagerView}
          initialPage={0}
        >
          {Array.from({ length: 4 }).map((_, index) => (
            <View key={index.toString()} style={styles.pageContainer}>
              {renderScene(index)}
            </View>
          ))}
        </PagerView>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  pagerView: {
    flex: 1,
  },
  springContainer: {
    flex: 1,
    justifyContent: "center",
  },

  blurView: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  text: {
    fontSize: 24,
    fontWeight: "600",
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  sectionHeader: {
    paddingHorizontal: 20,
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  pageContainer: {
    flex: 1,
  },
});

export default TabView;
