import {
  LayoutChangeEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { FC, useState } from "react";
import Animated, {
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { SCREEN_WIDTH } from "../constants/screen";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  items: any[];
  onTabPress: (index: number) => void;
  scrollX: Animated.SharedValue<number>;
};

const Paginator: FC<Props> = ({ items, scrollX, onTabPress }) => {
  const inputRange = items.map((_, i) => i * SCREEN_WIDTH);
  const insets = useSafeAreaInsets();
  const [xPositions, setXPositions] = useState(Array(items.length).fill(0));
  const [widths, setWidths] = useState(Array(items.length).fill(0));

  const handleItemLayout = (index: number, event: LayoutChangeEvent) => {
    const { x, width } = event.nativeEvent.layout;

    setXPositions((prevXPositions) => {
      const newXPositions = [...prevXPositions];
      newXPositions[index] = x;
      return newXPositions;
    });

    setWidths((prevWidths) => {
      const newWidths = [...prevWidths];
      newWidths[index] = width;
      return newWidths;
    });
  };
  const aStyle = useAnimatedStyle(() => {
    const translateBorderX = interpolate(scrollX.value, inputRange, xPositions);
    const width = interpolate(scrollX.value, inputRange, widths);
    return {
      height: 4,
      backgroundColor: "gray",
      transform: [{ translateX: translateBorderX }, { translateY: -2 }],
      width: width,
    };
  });
  return (
    <View style={styles.tabsContainer}>
      <View style={[styles.container, { paddingTop: insets.top }]}>
        {items.map((item, i) => {
          return (
            <Pressable
              onPress={() => onTabPress(i)}
              onLayout={(event) => handleItemLayout(i, event)}
              key={i}
              style={{
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={styles.title}>{item.name}</Text>
            </Pressable>
          );
        })}
      </View>
      <Animated.View style={aStyle} />
    </View>
  );
};

export default Paginator;

const styles = StyleSheet.create({
  tabsContainer: {
    position: "absolute",
    zIndex: 2,
    width: SCREEN_WIDTH,
    paddingHorizontal: 15,
    backgroundColor: "rgba(255,255,255,0.8)",
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: 100,
  },
  title: {
    fontSize: 18,
  },
});
