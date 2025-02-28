import React, { useEffect } from "react";
import { Dimensions, Platform } from "react-native";
import {
  Canvas,
  Circle,
  FontSlant,
  matchFont,
  Path,
  Skia,
  Text,
  useClock,
  vec,
} from "@shopify/react-native-skia";
import {
  runOnJS,
  useAnimatedReaction,
  useDerivedValue,
  useSharedValue,
  withSequence,
  withTiming,
  withRepeat,
} from "react-native-reanimated";
import { createNoise2D } from "simplex-noise";
import NoiseCircle from "./NoiseCircle";
const { width, height } = Dimensions.get("window");
const RADIUS = 120;
const TICK_LENGTH = 8; // Small tick length
const CENTER = vec(width / 2, height / 2);
const C = 0.55228474983079;
const F = 3000; // Speed of noise changes
const A = 0.15; // Subtle noise
const HAND_WIDTHS = { hour: 6, minute: 4, second: 2 };
const HAND_LENGTHS = {
  hour: RADIUS * 0.5,
  minute: RADIUS * 0.7,
  second: RADIUS * 0.85,
};
const n1 = createNoise2D();
const n2 = createNoise2D();
const n3 = createNoise2D();
const n4 = createNoise2D();
const fontFamily = Platform.select({ ios: "Helvetica", default: "serif" });
const fontStyle = {
  fontFamily,
  fontSize: 14,
  fontWeight: "bold",
  fontStyle: FontSlant.Oblique,
};
const font = matchFont(fontStyle);
const ApproxClock = () => {
  const time = useSharedValue({ hours: 0, minutes: 0, seconds: 0 });
  const strokeWidthC3 = useSharedValue(10);
  const clock = useClock();
  const noiseValues = useSharedValue({ C1: C, C2: C, C3: C, C4: C });
  // Update time every second
  // Update time every second
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      time.value = {
        hours: now.getHours(),
        minutes: now.getMinutes(),
        seconds: now.getSeconds(),
      };
    };

    updateClock(); // Set initial time
    const interval = setInterval(updateClock, 1000); // Update every second
    return () => clearInterval(interval);
  }, []);

  // Derived values for angles (converted to radians)
  const secondAngle = useDerivedValue(() => {
    return withTiming((time.value.seconds / 60) * 360 * (Math.PI / 180), {
      duration: 250,
    });
  });
  const minuteAngle = useDerivedValue(
    () =>
      ((time.value.minutes / 60) * 360 + time.value.seconds / 10) *
      (Math.PI / 180)
  );
  const hourAngle = useDerivedValue(
    () =>
      (((time.value.hours % 12) / 12) * 360 + time.value.minutes / 2) *
      (Math.PI / 180)
  );

  useEffect(() => {
    strokeWidthC3.value = withSequence(
      withRepeat(withTiming(18, { duration: 500 }), -1, true),
      withTiming(9, { duration: 500 })
    );
  }, []);

  // Clock Hands (Animated)
  const createHandPath = (angle, length) => {
    return useDerivedValue(() => {
      const p = Skia.Path.Make();
      const x = CENTER.x + length * Math.cos(angle.value - Math.PI / 2);
      const y = CENTER.y + length * Math.sin(angle.value - Math.PI / 2);
      p.moveTo(CENTER.x, CENTER.y);
      p.lineTo(x, y);
      return p;
    });
  };

  const hourHand = createHandPath(hourAngle, HAND_LENGTHS.hour);
  const minuteHand = createHandPath(minuteAngle, HAND_LENGTHS.minute);
  const secondHand = createHandPath(secondAngle, HAND_LENGTHS.second);
  // Clock Tick Marks
  const tickMarks = useDerivedValue(() => {
    const p = Skia.Path.Make();
    for (let i = 0; i < 12; i++) {
      const angle = (i * Math.PI) / 6; // 30° increments
      const x1 = CENTER.x + (RADIUS - 10) * Math.cos(angle);
      const y1 = CENTER.y + (RADIUS - 10) * Math.sin(angle);
      const x2 = CENTER.x + (RADIUS - TICK_LENGTH - 10) * Math.cos(angle);
      const y2 = CENTER.y + (RADIUS - TICK_LENGTH - 10) * Math.sin(angle);

      p.moveTo(x1, y1);
      p.lineTo(x2, y2);
    }
    return p;
  });
  // Clock Hands

  // Get today's date and format it as "DD MMM"
  const today = new Date();
  const day = today.getDate();
  const month = today
    .toLocaleString("default", { month: "short" })
    .toUpperCase();
  const formattedDate = `${day} ${month}`;

  if (!font) {
    return null;
  }
  return (
    <Canvas
      style={{
        flex: 1,
        backgroundColor: "#D1FCFF",
      }}
    >
      {/* Noisy Circle */}
      <Circle cx={CENTER.x} cy={CENTER.y} r={RADIUS} color="#FFFFFF" />

      <NoiseCircle
        radius={RADIUS + 8}
        color="rgba(255, 211, 254, 1)"
        strokeWidth={strokeWidthC3}
      />
      <NoiseCircle
        radius={RADIUS + 8}
        color="rgba(56, 142, 254, 1)"
        strokeWidth={8}
      />
      <NoiseCircle
        radius={RADIUS + 4}
        color="rgba(108, 108, 252, 1)"
        strokeWidth={6}
      />
      {/* Clock Tick Marks */}
      <Path path={tickMarks} color="black" style="stroke" strokeWidth={2} />
      <Path
        path={hourHand}
        strokeCap={"round"}
        strokeJoin={"round"}
        color="black"
        style="stroke"
        strokeWidth={HAND_WIDTHS.hour}
      />
      <Path
        strokeCap={"round"}
        strokeJoin={"round"}
        path={minuteHand}
        color="blue"
        style="stroke"
        strokeWidth={HAND_WIDTHS.minute}
      />
      <Path
        path={secondHand}
        color="red"
        strokeCap={"round"}
        strokeJoin={"round"}
        style="stroke"
        strokeWidth={HAND_WIDTHS.second}
      />
      <Path
        path={Skia.Path.Make().addCircle(CENTER.x, CENTER.y, 6)}
        color="red"
        style="fill"
      />
      <Text
        x={CENTER.x - 15}
        y={CENTER.y + RADIUS * 0.5}
        text={formattedDate}
        font={font}
        color="black"
      />
    </Canvas>
  );
};

export default ApproxClock;
