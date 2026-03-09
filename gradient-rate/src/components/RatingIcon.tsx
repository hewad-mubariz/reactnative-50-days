import { useBottomSheet } from "@gorhom/bottom-sheet";
import { LucideIcon } from "lucide-react-native";
import { StyleSheet } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
interface RatingIconProps {
  Icon: LucideIcon;
  backgroundColor: string;
  color: string;
  index: number;
}
const range = [0, 2];
const totalIcons = 2; // Fixed to 2 based on RatingScreen.tsx
const RatingIcon = ({
  Icon,
  backgroundColor,
  color,
  index,
}: RatingIconProps) => {
  const { animatedIndex } = useBottomSheet();

  const animatedStyle = useAnimatedStyle(() => {
    const centerIndex = (totalIcons - 1) / 2;
    const distanceFromCenter = index - centerIndex;
    const rotation = interpolate(
      animatedIndex.value,
      range,
      [0, distanceFromCenter * 20],
      Extrapolation.CLAMP,
    );

    const baseShift = 14;
    const translateX = interpolate(
      animatedIndex.value,
      range,
      [baseShift, distanceFromCenter * 40 + baseShift],
      Extrapolation.CLAMP,
    );

    const translateY = interpolate(
      animatedIndex.value,
      range,
      [0, Math.abs(distanceFromCenter) * 4],
      Extrapolation.CLAMP,
    );

    return {
      zIndex: index === 0 ? 2 : 1,
      transform: [
        { translateX: translateX },
        { translateY: translateY },
        { rotate: `${rotation}deg` },
      ],
    };
  });
  return (
    <Animated.View
      style={[styles.iconBarItem, { backgroundColor }, animatedStyle]}
    >
      <Icon size={24} color={color} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  iconBarItem: {
    width: 50,
    height: 50,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default RatingIcon;
