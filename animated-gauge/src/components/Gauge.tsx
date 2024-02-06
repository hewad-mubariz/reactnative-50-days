import React, { useCallback, useState } from "react";
import Svg, { G, Text, Path, Image } from "react-native-svg";
import * as d3Shape from "d3-shape";
import Animated, {
  createAnimatedPropAdapter,
  Easing,
  processColor,
  runOnJS,
  useAnimatedProps,
  useAnimatedReaction,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import {
  HEIGHT,
  moods,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
  SEGMENT_OVERLAP,
  WIDTH,
} from "../constants";
import { GaugeSegments } from "./GaugeSegments";

const TOTAL_SEGMENTS = 10;
const ARC_SPAN = Math.PI / (TOTAL_SEGMENTS - 1.5);
const RADIUS = (Math.min(WIDTH, HEIGHT) / 2) * 1.1;
const AnimatedPath = Animated.createAnimatedComponent(Path);

const arcGenerator = d3Shape
  .arc()
  .innerRadius(RADIUS - 8)
  .outerRadius(RADIUS + 15)
  .cornerRadius(10);

export const Gauge: React.FC = () => {
  const [path, setPath] = useState("");
  const [segmentPath, setSegmentPath] = useState("");
  const selectedMood = useSharedValue(1);
  const [selectedUserMood, setSelectedUserMood] = useState(1);

  const handleSegmentPress = useCallback((moodValue: number) => {
    selectedMood.value = withTiming(moodValue);
    setSelectedUserMood(moodValue);
  }, []);

  const generatePath = () => {
    //5.88 More than half
    const endAngle =
      Math.PI * 0.588 -
      ARC_SPAN * (TOTAL_SEGMENTS - selectedMood.value) +
      SEGMENT_OVERLAP;

    const startAngle =
      Math.PI * 0.588 - ARC_SPAN * TOTAL_SEGMENTS - SEGMENT_OVERLAP;

    const animatedPath = arcGenerator({
      startAngle: startAngle,
      endAngle: endAngle,
      innerRadius: RADIUS - 8,
      outerRadius: RADIUS + 15,
    });
    setPath(animatedPath ? animatedPath : "");
    return animatedPath;
  };

  const generateLastSegmentPath = () => {
    const endAngle =
      Math.PI * 0.588 -
      ARC_SPAN * (TOTAL_SEGMENTS - selectedMood.value) +
      SEGMENT_OVERLAP;

    const startAngle =
      Math.PI * 0.565 -
      ARC_SPAN * (TOTAL_SEGMENTS - (selectedMood.value - 1)) +
      SEGMENT_OVERLAP;

    const segmentPath = arcGenerator({
      startAngle: startAngle,
      endAngle: endAngle,
      innerRadius: RADIUS - 8,
      outerRadius: RADIUS + 15,
    });
    setSegmentPath(segmentPath ? segmentPath : "");
    return segmentPath;
  };
  const moodColor = useSharedValue("rgba(179, 48, 48, 1)");

  useAnimatedReaction(
    () => {
      return selectedMood.value;
    },
    (current, previous) => {
      if (current !== previous) {
        moodColor.value = withTiming(moods[selectedUserMood - 1].color, {
          duration: 500,
          easing: Easing.bezier(0.22, 1, 0.36, 1),
        });
        runOnJS(generatePath)();
        runOnJS(generateLastSegmentPath)();
      }
    }
  );
  const adapter = createAnimatedPropAdapter(
    (props) => {
      if (Object.keys(props).includes("fill")) {
        props.fill = { type: 0, payload: processColor(props.fill) };
      }
    },
    ["fill"]
  );
  const animatedProps = useAnimatedProps(
    () => {
      return { d: path, fill: moodColor.value };
    },
    null,
    adapter
  );

  return (
    <Svg width={SCREEN_WIDTH} height={SCREEN_HEIGHT / 2.9}>
      <G transform={`translate(${SCREEN_WIDTH / 2},${SCREEN_HEIGHT / 3.6})`}>
        <GaugeSegments handleSegmentPress={handleSegmentPress} />
        <AnimatedPath
          pointerEvents="none"
          animatedProps={animatedProps}
          opacity={0.9}
        />

        <Image
          x={-32}
          y={-100} // Adjust the y value
          width={70} // Increase the width
          height={70} // Increase the height
          preserveAspectRatio="xMidYMid slice"
          opacity="0.5"
          href={moods[selectedUserMood - 1].emoji}
          clipPath="url(#clip)"
        />
        <Text
          x={0}
          y={-15}
          fontSize={18}
          fill="#8A8A8A"
          textAnchor="middle"
          alignmentBaseline="middle"
        >
          {`${moods[selectedUserMood - 1].label}`}
        </Text>

        <Text
          x={0}
          y={10}
          fontSize={18}
          fontWeight="bold"
          fill="black"
          textAnchor="middle"
          alignmentBaseline="middle"
        >
          {`${moods[selectedUserMood - 1].value} / 10`}
        </Text>
      </G>
    </Svg>
  );
};
