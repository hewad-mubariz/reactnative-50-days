import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import ListItem, { ITEM_HEIGHT } from "../components/ListItem";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "../constants/screen";
import { listData } from "../constants/data";
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const List = () => {
  const inset = useSafeAreaInsets();
  const expand = useSharedValue(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [scrollContainerHeight, setScrollContainerHeight] =
    useState(SCREEN_HEIGHT);
  const toggleList = () => {
    if (expand.value === 0) {
      expand.value = 1;
      setScrollContainerHeight(ITEM_HEIGHT * listData.length * 1.5);
      setIsExpanded(true);
    } else {
      expand.value = 0;
      setScrollContainerHeight(SCREEN_HEIGHT);
      setIsExpanded(false);
    }
  };

  const iconStyle = useAnimatedStyle(() => {
    const rotation = interpolate(expand.value, [0, 1], [0, 90]);
    return {
      transform: [{ rotate: withSpring(`${rotation}deg`) }],
    };
  });
  const expandButtonAnimatedStyle = useAnimatedStyle(() => {
    return {
      width: withSpring(
        expand.value === 1 ? SCREEN_WIDTH * 0.34 : SCREEN_WIDTH * 0.3
      ),
    };
  });
  return (
    <View style={[styles.container]}>
      <Animated.ScrollView
        contentContainerStyle={[
          {
            paddingTop: inset.top,
            paddingHorizontal: 15,
            height: scrollContainerHeight,
          },
        ]}
      >
        <View style={styles.list}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Transactions</Text>
            <AnimatedPressable
              style={[styles.collapseButton, expandButtonAnimatedStyle]}
              onPress={toggleList}
            >
              <Text style={[styles.collapseText]}>
                {isExpanded ? "Collapse" : "Expand"}
              </Text>
              <Animated.View style={iconStyle}>
                <Feather name="chevron-right" size={24} color="black" />
              </Animated.View>
            </AnimatedPressable>
          </View>
          {listData.map((item, index) => {
            return (
              <ListItem expand={expand} index={index} item={item} key={index} />
            );
          })}
        </View>
      </Animated.ScrollView>
    </View>
  );
};

export default List;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eee6f0",
    justifyContent: "center",
  },
  percentages: {},
  list: {},
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  collapseButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 20,
    paddingHorizontal: 8,
    width: SCREEN_WIDTH * 0.3,
    height: 45,
    justifyContent: "center",
  },
  collapseText: {
    marginRight: 8,
    fontSize: 16,
    fontWeight: "bold",
  },
});
