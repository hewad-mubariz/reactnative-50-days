// SplitButton.js
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import Svg, { Path, G, Text } from "react-native-svg";
import { splitButtonConstants } from "../constants/splitButton";
import { SCREEN_WIDTH } from "../constants/window";
import { pathData1, pathData2, arrowPath } from "../utils/splitButton";

const { totalWidth, buttonHeight } = splitButtonConstants;
const containerWidth = SCREEN_WIDTH * 0.96;
const translateX = (containerWidth - totalWidth) / 2;

const AnimatedGroup = Animated.createAnimatedComponent(G);
export const SplitButton = () => {
  const [expanded, setExpanded] = useState(false);
  const offset = useSharedValue(0);

  const handlePress = () => {
    setExpanded((prev) => !prev);
    offset.value = withSpring(expanded ? 0 : 25);
  };

  const animatedProps1 = useAnimatedProps(() => {
    return {
      x: -offset.value,
    };
  });

  const animatedProps2 = useAnimatedProps(() => {
    return {
      x: offset.value,
    };
  });

  return (
    <LinearGradient style={styles.container} colors={["#e5ecd6", "#f9f7ee"]}>
      <Svg height={buttonHeight} width="100%">
        <G onPress={handlePress} transform={`translate(${translateX}, 0)`}>
          <AnimatedGroup animatedProps={animatedProps1}>
            <Path d={pathData1} fill="black" />
            <Text
              x={splitButtonConstants.endPoints.leftButtonRectEndX / 2.8}
              y={
                splitButtonConstants.leftButtonRect.rect.y +
                splitButtonConstants.leftButtonRect.rect.height / 1.65
              }
              fontSize="20"
              fill="white"
              textAnchor="middle"
            >
              Contact
            </Text>
          </AnimatedGroup>
          <AnimatedGroup animatedProps={animatedProps2}>
            <Path d={pathData2} fill="black" />
            <Path d={arrowPath} stroke="white" strokeWidth="2" fill="none" />
          </AnimatedGroup>
        </G>
      </Svg>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    height: 300,
    width: SCREEN_WIDTH * 0.96,
    alignSelf: "center",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "white",
  },
});
