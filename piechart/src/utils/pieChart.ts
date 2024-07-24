import { arc as d3Arc } from "d3-shape";
import { SCREEN_WIDTH } from "../constants/window";

export type PieChartItem = {
  day: string;
  value: number;
};

export const generatePieChartSegment = (segments: PieChartItem[]) => {
  const wheelSize = SCREEN_WIDTH * 0.7;
  const radius = wheelSize / 2;
  const innerRadius = radius * 0.6;
  const outerRadius = radius;
  const cornerRadius = 5;
  const arc = d3Arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius)
    .cornerRadius(cornerRadius);

  const totalValue = segments.reduce((acc, segment) => acc + segment.value, 0);
  const gapAngle = (2 * Math.PI) / 250; // Small fixed gap between segments 360 is full

  let cumulativeAngle = 0;

  return segments.map((day) => {
    const segmentAngle =
      (day.value / totalValue) * (2 * Math.PI - gapAngle * segments.length);
    const startAngle = cumulativeAngle;
    const endAngle = startAngle + segmentAngle;

    cumulativeAngle = endAngle + gapAngle;

    const pathData = arc({ startAngle, endAngle } as any)!;
    const centroid = arc.centroid({ startAngle, endAngle } as any);

    return {
      pathData,
      centroid,
      rotationAngle: (startAngle + endAngle) / 2,
      day,
    };
  });
};
