import { Group, SkMatrix, Text, useFont } from "@shopify/react-native-skia";
import {
  EMOJI_SIZE,
  BAR_WIDTH,
  DURATION,
  EMOJI_TRANSLATE_Y,
  DISMISS_DURATION,
} from "../constants/reactions";
import {
  SharedValue,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { useEffect } from "react";
import Ray from "./Ray";
type EmojiProps = {
  emoji: string;
  index: number;
  matrix: SharedValue<SkMatrix>;
  isActive: boolean;
};
const RAY_COUNT = 12;
const Emoji = ({ emoji, index, matrix, isActive }: EmojiProps) => {
  const translateY = useSharedValue(0);
  const progress = useSharedValue(0);
  const font = useFont(
    require("../../assets/NotoColorEmoji-Regular.ttf"),
    EMOJI_SIZE
  );
  const transform = useDerivedValue(() => {
    return [{ translateY: translateY.value }];
  });
  useEffect(() => {
    if (isActive) {
      progress.value = withTiming(1, { duration: DURATION });
      translateY.value = withTiming(translateY.value - EMOJI_TRANSLATE_Y, {
        duration: DURATION,
      });
    } else {
      progress.value = withTiming(0, { duration: DISMISS_DURATION });
      translateY.value = withTiming(0, { duration: DISMISS_DURATION });
    }
  }, [isActive]);

  if (!font) {
    return null;
  }
  return (
    <Group transform={transform}>
      <Text
        font={font}
        text={emoji}
        x={-BAR_WIDTH / 2 + 20 + index * 45}
        y={EMOJI_SIZE / 2.8}
      />

      {new Array(RAY_COUNT).fill(0).map((_, i) => {
        return (
          <Ray key={i} index={i} progress={progress} circleIndex={index} />
        );
      })}
    </Group>
  );
};

export default Emoji;
