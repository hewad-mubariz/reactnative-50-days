import { View, StyleSheet, Text, Pressable } from "react-native";
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
const Tabs = ["Top Earners", "Most Valuables"];

export const TabBar: FC<Props> = ({ onPress, activeIndex }) => {
  const indicatorXPosition = useSharedValue(0);
  const indicatorWidth = useSharedValue(0);

  const handlePress = (
    measurement: MeasuredDimensions | null,
    index: number
  ) => {
    onPress(index);
  };

  return (
    <View style={styles.parentContainer}>
      <View style={styles.container}>
        {Tabs.map((tab, index) => {
          return (
            <Pressable key={index} onPress={() => onPress(index)}>
              <Text
                style={[
                  styles.tabTitle,
                  {
                    color:
                      index === activeIndex
                        ? "rgba(107, 111, 226, 1)"
                        : "97a5b7",
                  },
                ]}
              >
                {tab}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  parentContainer: {
    width: "100%",
    alignItems: "center",
  },
  tabTitle: {
    color: "#97a5b7",
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    //justifyContent: "space-between",
    gap: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 20,
    width: TAB_BAR_WIDTH,
    // backgroundColor: "#e6e8eb",
  },
  tabIndicator: {
    position: "absolute",
    backgroundColor: "white",
    height: 30,
    borderRadius: 20,
    zIndex: -1,
  },
});
