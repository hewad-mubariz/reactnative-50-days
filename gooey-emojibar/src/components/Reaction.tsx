import React, { useState } from "react";
import { View, Dimensions } from "react-native";
import {
  Blur,
  Canvas,
  ColorMatrix,
  Group,
  Paint,
  RoundedRect,
  Skia,
  SkMatrix,
  useFont,
} from "@shopify/react-native-skia";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";
import Emoji from "./Emoji";
import Circle from "./Circle";
import { BAR_HEIGHT, BAR_WIDTH, EMOJI_SIZE } from "../constants/reactions";
import Images from "./Images";

const EMOJIS = ["❤️", "😁", "😢", "😡", "👍"];
const BLUR = 9;

export default function EmojiBar() {
  const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const barWidth = useSharedValue(BAR_WIDTH);
  const font = useFont(
    require("../../assets/NotoColorEmoji-Regular.ttf"),
    EMOJI_SIZE
  );
  const matrix = useSharedValue<SkMatrix>(Skia.Matrix());
  const barX = useDerivedValue(() => {
    return -barWidth.value / 2;
  });
  if (!font) {
    return null;
  }

  const longPress = Gesture.LongPress()
    .onStart((event) => {
      //setActiveIndex(1);
      for (let i = 0; i < EMOJIS.length; i++) {
        const x = event.absoluteX - BAR_WIDTH / 2;
        const y = event.absoluteY - BAR_HEIGHT / 2;
        const activeIndex = Math.floor(x / 45);
        setActiveIndex(activeIndex);
      }
    })
    .runOnJS(true);
  const tap = Gesture.Tap()
    .onStart(() => {
      setActiveIndex(null);
    })
    .runOnJS(true);

  const gesture = Gesture.Race(longPress, tap);
  return (
    <Animated.View style={{ flex: 1 }}>
      <GestureDetector gesture={gesture}>
        <Canvas style={{ flex: 1, backgroundColor: "#ff67a3" }}>
          <Images />

          <Group
            transform={[
              { translateX: screenWidth / 2 },
              { translateY: screenHeight - 70 },
            ]}
          >
            {/* Gooey Background */}
            <Group
              layer={
                <Paint>
                  <Blur blur={BLUR} />
                  <ColorMatrix
                    matrix={[
                      // prettier-ignore
                      //R
                      1, 0, 0, 0, 0,
                      // prettier-ignore
                      //G
                      0, 1, 0, 0, 0,
                      // prettier-ignore
                      //B
                      0, 0, 1, 0, 0,
                      // prettier-ignore
                      //A
                      0, 0, 0, 45, -28,
                    ]}
                  />
                </Paint>
              }
            >
              <RoundedRect
                x={barX}
                y={-BAR_HEIGHT / 2}
                width={barWidth}
                height={BAR_HEIGHT}
                r={30}
                color="#FFF"
              />

              {/* Circles for Gooey Effect */}
              {EMOJIS.map((_, index) => (
                <Circle
                  matrix={matrix}
                  key={`emoji-${index}`}
                  index={index}
                  isActive={index === activeIndex}
                />
              ))}
            </Group>

            {/* Emoji Layer (Separate from Blur) */}
            {EMOJIS.map((emoji, index) => (
              <Emoji
                matrix={matrix}
                key={`emoji-${index}`}
                emoji={emoji}
                index={index}
                isActive={index === activeIndex}
              />
            ))}
          </Group>
        </Canvas>
      </GestureDetector>
    </Animated.View>
  );
}
