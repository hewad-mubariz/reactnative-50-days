import React from "react";
import { G, Path } from "react-native-svg";
import Animated, {
  createAnimatedPropAdapter,
  processColor,
  SharedValue,
  useAnimatedProps,
  withTiming,
} from "react-native-reanimated";

const AnimatedPath = Animated.createAnimatedComponent(Path);
const Group = Animated.createAnimatedComponent(G);

type SegmentData = {
  pathData: string;
  centroid: [number, number];
  rotationAngle: number;
  day: any;
};

type PieChartSegmentProps = {
  segment: SegmentData;
  selectedSegmentAnimatedIndex: SharedValue<number>;
  index: number;
  onPress: () => void;
};

export const BarChartSegment: React.FC<PieChartSegmentProps> = ({
  segment,
  selectedSegmentAnimatedIndex,
  index,
  onPress,
}) => {
  const adapter = createAnimatedPropAdapter(
    (props: any) => {
      if (Object.keys(props).includes("fill")) {
        props.fill = { type: 0, payload: processColor(props.fill) };
      }
    },
    ["fill"]
  );

  const animatedGroupProps = useAnimatedProps(
    () => {
      return {
        scale: withTiming(
          selectedSegmentAnimatedIndex.value === index ? 1.1 : 1
        ),
        fill:
          index === selectedSegmentAnimatedIndex.value ? "#ff274b" : "#f2aebe",
      };
    },
    [],
    adapter
  );
  return (
    <Group animatedProps={animatedGroupProps}>
      <AnimatedPath onPress={onPress} d={segment.pathData} stroke={"#C2ABC0"} />
    </Group>
  );
};
