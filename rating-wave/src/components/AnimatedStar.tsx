import { FC, useEffect } from "react";
import Animated, {
  createAnimatedPropAdapter,
  interpolateColor,
  processColor,
  useAnimatedProps,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { Defs, G, LinearGradient, Path, Stop } from "react-native-svg";
const AnimatedPath = Animated.createAnimatedComponent(Path);

interface AnimatedStarProps {
  index: number;
  filled: boolean;
  halfFill?: boolean;
  startingDelay: number;
}

const ANIMATION_DELAY = 120;

const STAR_WIDTH = 30;

const generateDynamicStarPath = (size: number) => {
  const scaleFactor = size / 24;

  const staticPath = [
    { cmd: "M", x: 12, y: 2 },
    { cmd: "L", x: 15.09, y: 8.26 },
    { cmd: "L", x: 22, y: 9.27 },
    { cmd: "L", x: 17, y: 14.14 },
    { cmd: "L", x: 18.18, y: 21.02 },
    { cmd: "L", x: 12, y: 17.77 },
    { cmd: "L", x: 5.82, y: 21.02 },
    { cmd: "L", x: 7, y: 14.14 },
    { cmd: "L", x: 2, y: 9.27 },
    { cmd: "L", x: 8.91, y: 8.26 },
    { cmd: "L", x: 12, y: 2 },
    { cmd: "Z" },
  ];

  return staticPath
    .map(({ cmd, x, y }) => {
      if (x !== undefined && y !== undefined) {
        return `${cmd}${x * scaleFactor} ${y * scaleFactor}`;
      }
      return cmd;
    })
    .join(" ");
};

const path = generateDynamicStarPath(STAR_WIDTH);

const AnimatedStar: FC<AnimatedStarProps> = ({
  index,
  filled,
  halfFill,
  startingDelay,
}) => {
  const fill = useSharedValue(0);
  const scale = useSharedValue(0.85);

  useEffect(() => {
    if (filled) {
      fill.value = withDelay(index * ANIMATION_DELAY, withTiming(1));
    }
    scale.value = withDelay(
      index * ANIMATION_DELAY,
      withSpring(1, {
        stiffness: 125, // default is 100
        damping: 12, // default is 10
        mass: 1.05,
        overshootClamping: false,
        restSpeedThreshold: 0.01,
        restDisplacementThreshold: 0.01,
      })
    );
  }, [index, ANIMATION_DELAY]);

  //To work on android
  const adapter = createAnimatedPropAdapter(
    (props: any) => {
      if (Object.keys(props).includes("fill")) {
        props.fill = { type: 0, payload: processColor(props.fill) };
      }
      if (Object.keys(props).includes("stroke")) {
        props.stroke = { type: 0, payload: processColor(props.stroke) };
      }
    },
    ["fill", "stroke"]
  );
  const animatedProps = useAnimatedProps(
    () => {
      const fillOpacity = fill.value;
      const strokeColor = interpolateColor(
        fillOpacity,
        [0, 1],
        ["#a08585", "white"]
      );

      return {
        fillOpacity: fillOpacity,
        stroke: strokeColor,
        transform: [{ scale: scale.value }],
      };
    },
    [],
    adapter
  );

  const currentFill = halfFill ? "url(#halfGradient)" : "white";

  return (
    <G transform={`translate(${index * STAR_WIDTH}, 3)`}>
      <Defs>
        <LinearGradient id="halfGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <Stop offset="50%" stopColor="white" />
          <Stop offset="50%" stopColor="#a08585" />
        </LinearGradient>
      </Defs>

      <AnimatedPath
        fill={currentFill}
        d={path}
        stroke={"#a08585"}
        animatedProps={animatedProps}
      />
    </G>
  );
};
export default AnimatedStar;
