import { Skia } from "@shopify/react-native-skia";
import { Dimensions } from "react-native";

const { width } = Dimensions.get("window");
const CHART_HEIGHT = 380;
const CHART_WIDTH = width - 40;
const CHART_PADDING_TOP = 0.08;
const CHART_PADDING_BOTTOM = 0.08;
const CROSSHAIR_RADIUS = 6;
const TOP = CHART_HEIGHT * CHART_PADDING_TOP;
const BOTTOM = CHART_HEIGHT * (1 - CHART_PADDING_BOTTOM);
const RANGE = BOTTOM - TOP;

export type PathSet = { line: ReturnType<typeof Skia.Path.Make>; fill: ReturnType<typeof Skia.Path.Make> };

/** Build line + fill paths for a data series (0..100 scale). Used per data source. */
export function getPaths(data: number[]): PathSet {
  const path = Skia.Path.Make();
  const fill = Skia.Path.Make();
  const stepX = CHART_WIDTH / (data.length - 1);
  const top = CHART_HEIGHT * CHART_PADDING_TOP;
  const bottom = CHART_HEIGHT * (1 - CHART_PADDING_BOTTOM);

  data.forEach((val, i) => {
    const x = i * stepX;
    const y = bottom - (val / 100) * (bottom - top);

    if (i === 0) {
      path.moveTo(x, y);
      fill.moveTo(x, y);
    } else {
      const prevX = (i - 1) * stepX;
      const prevY = bottom - (data[i - 1] / 100) * (bottom - top);
      const cp1x = prevX + (x - prevX) / 2;
      path.cubicTo(cp1x, prevY, cp1x, y, x, y);
      fill.cubicTo(cp1x, prevY, cp1x, y, x, y);
    }
  });

  fill.lineTo(CHART_WIDTH, CHART_HEIGHT);
  fill.lineTo(0, CHART_HEIGHT);
  fill.close();

  return { line: path, fill };
}

export {
  BOTTOM,
  CHART_HEIGHT,
  CHART_PADDING_BOTTOM,
  CHART_PADDING_TOP,
  CHART_WIDTH,
  CROSSHAIR_RADIUS,
  RANGE,
  TOP,
};
