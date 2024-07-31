import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import Svg, { Path, G, Defs, LinearGradient, Stop } from "react-native-svg";
import * as d3 from "d3-shape";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  runOnJS,
  useAnimatedReaction,
  withDelay,
  withSpring,
  withSequence,
} from "react-native-reanimated";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "../constants/window";

const RADIUS = SCREEN_WIDTH / 3;
const NUMBER_OF_ARCS = 6; // You can change this to any number of arcs
const angle = (2 * Math.PI) / NUMBER_OF_ARCS;
const GAP = 0.04 * Math.PI; // Adjust this value to change the gap size
const CORNER_RADIUS = 10; // Adjust this value to change the corner radius
const STEP_DURATION = 500; // Duration for each step
const DELAY = 500; // Delay after each step
const arc = d3.arc();

const createArc = (index: number): string => {
  // Calculate the center angle for the arc
  const centerAngle = index * angle;
  // Calculate the start and end angles, adjusting for the gap
  const startAngle = centerAngle - angle / 2 + GAP / 2;
  const endAngle = centerAngle + angle / 2 - GAP / 2;

  const arcGenerator = arc
    .outerRadius(RADIUS)
    .innerRadius(RADIUS - 20)
    .startAngle(startAngle)
    .endAngle(endAngle)
    .cornerRadius(CORNER_RADIUS);
  const arcPath = arcGenerator({
    startAngle,
    endAngle,
  } as d3.DefaultArcObject);
  // Return simple path in case of error
  return arcPath ?? "M0,0";
};

// Helper function to create the progress arc path
const createProgressArcPath = (progress: number): string => {
  const firstArcEndAngle = angle / 2 - GAP / 2; // End angle of the first arc (right corner of the first arc)
  const arcGenerator = arc
    .outerRadius(RADIUS)
    .innerRadius(RADIUS - 20)
    .startAngle(firstArcEndAngle) // Align with the end of the first arc
    .endAngle(firstArcEndAngle - progress) // Dynamic end angle in counter-clockwise direction
    .cornerRadius(CORNER_RADIUS);

  const progressArcPath = arcGenerator({
    startAngle: firstArcEndAngle,
    endAngle: firstArcEndAngle - progress,
  } as d3.DefaultArcObject);

  return progressArcPath ?? "M0,0";
};
const heartPathData = `M15.7 4C18.87 4 21 6.98 21 9.76C21 15.39 12.16 20 12 20C11.84 20 3 15.39 3 9.76C3 6.98 5.13 4 8.3 4C10.12 4 11.31 4.91 12 5.71C12.69 4.91 13.88 4 15.7 4Z`;

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedGroup = Animated.createAnimatedComponent(G);

const HeartProgressCircle: React.FC = () => {
  const progress = useSharedValue(0);
  const [path, setPath] = useState("");
  const heartScale = useSharedValue(7);
  const [currentIndex, setCurrentIndex] = useState(0);
  const arcs = Array.from({ length: NUMBER_OF_ARCS }, (_, i) => createArc(i));

  const calculateTargetProgress = (index: number) => {
    const oneStep = (2 * Math.PI - NUMBER_OF_ARCS * GAP) / NUMBER_OF_ARCS;
    let targetProgress = (index + 1) * (oneStep + GAP) - GAP;

    if (index === NUMBER_OF_ARCS - 1) {
      targetProgress = 2 * Math.PI;
    }

    return targetProgress;
  };

  const startHeartScaleAnimation = () => {
    heartScale.value = withSequence(
      withSpring(6, { damping: 5, mass: 1.5 }),
      withSpring(6.8, { damping: 5, mass: 1.5 }),
      withSpring(6.5, { damping: 5, mass: 1.5 }),
      withSpring(7, { damping: 5, mass: 1.5 })
    );
  };

  const startProgressAnimation = (index: number, targetProgress: number) => {
    progress.value = withDelay(
      index * (STEP_DURATION + DELAY),
      withSpring(
        targetProgress,
        { damping: 14, stiffness: 150 },
        (finished) => {
          if (finished) {
            runOnJS(setCurrentIndex)(index + 1);
          }
        }
      )
    );
  };

  useEffect(() => {
    if (currentIndex < NUMBER_OF_ARCS) {
      const targetProgress = calculateTargetProgress(currentIndex);
      startHeartScaleAnimation();
      startProgressAnimation(currentIndex, targetProgress);
    }
  }, [currentIndex]);

  const updateProgressArcPath = (value: number) => {
    const generatedPath = createProgressArcPath(value);
    setPath(generatedPath);
  };

  useAnimatedReaction(
    () => progress.value,
    (value) => {
      runOnJS(updateProgressArcPath)(value);
    }
  );

  const animatedProps = useAnimatedProps(() => {
    return {
      d: path,
    };
  });

  const heartAnimatedProps = useAnimatedProps(() => {
    return { scale: heartScale.value };
  });

  return (
    <Svg height={SCREEN_HEIGHT} width={SCREEN_WIDTH}>
      <Defs>
        <LinearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#ef6dce" />
          <Stop offset="100%" stopColor="#f063cb" />
        </LinearGradient>
        <LinearGradient id="heartGrad" x1="80%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#ff7cad" />
          <Stop offset="100%" stopColor="#ff65d9" />
        </LinearGradient>
      </Defs>
      <G transform={`translate(${SCREEN_WIDTH / 2}, ${SCREEN_HEIGHT / 2})`}>
        {arcs.map((arc, index) => (
          <AnimatedPath key={index} d={arc} fill="#8769b3" strokeWidth="2" />
        ))}
        <AnimatedPath
          animatedProps={animatedProps}
          fill="url(#grad)"
          strokeWidth="2"
        />
        <AnimatedGroup animatedProps={heartAnimatedProps}>
          <AnimatedPath
            d={heartPathData}
            transform={`translate(-12, -12)`}
            fill="url(#heartGrad)"
          />
        </AnimatedGroup>
      </G>
    </Svg>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default HeartProgressCircle;
