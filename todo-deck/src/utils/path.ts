import { BOTTOM, CHART_WIDTH, RANGE } from "@/constants/chart";
import { CursorPoint } from "../../types";

function getPointY(value: number) {
  return BOTTOM - (value / 100) * RANGE;
}

const buildChartPoints = (data: number[]): CursorPoint[] => {
  return data.map((value, index) => {
    const x = (index / (data.length - 1)) * CHART_WIDTH;
    const y = getPointY(value);

    return { x, y, value };
  });
};

export { buildChartPoints };
