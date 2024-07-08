import React from "react";
import { View, Text, StyleSheet } from "react-native";
import {
  ArrowUp,
  ArrowDown,
  LucideIcon,
  ArrowUpRight,
} from "lucide-react-native";
import { SCREEN_WIDTH } from "../constants/window";
import Animated, {
  interpolate,
  ReduceMotion,
  SharedValue,
  useAnimatedProps,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { BlurView } from "expo-blur";

interface CardData {
  id: number;
  percentage: number;
  amount: string;
  description: string;
  Icon: LucideIcon;
}
const CARD_WIDTH = SCREEN_WIDTH * 0.75;
const CARD_HEIGHT = 260;
const PADDING = 20;

// This is matter of taste customize as you wish
const SPRING_CONFIG = {
  mass: 0.8,
  damping: 15,
  stiffness: 180,
  overshootClamping: false,
  restDisplacementThreshold: 0.01,
  restSpeedThreshold: 2,
  reduceMotion: ReduceMotion.System,
};

interface DynamicCardProps {
  data: CardData;
  scrollOffset: SharedValue<number>;
  index: number;
}
const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

const formatAmount = (amount: string): string => {
  if (amount.startsWith("$")) {
    // Extract the numeric part and format it
    const numericPart = parseFloat(amount.replace(/[^0-9.-]+/g, ""));
    const formattedNumericPart = numericPart.toLocaleString();
    // Return the formatted amount with the dollar sign
    return `$${formattedNumericPart}`;
  }
  // If no dollar sign, return the amount as is
  return amount;
};
export const Card: React.FC<DynamicCardProps> = ({
  data,
  scrollOffset,
  index,
}) => {
  const { Icon, percentage, amount, description } = data;
  const animatedStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      scrollOffset.value,
      [
        (index - 1) * SCREEN_WIDTH,
        index * SCREEN_WIDTH,
        (index + 1) * SCREEN_WIDTH,
      ],
      [25, 0, -15]
    );

    return {
      transform: [
        {
          rotateZ: withSpring(`${rotate}deg`, SPRING_CONFIG),
        },
      ],
    };
  });
  const animatedProps = useAnimatedProps(() => {
    const targetIntensity =
      Math.abs(scrollOffset.value / SCREEN_WIDTH - index) * 50;

    return {
      intensity: withTiming(targetIntensity, { duration: 100 }),
    };
  });
  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <View style={styles.card}>
        <Icon size={50} color="black" />
        <View style={styles.infoContainer}>
          <View style={styles.percentageContainer}>
            {percentage >= 0 ? (
              <ArrowUp color="#6b6a6f" size={22} strokeWidth={3} />
            ) : (
              <ArrowDown color="#6b6a6f" size={22} strokeWidth={3} />
            )}
            <Text style={styles.percentage}>{percentage}%</Text>
          </View>
          <Text style={styles.amount}>{formatAmount(amount)}</Text>
          <View style={styles.descriptionContainer}>
            <Text style={styles.description}>{description}</Text>
            <View style={styles.arrowContainer}>
              <ArrowUpRight color="#07070b" />
            </View>
          </View>
        </View>
        <AnimatedBlurView
          animatedProps={animatedProps}
          style={styles.blurView}
        />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: PADDING,
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 15,
    elevation: 5,
  },
  blurView: {
    position: "absolute",
    borderRadius: 10,
    height: 240,
    width: SCREEN_WIDTH * 0.75,
    top: PADDING / 2,
    zIndex: 1,
  },
  infoContainer: {},
  percentageContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f4f3fa",
    paddingHorizontal: 4,
    paddingVertical: 6,
    borderRadius: 12,
    width: "35%",
    gap: 3,
  },
  percentage: {
    fontSize: 16,
    color: "#6b6a6f",
  },
  amount: {
    fontSize: 32,
    fontWeight: "bold",
    marginVertical: 5,
  },
  descriptionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  description: {
    fontSize: 18,
    fontWeight: "600",
    color: "#07070b",
  },
  arrowContainer: {
    backgroundColor: "#f5f4fb",
    width: 45,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 22.5,
  },
});
