import { Group, Line } from "@shopify/react-native-skia";
import { BAR_WIDTH, EMOJI_SIZE } from "../constants/reactions";
type RaysProps = {
  x: number;
  y: number;
  index: number;
  circleIndex: number;
};
const RAY_COUNT = 12;
const RAY_LENGTH = 20; // Length of each line
const angleStep = (2 * Math.PI) / RAY_COUNT; // Angle between each line
const Rays = ({ x, y, index, circleIndex }: RaysProps) => {
  const angle = index * angleStep;
  const circleXPosition = -BAR_WIDTH / 2 + 35 + circleIndex * 45;
  const x1 = Math.cos(angle) * EMOJI_SIZE + circleXPosition;
  const y1 = Math.sin(angle) * EMOJI_SIZE;
  const x2 = Math.cos(angle) * (EMOJI_SIZE + RAY_LENGTH) + circleXPosition;
  const y2 = Math.sin(angle) * (EMOJI_SIZE + RAY_LENGTH);
  return (
    <Group>
      <Line p1={{ x: 0, y: 0 }} p2={{ x: 100, y: 100 }} color="red" />
    </Group>
  );
};

export default Rays;
