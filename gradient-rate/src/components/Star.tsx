import { Group, Path, Skia } from "@shopify/react-native-skia";
import React, { useMemo } from "react";
import {
  useDerivedValue,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const STAR_PATH =
  "M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z";

interface StarProps {
  x: number;
  y: number;
  active: boolean;
  size?: number;
  color?: string;
}

const Star: React.FC<StarProps> = ({
  x,
  y,
  active,
  size = 32,
  color = "white",
}) => {
  const scale = useSharedValue(0.88);

  React.useEffect(() => {
    scale.value = withSpring(active ? 1 : 0.8, {
      damping: 40,
      stiffness: 220,
      mass: 0.8,
    });
  }, [active]);

  const path = useMemo(() => {
    const p = Skia.Path.MakeFromSVGString(STAR_PATH);
    if (!p) {
      throw new Error("Failed to create star path");
    }

    // Center the 24x24 star at (0,0) and scale to desired size
    const m = Skia.Matrix();
    m.translate(-12, -12);
    m.scale(size / 24, size / 24);
    p.transform(m);

    return p;
  }, [size]);
  const transform = useDerivedValue(() => {
    return [
      { translateX: x },
      { translateY: y },
      { scale: scale.value },
      { translateX: 0 }, // No extra translation needed after scaling from center
      { translateY: 0 },
    ];
  });
  return (
    <Group transform={transform}>
      <Path path={path} color={color} />
    </Group>
  );
};

export default Star;
