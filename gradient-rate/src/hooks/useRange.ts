import { useMemo } from "react";
import { useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const useRange = () => {
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const snapPoints = useMemo(
    () => [
      // Position 1 (Collapsed/Initial): Larger number (closer to screen bottom)
      height - (height * 0.35 + insets.bottom),
      // Position 2 (Expanded/Full): Smaller number (closer to screen top)
      height - height * 0.55,
    ],
    [height, insets.bottom],
  );

  return snapPoints;
};
