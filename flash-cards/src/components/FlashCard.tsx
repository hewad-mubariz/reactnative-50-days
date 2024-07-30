import { Redo2, Undo2 } from "lucide-react-native";
import React, { FC, useState } from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
} from "react-native-reanimated";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "../constants/window";
import { CardData } from "./FlashCards";

type Props = {
  data: CardData;
};

// TODO:: Refactor this component to reuse some code
const FlashCard: FC<Props> = ({ data }) => {
  const { question, answer, category } = data;
  const [flipped, setFlipped] = useState(false);
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);

  const frontAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 1000 },
      { rotateY: `${rotation.value}deg` },
      { scale: scale.value },
      { translateX: translateX.value },
    ],
    backfaceVisibility: "hidden",
    backgroundColor: "white",
  }));

  const backAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 1000 },
      { rotateY: `${rotation.value + 180}deg` },
      { scale: scale.value },
      { translateX: translateX.value },
    ],
    backgroundColor: "#242424",
    backfaceVisibility: "hidden",
  }));

  const flipCard = () => {
    setFlipped(!flipped);
    scale.value = withSequence(
      withTiming(0.9, { duration: 200 }),
      withTiming(1, { duration: 200 })
    );
    translateX.value = withSequence(
      withTiming(flipped ? 25 : -25, { duration: 200 }),
      withTiming(0, { duration: 200 })
    );
    rotation.value = withDelay(
      200,
      withTiming(flipped ? 0 : 180, { duration: 500 })
    );
  };

  const renderBackContent = () => (
    <Animated.View style={[styles.card, backAnimatedStyle]}>
      <Redo2 color={"white"} />
      <View style={styles.contentContainer}>
        <Text style={[styles.title, { color: "white" }]}>{answer}</Text>
        <Text style={[styles.category]}>{category}</Text>
      </View>
    </Animated.View>
  );

  const renderFrontContent = () => (
    <Animated.View style={[styles.card, frontAnimatedStyle]}>
      <Undo2 color={"#857998"} />
      <View style={styles.contentContainer}>
        <Text style={[styles.title, { color: "#8d70ac" }]}>{question}</Text>
        <Text style={[styles.category]}>{category}</Text>
      </View>
    </Animated.View>
  );

  return (
    <View style={styles.scrollContainer}>
      <Pressable onPress={flipCard} style={styles.container}>
        {renderFrontContent()}
        {renderBackContent()}
      </Pressable>
    </View>
  );
};

export default FlashCard;

const styles = StyleSheet.create({
  scrollContainer: {
    width: SCREEN_WIDTH,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    height: SCREEN_HEIGHT * 0.4,
    width: SCREEN_WIDTH * 0.84,
    borderRadius: 10,
  },
  card: {
    height: "100%",
    width: "100%",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 10,
    position: "absolute",
    backfaceVisibility: "hidden",
  },
  contentContainer: {
    justifyContent: "center",
    flex: 1,
    alignItems: "center",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
  },
  title: {
    fontSize: 25,
    fontWeight: "500",
    textAlign: "center",
    lineHeight: 32,
  },
  category: {
    fontSize: 16,
    fontWeight: "300",
    textTransform: "uppercase",
    position: "absolute",
    bottom: 8,
    color: "#bfa7a7",
  },
});
