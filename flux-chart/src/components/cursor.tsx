import { CHART_HEIGHT, CROSSHAIR_RADIUS } from "@/constants/chart";
import { Circle, Path, Skia } from "@shopify/react-native-skia";
import type { Cursor as CursorType } from "../../types";

type CursorProps = {
  cursor: CursorType;
};

function makeCrosshairLinePath(x: number) {
  const p = Skia.Path.Make();
  p.moveTo(x, 0);
  p.lineTo(x, CHART_HEIGHT);
  return p;
}

export const Cursor = ({ cursor }: CursorProps) => {
  const { x, y } = cursor;

  return (
    <>
      <Path
        path={makeCrosshairLinePath(x)}
        style="stroke"
        strokeWidth={1}
        color="rgba(0, 0, 0, 0.12)"
      />
      <Circle
        cx={x}
        cy={y}
        r={CROSSHAIR_RADIUS}
        color="#FFFFFF"
        style="stroke"
        strokeWidth={2}
      />
      <Circle cx={x} cy={y} r={CROSSHAIR_RADIUS - 1} color="#32C5FF" />
    </>
  );
};
