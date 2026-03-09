import {
  BlurMask,
  Canvas,
  Group,
  LinearGradient,
  Mask,
  RoundedRect,
  Shadow,
  vec,
} from "@shopify/react-native-skia";
import * as Haptics from "expo-haptics";
import React, { useMemo } from "react";

import { useBottomSheet } from "@gorhom/bottom-sheet";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import {
  useDerivedValue,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import Star from "./Star";

interface SkiaRatingProps {
  onRatingChange?: (rating: number) => void;
}
const height = 55;
const starSize = 32;
const numStars = 5;
const padding = 40;

const SkiaRating = ({ onRatingChange }: SkiaRatingProps) => {
  const { width: screenWidth } = useWindowDimensions();
  const horizontalPadding = 24;
  const width = screenWidth - horizontalPadding * 2;

  const rating = useSharedValue(0);
  const [clampedRating, setClampedRating] = React.useState(-1);
  const { expand } = useBottomSheet();

  // Layout for stars along the bar
  const availableWidth = width - padding * 2;
  const spacing = availableWidth / (numStars - 1);
  const applyHaptics = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
  };

  const tapGesture = Gesture.Tap()
    .onStart(() => {
      scheduleOnRN(expand);
    })
    .onEnd((e) => {
      const relativeX = e.x - padding;
      const starIndex = Math.round(relativeX / spacing);
      const clampedIndex = Math.max(0, Math.min(numStars - 1, starIndex));

      const starCenterX = padding + clampedIndex * spacing;
      const targetFill = starCenterX / width;

      rating.value = withSpring(targetFill);
      scheduleOnRN(setClampedRating, clampedIndex);

      if (onRatingChange) {
        const selected = clampedIndex + 1;
        scheduleOnRN(onRatingChange, selected);
        scheduleOnRN(applyHaptics);
      }
    });

  // Animated width for the fill
  const fillWidth = useDerivedValue(() => {
    return Math.max(0, Math.min(width, rating.value * width));
  });

  const barHeight = height; // slightly inset from container height
  const barY = (height - barHeight) / 2;

  // Centers for each star (aligned to the bar's vertical center)
  // We add a small offset (e.g., -2) if they still look "off" due to the star shape's visual weight
  const starCenters = useMemo(
    () =>
      Array.from({ length: numStars }, (_, i) => ({
        x: padding + i * spacing,
        y: barY + barHeight / 2 - 3, // Center of bar with -2px visual weight adjustment
      })),
    [barY, barHeight, numStars, padding, spacing],
  );

  const colors = [
    "#403814", // Darker tip start
    "#A89834", // Main vibrant start
    "#348C31", // Main vibrant green
    "#123612", // Darker tip end
  ];
  const positions = [0, 0.05, 0.95, 1.0];
  return (
    <View style={styles.container}>
      <GestureDetector gesture={tapGesture}>
        <Canvas style={{ width, height }}>
          {/* 1. Background Rounded Rect (Empty state) */}
          <RoundedRect
            x={0}
            y={barY}
            width={width}
            height={barHeight}
            r={18}
            color="#1a1a1a"
          />

          <Mask
            mask={
              <RoundedRect
                x={0}
                y={barY}
                width={width}
                height={barHeight}
                r={18}
              />
            }
          >
            <Group>
              <RoundedRect
                x={0}
                y={barY}
                width={fillWidth}
                height={barHeight}
                r={18}
              >
                <LinearGradient
                  start={vec(0, 0)}
                  end={vec(width, 0)}
                  colors={colors}
                  positions={positions}
                />
                <Shadow dx={0} inner={true} dy={3} blur={3} color="#a6952d" />
                <Shadow dx={0} inner={true} dy={-3} blur={3} color="#a6952d" />
                <BlurMask blur={35} style="normal" />
                <Shadow dx={5} inner={false} dy={5} blur={0} color="#a6952d" />
              </RoundedRect>
            </Group>
          </Mask>

          {/* 3. Stars on top:
              - drawn via Star component
              - each star has its own animated scale
          */}
          <Group>
            {starCenters.map((center, index) => (
              <Star
                key={index}
                x={center.x}
                y={center.y}
                size={starSize}
                active={index <= clampedRating}
                color="white"
              />
            ))}
          </Group>
        </Canvas>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    borderRadius: 18,
    overflow: "hidden",
    alignSelf: "center",
  },
});

export default SkiaRating;
