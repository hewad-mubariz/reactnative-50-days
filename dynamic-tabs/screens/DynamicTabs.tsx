import { Image, StyleSheet, Text, View } from "react-native";
import React, { useRef, useState } from "react";

import Animated, {
  runOnJS,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import Paginator from "../components/Paginator";
import { SCREEN_WIDTH, SCREEN_HEIGHT } from "../constants/screen";
const imagePath = "../assets/tabs";
const items = [
  { name: "Food", image: require(`${imagePath}/food.jpeg`) },
  { name: "Nature", image: require(`${imagePath}/nature.jpeg`) },
  { name: "Arts", image: require(`${imagePath}/art.jpeg`) },
  { name: "Photography", image: require(`${imagePath}/photography.jpeg`) },
];
const DynamicTabs = () => {
  const scrollX = useSharedValue(0);
  const scrollViewRef = useAnimatedRef<Animated.ScrollView>();
  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollX.value = event.contentOffset.x;
  });
  const handleTabPress = (index: number) => {
    scrollViewRef.current?.scrollTo({
      x: index * SCREEN_WIDTH,
      y: 0,
      animated: true,
    });
  };
  return (
    <View>
      <Paginator
        scrollX={scrollX}
        onTabPress={(index) => handleTabPress(index)}
        items={items}
      />
      <Animated.ScrollView
        ref={scrollViewRef}
        onScroll={scrollHandler}
        style={styles.container}
        scrollEventThrottle={16} // Add this line
        horizontal
        pagingEnabled
      >
        {items.map((item, index) => {
          return (
            <View
              key={index}
              style={{
                width: SCREEN_WIDTH,
                alignItems: "center",
                justifyContent: "center",
                height: SCREEN_HEIGHT,
                backgroundColor: "lightblue",
              }}
            >
              <Image style={styles.image} source={item.image} />
            </View>
          );
        })}
      </Animated.ScrollView>
    </View>
  );
};

export default DynamicTabs;

const styles = StyleSheet.create({
  container: {},
  image: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
});
