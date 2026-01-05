import {
  BlurMask,
  Canvas,
  Circle,
  Group,
  Paint,
  Path,
  RoundedRect,
  Skia,
} from "@shopify/react-native-skia";
import React, { useEffect, useMemo, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import {
  useDerivedValue,
  useFrameCallback,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

// --- PHYSICS CONFIGURATION ---
const ROPE_POINTS = 20;
const GRAVITY = 1.1;
const FRICTION = 0.955;
const NUM_ITERATIONS = 3; // Lower iterations = softer, more elastic rope

// --- UI CONFIGURATION ---
const PADDING = 40;
const KNOB_RADIUS = 15;
const TRACK_Y = 400;
const MIN_DIST = 50;
const MAX_SLACK = 140; // Max vertical dip when rope is loose
const MIN_PRICE = 100;
const MAX_PRICE = 500;

export const RopeSliderScreen = () => {
  const { width } = useWindowDimensions();
  const ROPE_TOTAL_LENGTH = width + 20;

  // --- 1. ANIMATION STATE ---
  const leftX = useSharedValue(PADDING);
  const rightX = useSharedValue(width - PADDING);
  const activeKnob = useSharedValue<"left" | "right" | null>(null);
  const isActivated = useSharedValue(0); // 0 = Static, 1 = Physics Active
  const tick = useSharedValue(0);

  const [range, setRange] = useState({ min: MIN_PRICE, max: MAX_PRICE });

  // --- 2. DATA GENERATION ---
  // Generates a bell-curve distribution for the price histogram
  const BAR_COUNT = 45;
  const BAR_WIDTH = (width - PADDING * 2) / BAR_COUNT;

  const bars = useMemo(() => {
    return new Array(BAR_COUNT).fill(0).map((_, i) => {
      const x = i / BAR_COUNT;
      const bellCurve = Math.sin(x * Math.PI);
      const noise = Math.random() * 0.3;
      const height = (bellCurve + noise) * 80;
      return Math.max(10, height);
    });
  }, [width]);

  // --- 3. PHYSICS ENGINE SETUP ---
  // Initialize rope perfectly straight
  const initialRopeState = useMemo(() => {
    const arr = new Float32Array(ROPE_POINTS * 4);
    const segment = (width - PADDING * 2) / (ROPE_POINTS - 1);
    for (let i = 0; i < ROPE_POINTS; i++) {
      const idx = i * 4;
      arr[idx + 0] = PADDING + i * segment; // x
      arr[idx + 1] = TRACK_Y; // y
      arr[idx + 2] = PADDING + i * segment; // oldX
      arr[idx + 3] = TRACK_Y; // oldY
    }
    return arr;
  }, [width]);

  const ropeState = useSharedValue(initialRopeState);

  // Reset physics if screen width changes
  useEffect(() => {
    ropeState.value = initialRopeState;
  }, [initialRopeState]);

  // --- 4. PHYSICS LOOP (60-120fps) ---
  useFrameCallback(() => {
    tick.value += 1; // Force re-render of derived values

    const points = ropeState.value;
    const segmentLen = ROPE_TOTAL_LENGTH / (ROPE_POINTS - 1);

    // Update Pinned Points (Knobs)
    points[0] = leftX.value;
    points[1] = TRACK_Y;
    const lastIdx = (ROPE_POINTS - 1) * 4;
    points[lastIdx + 0] = rightX.value;
    points[lastIdx + 1] = TRACK_Y;

    // If physics isn't active, maintain a perfect straight line
    if (isActivated.value === 0) {
      const dist = rightX.value - leftX.value;
      const step = dist / (ROPE_POINTS - 1);
      for (let i = 1; i < ROPE_POINTS - 1; i++) {
        const idx = i * 4;
        const idealX = leftX.value + i * step;
        points[idx + 0] = idealX;
        points[idx + 1] = TRACK_Y;
        points[idx + 2] = idealX;
        points[idx + 3] = TRACK_Y;
      }
      return;
    }

    // Verlet Integration step
    for (let i = 1; i < ROPE_POINTS - 1; i++) {
      const idx = i * 4;
      const x = points[idx + 0];
      const y = points[idx + 1];
      const oldX = points[idx + 2];
      const oldY = points[idx + 3];

      const vx = (x - oldX) * FRICTION;
      const vy = (y - oldY) * FRICTION;

      points[idx + 2] = x;
      points[idx + 3] = y;
      points[idx + 0] = x + vx;
      points[idx + 1] = y + vy + GRAVITY;
    }

    // Constraint Solving (Stick Constraints)
    for (let iter = 0; iter < NUM_ITERATIONS; iter++) {
      for (let i = 0; i < ROPE_POINTS - 1; i++) {
        const idx1 = i * 4;
        const idx2 = (i + 1) * 4;

        const x1 = points[idx1];
        const y1 = points[idx1 + 1];
        const x2 = points[idx2];
        const y2 = points[idx2 + 1];

        const dx = x2 - x1;
        const dy = y2 - y1;
        const dist = Math.sqrt(dx * dx + dy * dy);

        const diff = dist - segmentLen;
        const percent = diff / dist / 2;
        const offsetX = dx * percent;
        const offsetY = dy * percent;

        if (i !== 0) {
          points[idx1] += offsetX;
          points[idx1 + 1] += offsetY;
        }
        if (i + 1 !== ROPE_POINTS - 1) {
          points[idx2] -= offsetX;
          points[idx2 + 1] -= offsetY;
        }
      }
    }
  });

  // --- 5. RENDER PATH GENERATION ---
  const trackPath = useDerivedValue(() => {
    const _t = tick.value;
    const p = Skia.Path.Make();
    const points = ropeState.value;

    p.moveTo(points[0], points[1]);

    // Draw smooth curve through physics points
    for (let i = 1; i < ROPE_POINTS; i++) {
      const idx = i * 4;
      const x = points[idx];
      const y = points[idx + 1];
      const prevX = points[(i - 1) * 4];
      const prevY = points[(i - 1) * 4 + 1];

      const midX = (prevX + x) / 2;
      const midY = (prevY + y) / 2;
      p.quadTo(prevX, prevY, midX, midY);
    }

    const lastIdx = (ROPE_POINTS - 1) * 4;
    p.lineTo(points[lastIdx], points[lastIdx + 1]);
    return p;
  });

  // --- 6. HELPERS ---
  const updatePrice = () => {
    "worklet";
    const totalW = width - PADDING * 2;
    const minP = (leftX.value - PADDING) / totalW;
    const maxP = (rightX.value - PADDING) / totalW;

    const minPrice = Math.round(MIN_PRICE + minP * (MAX_PRICE - MIN_PRICE));
    const maxPrice = Math.round(MIN_PRICE + maxP * (MAX_PRICE - MIN_PRICE));

    scheduleOnRN(setRange, { min: minPrice, max: maxPrice });
  };

  const handleClear = () => {
    setRange({ min: MIN_PRICE, max: MAX_PRICE });
    leftX.value = withSpring(PADDING, { stiffness: 90, damping: 12 });
    rightX.value = withSpring(width - PADDING, { stiffness: 90, damping: 12 });
    isActivated.value = 0; // Reset physics to straight line
  };

  // --- 7. GESTURES ---
  const pan = Gesture.Pan()
    .onStart((e) => {
      isActivated.value = 1; // Activate physics
      const distToLeft = Math.abs(e.x - leftX.value);
      const distToRight = Math.abs(e.x - rightX.value);
      if (distToLeft < 60 && distToLeft < distToRight) {
        activeKnob.value = "left";
      } else if (distToRight < 60) {
        activeKnob.value = "right";
      }
    })
    .onUpdate((e) => {
      if (activeKnob.value === "left") {
        let newX = e.x;
        if (newX < PADDING) newX = PADDING;
        if (newX > rightX.value - MIN_DIST) newX = rightX.value - MIN_DIST;
        leftX.value = newX;
      } else if (activeKnob.value === "right") {
        let newX = e.x;
        if (newX > width - PADDING) newX = width - PADDING;
        if (newX < leftX.value + MIN_DIST) newX = leftX.value + MIN_DIST;
        rightX.value = newX;
      }
      updatePrice();
    })
    .onEnd(() => {
      activeKnob.value = null;
    });

  const activeRegion = useDerivedValue(() => {
    return {
      x: leftX.value,
      y: 0,
      width: rightX.value - leftX.value,
      height: TRACK_Y,
    };
  });

  return (
    <GestureDetector gesture={pan}>
      <View style={{ flex: 1, backgroundColor: "#4C6EF5" }}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.priceLabel}>
            Price Range ${range.min} - ${range.max}
          </Text>
        </View>

        <Canvas style={{ flex: 1, width: "100%" }}>
          {/* A. Inactive Bars */}
          <Group>
            {bars.map((h, i) => (
              <RoundedRect
                key={`inactive-${i}`}
                x={PADDING + i * BAR_WIDTH + 2}
                y={TRACK_Y - h - 80}
                width={BAR_WIDTH - 4}
                height={h}
                r={4} // Rounded corners work here
                color="rgba(0,0,0,0.2)"
              />
            ))}
          </Group>

          {/* B. Active Bars (Masked) */}
          <Group clip={activeRegion}>
            {bars.map((h, i) => (
              <RoundedRect
                key={`active-${i}`}
                x={PADDING + i * BAR_WIDTH + 2}
                y={TRACK_Y - h - 80}
                width={BAR_WIDTH - 4}
                height={h}
                r={4} // Rounded corners work here
                color="white"
              />
            ))}
          </Group>

          {/* C. Background Rail */}
          <Path
            path={`M ${PADDING} ${TRACK_Y} L ${width - PADDING} ${TRACK_Y}`}
            color="#3341d1"
            style="stroke"
            strokeWidth={8}
            strokeCap="round"
          />

          {/* D. Physics Rope */}
          <Path
            path={trackPath}
            color="white"
            style="stroke"
            strokeWidth={6}
            strokeCap="round"
            strokeJoin="round"
          >
            <Paint color="black" opacity={0.3} style="stroke" strokeWidth={10}>
              <BlurMask blur={5} style="normal" />
            </Paint>
          </Path>

          {/* E. Knobs */}
          <Group>
            <Circle cx={leftX} cy={TRACK_Y} r={KNOB_RADIUS} color="white" />
            <Circle
              cx={leftX}
              cy={TRACK_Y}
              r={KNOB_RADIUS}
              color="#4C6EF5"
              style="stroke"
              strokeWidth={3}
            />
          </Group>

          <Group>
            <Circle cx={rightX} cy={TRACK_Y} r={KNOB_RADIUS} color="white" />
            <Circle
              cx={rightX}
              cy={TRACK_Y}
              r={KNOB_RADIUS}
              color="#4C6EF5"
              style="stroke"
              strokeWidth={3}
            />
          </Group>
        </Canvas>

        {/* Footer Buttons */}
        <View style={styles.buttonsContainer}>
          <Pressable
            style={[styles.button, styles.clearButton]}
            onPress={handleClear} // Attached Functionality
          >
            <Text style={styles.buttonText}>Clear</Text>
          </Pressable>
          <Pressable style={[styles.button, styles.applyButton]}>
            <Text style={styles.buttonText}>Apply</Text>
          </Pressable>
        </View>
      </View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  header: {
    position: "absolute",
    top: 150,
    width: "100%",
    alignItems: "center",
    zIndex: 10,
  },
  priceLabel: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    fontVariant: ["tabular-nums"],
  },
  buttonsContainer: {
    position: "absolute",
    bottom: 60,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    zIndex: 20,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
    minWidth: 140,
    alignItems: "center",
    justifyContent: "center",
  },
  clearButton: {
    backgroundColor: "#7B96F5",
  },
  applyButton: {
    backgroundColor: "#00C48C",
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
});
