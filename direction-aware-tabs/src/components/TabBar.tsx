import { View, StyleSheet } from "react-native";
import React, { FC } from "react";
import Animated, {
  MeasuredDimensions,
  withTiming,
  useSharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { TabBarButton } from "./TabBarButton";
import { SCREEN_WIDTH } from "../constants/window";

type Props = {
  onPress: (index: number) => void;
  activeIndex: number;
};

const INDICATOR_PADDING = 16;
const TAB_BAR_WIDTH = SCREEN_WIDTH * 0.95;
const SIDE_PADDING = (SCREEN_WIDTH - TAB_BAR_WIDTH) / 2;
const Tabs = ["Messages", "Groups", "Invites", "Notifications"];

export const TabBar: FC<Props> = ({ onPress, activeIndex }) => {
  const indicatorXPosition = useSharedValue(0);
  const indicatorWidth = useSharedValue(0);

  const handlePress = (
    measurement: MeasuredDimensions | null,
    index: number
  ) => {
    onPress(index);
    if (measurement) {
      const adjustedXPosition =
        measurement.pageX - INDICATOR_PADDING / 2 - SIDE_PADDING;
      indicatorXPosition.value = withTiming(adjustedXPosition, {
        duration: 300,
      });
      indicatorWidth.value = withTiming(measurement.width + INDICATOR_PADDING, {
        duration: 300,
      });
    }
  };

  const handleLayout = (event: any, index: number) => {
    if (index === 0) {
      const layout = event.nativeEvent.layout;
      const adjustedXPosition = layout.x - INDICATOR_PADDING / 2;
      indicatorXPosition.value = adjustedXPosition;
      indicatorWidth.value = layout.width + INDICATOR_PADDING;
    }
  };

  const indicatorAnimatedStyle = useAnimatedStyle(() => {
    return {
      width: indicatorWidth.value,
      transform: [{ translateX: indicatorXPosition.value }],
    };
  });

  return (
    <View style={styles.parentContainer}>
      <View style={styles.container}>
        {Tabs.map((tab, index) => (
          <TabBarButton
            isActive={activeIndex === index}
            key={index}
            title={tab}
            onPress={(measurement) => handlePress(measurement, index)}
            onLayout={(event) => handleLayout(event, index)}
          />
        ))}
        <Animated.View style={[styles.tabIndicator, indicatorAnimatedStyle]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  parentContainer: {
    width: "100%",
    alignItems: "center",
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 20,
    width: TAB_BAR_WIDTH,
    backgroundColor: "#e6e8eb",
  },
  tabIndicator: {
    position: "absolute",
    backgroundColor: "white",
    height: 30,
    borderRadius: 20,
    zIndex: -1,
  },
});
