import { Group, Path, Skia } from "@shopify/react-native-skia";
import { BAR_WIDTH, EMOJI_SIZE } from "../constants/reactions";
import {
  SharedValue,
  useSharedValue,
  useDerivedValue,
  useAnimatedReaction,
  withSequence,
  withTiming,
} from "react-native-reanimated";

type RaysProps = {
  index: number;
  circleIndex: number;
  progress: SharedValue<number>;
};

const RAY_COUNT = 12;
const RAY_LENGTH = 20;
const angleStep = (2 * Math.PI) / RAY_COUNT;

const Ray = ({ index, circleIndex, progress }: RaysProps) => {
  const angle = index * angleStep;
  const circleXPosition = -BAR_WIDTH / 2 + 35 + circleIndex * 45;

  // Start and end positions
  const x1 = Math.cos(angle) * EMOJI_SIZE + circleXPosition;
  const y1 = Math.sin(angle) * EMOJI_SIZE;
  const x2 = Math.cos(angle) * (EMOJI_SIZE + RAY_LENGTH) + circleXPosition;
  const y2 = Math.sin(angle) * (EMOJI_SIZE + RAY_LENGTH);

  // Create Path
  const rayPath = Skia.Path.Make();
  rayPath.moveTo(x1, y1);
  rayPath.lineTo(x2, y2);

  // Animation Values
  const start = useSharedValue(1);
  const end = useSharedValue(0);

  // React to `progress` to trigger the animation
  useAnimatedReaction(
    () => progress.value,
    (value) => {
      if (value === 1) {
        // Animate the line appearing
        start.value = withTiming(0, { duration: 500 });
        end.value = withTiming(1, { duration: 500 }, () => {
          start.value = withTiming(1, { duration: 500 });
        });
      } else {
        start.value = 1;
        end.value = 0;
      }
    }
  );

  return (
    <Group>
      <Path
        path={rayPath}
        strokeWidth={2}
        color="#FFD700"
        style="stroke"
        start={start}
        end={end}
      />
    </Group>
  );
};

export default Ray;
