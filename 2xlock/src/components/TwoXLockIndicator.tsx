import { BlurView } from "expo-blur";
import { LockKeyhole } from "lucide-react-native";
import { useState } from "react";
import { Pressable, Text } from "react-native";
import Animated, {
  clamp,
  FadeIn,
  interpolate,
  ReduceMotion,
  SharedValue,
  SlideInRight,
  useAnimatedProps,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { Circle, Svg } from "react-native-svg";
import { scheduleOnRN } from "react-native-worklets";

type TwoXLockIndicatorProps = {
  progress: SharedValue<number>;
  isLocked: SharedValue<number>;
  onPress?: () => void;
};

const BADGE_SIZE = 45;
const COLLAPSED_WIDTH = 45;
const EXPANDED_WIDTH = 84;
const RING_SIZE = 48;
const STROKE_WIDTH = 2.4;
const RADIUS = (RING_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedSvg = Animated.createAnimatedComponent(Svg);
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedLockKeyhole = Animated.createAnimatedComponent(LockKeyhole);
export const TwoXLockIndicator = ({
  progress,
  isLocked,
  onPress,
}: TwoXLockIndicatorProps) => {
  //Todo:: consider cleaning this up
  const scale = useSharedValue(1);
  const containerWidth = useSharedValue(COLLAPSED_WIDTH);
  //to trigger the animation of the lock keyhole
  const [showLock, setShowLock] = useState(false);

  const animatedProgressProps = useAnimatedProps(() => {
    const normalizedProgress = clamp(progress.value, 0, 1);
    const strokeWidth = interpolate(normalizedProgress, [0, 1], [1.2, 2.4]);
    return {
      strokeWidth,
      strokeDashoffset: CIRCUMFERENCE * (1 - normalizedProgress),
    };
  });

  useAnimatedReaction(
    () => progress.value,
    (value) => {
      const normalizedProgress = clamp(value, 0, 1);
      if (normalizedProgress === 1) {
        scale.value = withSequence(
          withTiming(1.2, { duration: 100 }),
          withTiming(1, { duration: 100 }),
        );
        containerWidth.value = withTiming(COLLAPSED_WIDTH, { duration: 120 });
      } else {
        scale.value = 1;
      }
    },
  );

  const animatedSvgStyle = useAnimatedStyle(() => {
    const opacity = interpolate(isLocked.value, [0, 1], [1, 0]);
    return {
      opacity,
    };
  });

  useAnimatedReaction(
    () => isLocked.value,
    (value) => {
      if (value === 1) {
        containerWidth.value = withTiming(EXPANDED_WIDTH, { duration: 180 });
        scheduleOnRN(setShowLock, true);
      } else {
        containerWidth.value = withTiming(COLLAPSED_WIDTH, { duration: 180 });
        //to trigger the layout animation can also be done with sharedValues but i think this is also fine
        scheduleOnRN(setShowLock, false);
      }
    },
  );

  const animatedRootStyle = useAnimatedStyle(() => {
    return {
      width: containerWidth.value,
      transform: [{ scale: scale.value }],
    };
  });

  const animatedCapsuleStyle = useAnimatedStyle(() => {
    return {
      width: containerWidth.value,
    };
  });
  const handlePress2xLock = () => {
    onPress?.();
  };
  return (
    <Animated.View
      style={[
        {
          width: COLLAPSED_WIDTH,
          height: BADGE_SIZE,
          alignItems: "center",
          justifyContent: "center",
        },
        animatedRootStyle,
      ]}
    >
      <AnimatedPressable
        onPress={handlePress2xLock}
        style={animatedCapsuleStyle}
      >
        <AnimatedBlurView
          intensity={100}
          tint={"light"}
          blurMethod="dimezisBlurViewSdk31Plus"
          style={[
            {
              borderRadius: BADGE_SIZE / 2,
              overflow: "hidden",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
              height: BADGE_SIZE,
              gap: 8,
              zIndex: 1,
            },
          ]}
        >
          {showLock && (
            <Animated.View entering={FadeIn}>
              <AnimatedLockKeyhole
                entering={SlideInRight.springify()
                  .duration(40)
                  .dampingRatio(1)
                  .mass(2)
                  .energyThreshold(6e-9)
                  .reduceMotion(ReduceMotion.System)}
                size={20}
                color="#F8FAFC"
              />
            </Animated.View>
          )}
          <Text style={{ color: "#F8FAFC", fontSize: 20, fontWeight: "700" }}>
            2x
          </Text>
        </AnimatedBlurView>
      </AnimatedPressable>

      <AnimatedSvg
        pointerEvents={"none"}
        width={RING_SIZE}
        height={RING_SIZE}
        style={[
          { position: "absolute", top: (BADGE_SIZE - RING_SIZE) / 2 },
          animatedSvgStyle,
        ]}
      >
        <Circle
          cx={RING_SIZE / 2}
          cy={RING_SIZE / 2}
          r={RADIUS}
          stroke="rgba(255,255,255,0.28)"
          strokeWidth={1.2}
          fill="none"
        />
        <AnimatedCircle
          animatedProps={animatedProgressProps}
          cx={RING_SIZE / 2}
          cy={RING_SIZE / 2}
          r={RADIUS}
          stroke="white"
          strokeLinecap="round"
          fill="none"
          strokeDasharray={CIRCUMFERENCE}
          transform={`rotate(-90 ${RING_SIZE / 2} ${RING_SIZE / 2})`}
        />
      </AnimatedSvg>
    </Animated.View>
  );
};
