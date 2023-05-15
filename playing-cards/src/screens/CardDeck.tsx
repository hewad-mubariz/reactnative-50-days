import React, { useState } from "react";
import { View, StyleSheet, Pressable, Text } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  interpolate,
} from "react-native-reanimated";
import FlipCard from "../components/shared/FlipCard";
import { cards } from "../constants/data";
import { SCREEN_WIDTH } from "../constants/screen";
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const cardWidth = SCREEN_WIDTH * 0.3;
const cardHeight = 150;
const maxCardsPerRow = 3;
const cardMargin = 10;
const CardDeck = () => {
  const progress = useSharedValue(0);
  const [isSpread, setIsSpread] = useState(false);
  const handleSpread = () => {
    setIsSpread((prev) => !prev);
    progress.value = withTiming(progress.value ? 0 : 1, { duration: 500 });
  };
  const getCardStyle = (index: number) => {
    return useAnimatedStyle(() => {
      const cardOffset = 1.2;
      const marginLeft = 10;

      const row = Math.floor(index / maxCardsPerRow);
      const col = index % maxCardsPerRow;

      const stackedLeft = marginLeft + index * cardOffset;
      const stackedTop = index * cardOffset;

      const spreadLeft = marginLeft + col * (cardWidth + cardMargin);
      const spreadTop = row * (cardHeight + cardMargin);

      const baseLeft =
        progress.value * (spreadLeft - stackedLeft) + stackedLeft;
      const baseTop = progress.value * (spreadTop - stackedTop) + stackedTop;

      const left = withDelay(
        index * 60,
        withTiming(baseLeft, { duration: 500 })
      );
      const top = withDelay(index * 60, withTiming(baseTop, { duration: 500 }));

      return {
        left: left,
        top: top,
      };
    });
  };
  const buttonStyle = useAnimatedStyle(() => {
    const buttonWidth = interpolate(progress.value, [1, 0], [110, 120]);
    return {
      width: buttonWidth,
      height: 34,
    };
  });
  return (
    <View style={styles.container}>
      <AnimatedPressable
        style={[styles.button, buttonStyle]}
        onPress={handleSpread}
      >
        <Text style={styles.buttonText}>
          {isSpread ? "Stack Cards" : "Spread Cards"}
        </Text>
      </AnimatedPressable>
      <View style={styles.cardDeck}>
        {cards.map((card, index) => {
          const cardStyle = getCardStyle(index);
          return (
            <Animated.View key={index} style={[styles.cardWrapper, cardStyle]}>
              <FlipCard
                suit={card.suit}
                rank={card.rank}
                width={cardWidth}
                height={cardHeight}
              />
            </Animated.View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    flex: 1,
  },
  cardDeck: {
    marginVertical: 4,
    flex: 1,
    flexDirection: "row",
    position: "relative",
    flexWrap: "wrap",
  },
  cardWrapper: {
    position: "absolute",
  },

  button: {
    backgroundColor: "#007BFF",
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
});

export default CardDeck;
