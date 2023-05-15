import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { SCREEN_WIDTH } from "../../constants/screen";

type FlipCardProps = {
  suit: Suit;
  rank: string;
  width: number;
  height: number;
};
const IMAGE = "../../../assets/card-background.jpg";
const FlipCard: React.FC<FlipCardProps> = ({ suit, rank, width, height }) => {
  const animationValue = useSharedValue(180);
  const frontStyle = useAnimatedStyle(() => ({
    position: "absolute",
    transform: [{ rotateY: `${animationValue.value}deg` }],
    backfaceVisibility: "hidden",
  }));
  const backStyle = useAnimatedStyle(() => ({
    position: "absolute",
    transform: [{ rotateY: `${animationValue.value + 180}deg` }],
    backfaceVisibility: "hidden",
  }));

  const handlePress = () => {
    if (animationValue.value === 0) {
      animationValue.value = withTiming(180, {
        duration: 800,
      });
    } else {
      animationValue.value = withTiming(0, {
        duration: 800,
      });
    }
  };

  const suitSymbols = {
    hearts: "♥",
    diamonds: "♦",
    clubs: "♣",
    spades: "♠",
  };

  const textColor = suit === "hearts" || suit === "diamonds" ? "red" : "black";

  const front = (
    <View style={[styles.card, { width, height }]}>
      <View style={styles.cardHeader}>
        <Text style={[styles.rank, { color: textColor }]}>{rank}</Text>
        <Text style={[styles.suit, { color: textColor }]}>
          {suitSymbols[suit]}
        </Text>
      </View>
    </View>
  );

  const back = (
    <View
      style={[
        styles.card,
        { width, height, justifyContent: "center", alignItems: "center" },
      ]}
    >
      <Image source={require(IMAGE)} style={styles.image} />
    </View>
  );

  return (
    <Pressable onPress={handlePress}>
      <Animated.View style={[frontStyle]}>{front}</Animated.View>
      <Animated.View style={[backStyle]}>{back}</Animated.View>
    </Pressable>
  );
};

export default FlipCard;

const styles = StyleSheet.create({
  card: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "black",
    padding: 8,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    top: 10,
    left: 10,
  },
  rank: {
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 5,
  },
  suit: {
    fontSize: 24,
    fontWeight: "bold",
  },
  cardCenter: {
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: SCREEN_WIDTH * 0.3,
    height: 150,
    borderRadius: 8,
  },
});
