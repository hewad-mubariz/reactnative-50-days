import { Canvas, Fill, ImageShader, Shader } from "@shopify/react-native-skia";
import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import {
  cancelAnimation,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useCubeImages } from "../hooks/useCubeImages";
import { gradientSource, imageSource } from "../shaders/rollingCube";

const DRAG_SENSITIVITY = 0.012;
const MOMENTUM = 0.0009;
const TAU = Math.PI * 2;
const RIGHT_ANGLE = Math.PI / 2;

type Mode = "images" | "gradient";
type Orientation = { x: number; y: number };

const FACE_ORIENTATIONS: Orientation[] = [
  { x: 0, y: 0 },
  { x: 0, y: Math.PI },
  { x: 0, y: RIGHT_ANGLE },
  { x: 0, y: -RIGHT_ANGLE },
  { x: -RIGHT_ANGLE, y: 0 },
  { x: RIGHT_ANGLE, y: 0 },
  { x: Math.PI, y: 0 },
  { x: Math.PI, y: Math.PI },
  { x: Math.PI, y: RIGHT_ANGLE },
  { x: Math.PI, y: -RIGHT_ANGLE },
  { x: -RIGHT_ANGLE, y: RIGHT_ANGLE },
  { x: -RIGHT_ANGLE, y: -RIGHT_ANGLE },
  { x: -RIGHT_ANGLE, y: Math.PI },
  { x: RIGHT_ANGLE, y: RIGHT_ANGLE },
  { x: RIGHT_ANGLE, y: -RIGHT_ANGLE },
  { x: RIGHT_ANGLE, y: Math.PI },
];

function normalizeAngle(angle: number) {
  "worklet";
  let a = angle % TAU;
  if (a > Math.PI) a -= TAU;
  if (a < -Math.PI) a += TAU;
  return a;
}

function shortestAngleDelta(from: number, to: number) {
  "worklet";
  return normalizeAngle(to - from);
}

function wrapToClosestReference(value: number, reference: number) {
  "worklet";
  return reference + shortestAngleDelta(reference, value);
}

function getClosestRestingOrientation(x: number, y: number): Orientation {
  "worklet";

  let best = FACE_ORIENTATIONS[0];
  let bestScore = Number.POSITIVE_INFINITY;

  for (let i = 0; i < FACE_ORIENTATIONS.length; i++) {
    const candidate = FACE_ORIENTATIONS[i];
    const cx = wrapToClosestReference(candidate.x, x);
    const cy = wrapToClosestReference(candidate.y, y);

    const dx = cx - x;
    const dy = cy - y;
    const score = dx * dx + dy * dy;

    if (score < bestScore) {
      bestScore = score;
      best = { x: cx, y: cy };
    }
  }

  return best;
}

const ModeButton = ({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) => {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.modeButton, active && styles.modeButtonActive]}
    >
      <Text style={[styles.modeText, active && styles.modeTextActive]}>
        {label}
      </Text>
    </Pressable>
  );
};

const RollingCubeDemo = () => {
  const { width, height } = useWindowDimensions();

  const [mode, setMode] = React.useState<Mode>("gradient");

  const rotX = useSharedValue(-0.35);
  const rotY = useSharedValue(0.55);

  const startRotX = useSharedValue(0);
  const startRotY = useSharedValue(0);

  const time = useSharedValue(0);

  const { images, areLoaded } = useCubeImages();

  React.useEffect(() => {
    time.value = withTiming(1000, {
      duration: 1000 * 1000,
    });
  }, [time]);

  const gesture = Gesture.Pan()
    .onBegin(() => {
      cancelAnimation(rotX);
      cancelAnimation(rotY);
      startRotX.value = rotX.value;
      startRotY.value = rotY.value;
    })
    .onUpdate((e) => {
      rotY.value = startRotY.value + e.translationX * DRAG_SENSITIVITY;
      rotX.value = startRotX.value + e.translationY * DRAG_SENSITIVITY;
    })
    .onEnd((e) => {
      const projectedX = rotX.value + e.velocityY * MOMENTUM;
      const projectedY = rotY.value + e.velocityX * MOMENTUM;

      const target = getClosestRestingOrientation(projectedX, projectedY);

      rotX.value = withSpring(target.x, {
        stiffness: 240,
        damping: 22,
        mass: 0.95,
        velocity: e.velocityY * 0.0015,
      });

      rotY.value = withSpring(target.y, {
        stiffness: 240,
        damping: 22,
        mass: 0.95,
        velocity: e.velocityX * 0.0015,
      });
    });

  const commonUniforms = useDerivedValue(() => {
    const cx = Math.cos(rotX.value);
    const sx = Math.sin(rotX.value);
    const cy = Math.cos(rotY.value);
    const sy = Math.sin(rotY.value);

    return {
      iResolution: [width, height],
      iMat: [
        cy,
        0,
        sy,
        0,

        sx * sy,
        cx,
        -sx * cy,
        0,

        -cx * sy,
        sx,
        cx * cy,
        0,

        0,
        0,
        0,
        1,
      ],
    };
  });

  const gradientUniforms = useDerivedValue(() => {
    const cx = Math.cos(rotX.value);
    const sx = Math.sin(rotX.value);
    const cy = Math.cos(rotY.value);
    const sy = Math.sin(rotY.value);

    return {
      iResolution: [width, height],
      iTime: time.value,
      iMat: [
        cy,
        0,
        sy,
        0,

        sx * sy,
        cx,
        -sx * cy,
        0,

        -cx * sy,
        sx,
        cx * cy,
        0,

        0,
        0,
        0,
        1,
      ],
    };
  });

  if (!areLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <GestureDetector gesture={gesture}>
        <Canvas style={styles.canvas}>
          <Fill>
            {mode === "images" ? (
              <Shader source={imageSource} uniforms={commonUniforms}>
                {images.map((image, index) => (
                  <ImageShader
                    key={index}
                    image={image!}
                    fit="cover"
                    rect={{ x: 0, y: 0, width, height }}
                  />
                ))}
              </Shader>
            ) : (
              <Shader source={gradientSource} uniforms={gradientUniforms} />
            )}
          </Fill>
        </Canvas>
      </GestureDetector>

      <View style={styles.bottomOverlay}>
        <View style={styles.modeRow}>
          <ModeButton
            label="Images"
            active={mode === "images"}
            onPress={() => setMode("images")}
          />
          <ModeButton
            label="Gradient"
            active={mode === "gradient"}
            onPress={() => setMode("gradient")}
          />
        </View>

        <Text style={styles.helperText}>Drag to rotate</Text>
      </View>
    </View>
  );
};

export default RollingCubeDemo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#05060A",
  },
  canvas: {
    flex: 1,
  },
  bottomOverlay: {
    position: "absolute",
    bottom: 46,
    left: 20,
    right: 20,
    alignItems: "center",
  },
  modeRow: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.08)",
    padding: 6,
    borderRadius: 999,
    gap: 8,
  },
  modeButton: {
    minWidth: 110,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  modeButtonActive: {
    backgroundColor: "white",
  },
  modeText: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 14,
    fontWeight: "600",
  },
  modeTextActive: {
    color: "#0A0B10",
  },
  helperText: {
    marginTop: 14,
    color: "rgba(255,255,255,0.55)",
    fontSize: 13,
  },
});
