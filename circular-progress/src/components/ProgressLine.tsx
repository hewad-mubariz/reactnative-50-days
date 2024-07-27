import {} from "react-native";
import React, { FC } from "react";
import { Line } from "react-native-svg";
import Animated, {
  createAnimatedPropAdapter,
  SharedValue,
  useAnimatedProps,
  withSpring,
  processColor,
} from "react-native-reanimated";
import {
  ANGLE_STEP,
  CENTER,
  BASE_LINE_LENGTH,
  STROKE_WIDTH,
  LINE_COUNT,
} from "../constants/progressCircle";

type Props = {
  index: number;
  progress: SharedValue<number>;
};

const AnimatedLine = Animated.createAnimatedComponent(Line);

const ProgressLine: FC<Props> = ({ index, progress }) => {
  const angle = index * ANGLE_STEP;
  const adapter = createAnimatedPropAdapter(
    (props) => {
      if (Object.keys(props).includes("stroke")) {
        props.stroke = { type: 0, payload: processColor(props.stroke) };
      }
    },
    ["stroke"]
  );
  const animatedProps = useAnimatedProps(
    () => {
      const progressIndex = progress.value * LINE_COUNT;
      const isPastProgress = index < progressIndex;
      const y1Value = isPastProgress
        ? STROKE_WIDTH - BASE_LINE_LENGTH * 0.5
        : STROKE_WIDTH;

      const springConfig = {
        damping: 20 + index * 0.3,
        stiffness: 200 - index * 2,
      };
      return {
        y1: withSpring(y1Value, springConfig),
        stroke: isPastProgress ? "#ff886d" : "#575556",
      };
    },
    [],
    adapter
  );

  return (
    <AnimatedLine
      key={index}
      x1={CENTER}
      x2={CENTER}
      y1={STROKE_WIDTH}
      y2={STROKE_WIDTH + BASE_LINE_LENGTH}
      animatedProps={animatedProps}
      strokeWidth={STROKE_WIDTH * 0.5}
      strokeLinecap="round"
      originX={CENTER}
      originY={CENTER}
      rotation={angle * (180 / Math.PI)}
    />
  );
};

export default ProgressLine;
