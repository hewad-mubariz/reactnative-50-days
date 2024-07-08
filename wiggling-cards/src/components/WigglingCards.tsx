import React, { useState } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Animated, {
  useAnimatedRef,
  useScrollViewOffset,
  runOnJS,
  useAnimatedReaction,
} from "react-native-reanimated";
import {
  ShoppingCart,
  Users,
  BarChart3,
  CreditCard,
} from "lucide-react-native";
import { Card } from "./Card";
import { Paginator } from "./Paginator";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const cardDataArray = [
  {
    id: 1,
    percentage: 3.82,
    amount: "$46748",
    description: "Weekly Sales",
    Icon: BarChart3,
  },
  {
    id: 2,
    percentage: -5.03,
    amount: "$2374",
    description: "Weekly Expenses",
    Icon: CreditCard,
  },
  {
    id: 3,
    percentage: 1.2,
    amount: "1589",
    description: "Weekly Orders",
    Icon: ShoppingCart,
  },
  {
    id: 4,
    percentage: 2.33,
    amount: "976",
    description: "Weekly Users",
    Icon: Users,
  },
];

const WigglingCards = () => {
  const aref = useAnimatedRef<Animated.ScrollView>();
  const scrollHandler = useScrollViewOffset(aref);
  const [activeIndex, setActiveIndex] = useState(0);

  useAnimatedReaction(
    () => scrollHandler.value,
    (value) => {
      runOnJS(setActiveIndex)(Math.round(value / SCREEN_WIDTH));
    }
  );

  return (
    <View style={{ alignItems: "center" }}>
      <Animated.ScrollView
        ref={aref}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContainer}
        scrollEventThrottle={16}
        decelerationRate="normal"
      >
        {cardDataArray.map((cardData, index) => {
          return (
            <Card
              key={cardData.id}
              data={cardData}
              scrollOffset={scrollHandler}
              index={index}
            />
          );
        })}
      </Animated.ScrollView>
      <Paginator itemsLength={4} activeIndex={activeIndex} />
    </View>
  );
};

export default WigglingCards;

const styles = StyleSheet.create({
  scrollViewContainer: {
    alignItems: "center",
    paddingVertical: 50,
  },
  cardContainer: {
    width: SCREEN_WIDTH,
    justifyContent: "center",
    alignItems: "center",
  },
});
