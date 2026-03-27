import { StyleSheet, useWindowDimensions, View } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

import { scheduleOnRN } from "react-native-worklets";
import DeckCardContent from "./deck-card-content";
import * as Haptics from "expo-haptics";

const damping = 0.8;
const MAX_VISIBLE_ITEMS = 3;
const SCALE_FACTOR = 0.05; // Each card gets 5% smaller
const Y_OFFSET = 25;

const input = Array.from({ length: MAX_VISIBLE_ITEMS }, (_, i) => i); // Each card sits 25px lower
const scaleOutput = input.map((i) => 1 - i * SCALE_FACTOR);
const translateYOutput = input.map((i) => i * Y_OFFSET);

const DeckCard = ({
  sharedProgress,
  cardWidth,
  cardHeight,
  index,
  totalItems,
  itemSwiped,
  item,
}: {
  index: number;
  sharedProgress: SharedValue<number>;
  cardWidth: number;
  cardHeight: number;
  totalItems: number;
  sequenceIndex: number;
  itemSwiped: (isLastItem: boolean) => void;
  item: any;
}) => {
  const translateX = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      const prevX = translateX.value;
      translateX.value = event.translationX * damping;

      // Trigger light haptic when crossing certain thresholds while dragging
      const threshold = cardWidth * 0.15;
      if (
        (prevX < threshold && translateX.value >= threshold) ||
        (prevX > -threshold && translateX.value <= -threshold)
      ) {
        scheduleOnRN(Haptics.selectionAsync);
      }

      const dragProgress = Math.abs(translateX.value) / (cardWidth * 0.5);
      sharedProgress.value = index + Math.min(dragProgress, 1);
    })
    .onEnd((event) => {
      const shouldDismiss =
        Math.abs(translateX.value) > cardWidth / 3 ||
        Math.abs(event.velocityX) > 500;

      if (shouldDismiss) {
        scheduleOnRN(
          Haptics.notificationAsync,
          Haptics.NotificationFeedbackType.Success,
        );
        const direction = Math.sign(translateX.value);
        translateX.value = withSpring(direction * cardWidth * 2, {
          damping: 20,
          stiffness: 80,
          mass: 1,
          velocity: event.velocityX,
        });

        // Lock in the progress to the next card index
        sharedProgress.value = withTiming(
          index + 1,
          { duration: 250 },
          (finished) => {
            if (finished) {
              scheduleOnRN(itemSwiped, isLastItem);
            }
          },
        );
        const isLastItem = index === totalItems - 1;
      } else {
        translateX.value = withSpring(0);
        sharedProgress.value = withSpring(index);
      }
    });

  const combinedGesture = Gesture.Race(panGesture);
  const aStyle = useAnimatedStyle(() => {
    // This card's relative position in the stack (0 = top, 1 = next, etc.)
    const relIndex = index - sharedProgress.value;
    const scale = interpolate(
      relIndex,
      input,
      scaleOutput,
      Extrapolation.CLAMP,
    );
    const translateY = interpolate(
      relIndex,
      input,
      translateYOutput,
      Extrapolation.CLAMP,
    );

    const rotation =
      relIndex <= 0 ? `${(translateX.value / cardWidth) * 15}deg` : "0deg";

    return {
      zIndex: totalItems - index,
      transform: [
        { translateX: relIndex <= 0 ? translateX.value : 0 },
        { translateY: relIndex <= 0 ? 0 : translateY },
        { scale: scale },
        { rotateZ: rotation },
      ],
      position: "absolute",
    };
  });

  return (
    <GestureDetector gesture={combinedGesture}>
      <Animated.View
        style={[
          styles.container,
          aStyle,
          { width: cardWidth, height: cardHeight },
        ]}
      >
        <DeckCardContent
          item={item}
          sharedProgress={sharedProgress}
          index={index}
        />
      </Animated.View>
    </GestureDetector>
  );
};

export default DeckCard;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,

    borderWidth: 1,
    borderColor: "#eaeaea",
  },
});
