import { LinearGradient } from "expo-linear-gradient";
import { type LucideIcon } from "lucide-react-native";
import { useCallback } from "react";
import { Pressable, StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
type RecentItem = {
  Icon: LucideIcon;
  gradient: [string, string];
};
export const RecentIconButton = ({ item }: { item: RecentItem }) => {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  const onPressIn = useCallback(() => {
    scale.value = withTiming(0.95, { duration: 100 });
  }, [scale]);
  const onPressOut = useCallback(() => {
    scale.value = withTiming(1, { duration: 100 });
  }, [scale]);

  return (
    <AnimatedPressable
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={[styles.recentIconButton, animatedStyle]}
    >
      <LinearGradient
        colors={item.gradient}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={styles.recentIconGradient}
      />
      <item.Icon color="#FFFFFF" size={20} strokeWidth={2.4} />
    </AnimatedPressable>
  );
};
const styles = StyleSheet.create({
  recentIconButton: {
    width: 58,
    height: 58,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255,255,255,0.3)",
  },
  recentIconGradient: {
    ...StyleSheet.absoluteFillObject,
  },
});
