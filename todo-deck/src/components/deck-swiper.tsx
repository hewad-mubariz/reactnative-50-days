import { StyleSheet, useWindowDimensions, View, Text } from "react-native";
import DeckCard from "./deck-card";
import Animated, { FadeInLeft, useSharedValue } from "react-native-reanimated";
import { useState } from "react";
type DeckSwiperProps = {
  data: any[];
  cardWidth: number;
  cardHeight: number;
};
export const DeckSwiper = ({
  data,
  cardWidth,
  cardHeight,
}: DeckSwiperProps) => {
  const sharedProgress = useSharedValue(0);
  const [isFinished, setIsFinished] = useState(false);
  const handleItemSwiped = (isLastItem: boolean) => {
    if (isLastItem) {
      setIsFinished(true);
    }
  };
  const resetDeck = () => {
    sharedProgress.value = 0;
    setIsFinished(false);
  };
  return (
    <View style={[styles.container]}>
      {isFinished ? (
        <Animated.View
          onTouchStart={resetDeck}
          entering={FadeInLeft.springify()}
          style={styles.finishedContainer}
        >
          <Text style={styles.finishedText}>
            Boom! {"\n"}You're up {"\n"} to date.
          </Text>
        </Animated.View>
      ) : (
        <>
          {data.map((item, index) => (
            <DeckCard
              key={item.id}
              item={item}
              index={index}
              cardWidth={cardWidth}
              sequenceIndex={index}
              sharedProgress={sharedProgress}
              totalItems={data.length}
              cardHeight={cardHeight}
              itemSwiped={handleItemSwiped}
            />
          ))}
        </>
      )}
    </View>
  );
};

export default DeckSwiper;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  finishedContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  finishedText: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    color: "#b1b1b1",
    fontFamily: "RobotoSerif_400Regular",
    lineHeight: 40,
  },
});
