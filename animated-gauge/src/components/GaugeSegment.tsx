import React, { useCallback, useMemo } from "react";
import { Path, Text } from "react-native-svg";
import * as d3Shape from "d3-shape";
import { HEIGHT, WIDTH, SEGMENT_OVERLAP } from "../constants";

interface Props {
  index: number;
  handleSegmentPress: (value: number) => void;
}
const TOTAL_SEGMENTS = 10;
const ARC_SPAN = Math.PI / (TOTAL_SEGMENTS - 1.5);

const RADIUS = (Math.min(WIDTH, HEIGHT) / 2) * 1.1;
const LABEL_SPACING = 30;
const LABEL_RADIUS = RADIUS + LABEL_SPACING;

const arcGenerator = d3Shape
  .arc()
  .innerRadius(RADIUS - 8)
  .outerRadius(RADIUS + 15)
  .cornerRadius(10);

export const GaugeSegment: React.FC<Props> = ({
  index,
  handleSegmentPress,
}) => {
  const onPress = useCallback(() => {
    handleSegmentPress(index + 1);
  }, []);

  const startAngle = useMemo(
    () => -Math.PI / 1.7 + ARC_SPAN * index - SEGMENT_OVERLAP,
    [index]
  );

  const endAngle = useMemo(
    () => startAngle + ARC_SPAN + 2 * SEGMENT_OVERLAP,
    [startAngle]
  );

  const midAngle = useMemo(
    () => (startAngle + endAngle) / 2,
    [startAngle, endAngle]
  );

  const pathDescription =
    arcGenerator({
      startAngle: startAngle,
      endAngle: endAngle,
      innerRadius: RADIUS - 8,
      outerRadius: RADIUS + 15,
    }) || "";

  return (
    <React.Fragment>
      <Path d={pathDescription} onPress={onPress} fill="lightgray" />
      <Text
        x={LABEL_RADIUS * Math.cos(midAngle - Math.PI / 2)}
        y={LABEL_RADIUS * Math.sin(midAngle - Math.PI / 2)}
        fontSize={18}
        onPress={onPress}
        fill="black"
        textAnchor="middle"
        alignmentBaseline="middle"
      >
        {index + 1}
      </Text>
    </React.Fragment>
  );
};
