import React, { useState } from "react";
import { View, Dimensions } from "react-native";
import { Canvas, Group } from "@shopify/react-native-skia";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Star from "./Star";

const { width, height } = Dimensions.get("window");

const SCALE_FACTOR = 1.3;
const STAR_SIZE = 50 * SCALE_FACTOR;
const SPACING = 15;
const TOTAL_WIDTH = 5 * (STAR_SIZE + SPACING);

const Stars = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const tapGesture = Gesture.Tap()
    .onEnd(({ x, y }) => {
      const startX = width / 2 - TOTAL_WIDTH / 2;
      const startY = height / 2 - STAR_SIZE / 2;

      for (let i = 0; i < 5; i++) {
        const starX = startX + i * (STAR_SIZE + SPACING);

        if (
          x >= starX &&
          x <= starX + STAR_SIZE &&
          y >= startY &&
          y <= startY + STAR_SIZE
        ) {
          setActiveIndex(i);
          return;
        }
      }
    })
    .runOnJS(true);

  return (
    <GestureDetector gesture={tapGesture}>
      <View style={{ flex: 1, backgroundColor: "#ecf0fd" }}>
        <Canvas style={{ width, height }}>
          <Group
            transform={[
              { translateX: width / 2 - TOTAL_WIDTH / 2 },
              { translateY: height / 2 - STAR_SIZE / 2 },
            ]}
          >
            {[...Array(5)].map((_, index) => (
              <Star
                key={index}
                index={index}
                starSize={STAR_SIZE}
                spacing={SPACING}
                isActive={index <= activeIndex}
              />
            ))}
          </Group>
        </Canvas>
      </View>
    </GestureDetector>
  );
};

export default Stars;
