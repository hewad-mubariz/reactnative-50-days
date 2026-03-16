import { chartTransitionSpring } from "@/constants/spring";
import { selection } from "@/utils/haptics";
import { StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from "react-native-reanimated";
import Pill from "./Pill";
type PillProps = {
  selected: string;
  handlePress: (item: string, index: number) => void;
};
export const Pills = ({ selected, handlePress }: PillProps) => {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scaleX: scale.value }],
  }));
  const handlePillPress = (item: string, index: number) => {
    selection();
    scale.value = withSequence(
      withSpring(1.1, { ...chartTransitionSpring }),
      withSpring(1, { ...chartTransitionSpring, damping: 70 }),
    );
    handlePress(item, index);
  };
  return (
    <Animated.View style={[styles.pillContainer, animatedStyle]}>
      {(["1M", "3M", "1Y"] as const).map((item, index) => (
        <Pill
          key={item}
          index={index}
          text={item}
          selected={selected === item}
          handlePress={handlePillPress}
        />
      ))}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  pillContainer: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderRadius: 30,
    padding: 5,
    marginTop: 50,
  },
});
