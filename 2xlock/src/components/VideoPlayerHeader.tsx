import { TwoXLockIndicator } from "@/components/TwoXLockIndicator";
import { BlurView } from "expo-blur";
import { ArrowLeft, Ellipsis } from "lucide-react-native";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type VideoPlayerHeaderProps = {
  progress: SharedValue<number>;
  visibility: SharedValue<number>;
  isLocked: SharedValue<number>;
  onPressBack?: () => void;
  onPressMore?: () => void;
  onPress2xLock?: () => void;
};

export const VideoPlayerHeader = ({
  progress,
  visibility,
  isLocked,
  onPressBack,
  onPressMore,
  onPress2xLock,
}: VideoPlayerHeaderProps) => {
  const insets = useSafeAreaInsets();
  const centerAnimatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(visibility.value, [0, 1], [0, 1]);
    const opacity = interpolate(visibility.value, [0.6, 1], [0, 1]);
    return {
      transform: [{ scale }],
      opacity,
    };
  });

  return (
    <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
      <Pressable onPress={onPressBack} hitSlop={10}>
        <BlurView intensity={100} style={styles.iconChip}>
          <ArrowLeft size={22} color="#F8FAFC" strokeWidth={2.5} />
        </BlurView>
      </Pressable>

      {/* Could be moved to the TwoXLockIndicator component to have all animations in one place*/}
      <Animated.View style={[styles.speedChip, centerAnimatedStyle]}>
        <TwoXLockIndicator
          isLocked={isLocked}
          progress={progress}
          onPress={onPress2xLock}
        />
      </Animated.View>

      <Pressable onPress={onPressMore} hitSlop={10}>
        <BlurView
          intensity={100}
          blurMethod="dimezisBlurViewSdk31Plus"
          style={styles.iconChip}
        >
          <Ellipsis size={22} color="#F8FAFC" strokeWidth={2.5} />
        </BlurView>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconChip: {
    width: 45,
    height: 45,
    borderRadius: 45 / 2,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    //backgroundColor: "rgba(255,255,255,0.45)",
  },
  speedChip: {
    alignItems: "center",
    justifyContent: "center",
  },
});
