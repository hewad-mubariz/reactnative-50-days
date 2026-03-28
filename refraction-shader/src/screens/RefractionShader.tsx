import { View, useWindowDimensions } from "react-native";
import {
  Canvas,
  Fill,
  ImageShader,
  Skia,
  Shader,
  useImage,
  vec,
} from "@shopify/react-native-skia";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import {
  cancelAnimation,
  useDerivedValue,
  useSharedValue,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { useAudioPlayer } from "expo-audio";
import { scheduleOnRN } from "react-native-worklets";

const rippleEffect = Skia.RuntimeEffect.Make(`
uniform shader image;
uniform float2 resolution;
uniform float2 touch;
uniform float progress;
uniform float velocity;

half4 main(float2 xy) {
  float2 uv = xy / resolution;
  float2 center = touch / resolution;
  float ratio = resolution.x / resolution.y;
  
  float2 dir = uv - center;
  dir.y /= ratio; 
  float dist = length(dir);
  
  // 1. Slow down expansion (max 1.5 radius)
  float wavePos = progress * 1.5;
  
  // 2. Physical Wave Function
  // We use a decaying pulse that gets wider as it moves out
  float bandWidth = 0.2 + (progress * 0.2);
  float diff = dist - wavePos;
  float pulse = exp(-pow(diff / bandWidth, 2.0));
  
  // 3. The "Oscillation"
  // Moderate frequency, but it fades toward the center for a cleaner look
  float wave = sin(diff * 45.0) * pulse;
  
  // 4. Refraction (The "Lens" effect)
  // Real water distortion is stronger at the start and dissipates
  float strength = (0.04 + min(velocity * 0.0001, 0.04)) * (1.0 - progress);
  float2 refraction = (dist > 0.0) ? (dir / dist) * wave * strength : float2(0.0);
  
  // 5. Specular Highlights (The "Glint")
  // This creates the light reflecting off the crest of the ripple
  float light = pow(max(0.0, wave), 2.0) * (1.0 - progress) * 0.15;
  
  // Sample the image with the distorted UVs
  float2 sampleUv = uv + refraction;
  half4 color = image.eval(sampleUv * resolution);
  
  // Add the light glint on top of the image
  return color + half4(light, light, light, 0.0);
}
`)!;
const audioSource = require("../../assets/water.mp3");

export const RefractionShader = () => {
  const image = useImage(require("../../assets/images/water.png"));
  const { width, height } = useWindowDimensions();

  const touch = useSharedValue(vec(width / 2, height / 2));
  const progress = useSharedValue(1);
  const rippleVelocity = useSharedValue(0);
  const lastSpawnX = useSharedValue(0);
  const lastSpawnY = useSharedValue(0);
  const player = useAudioPlayer(audioSource);

  const uniforms = useDerivedValue(
    () => ({
      resolution: vec(width, height),
      touch: touch.value,
      progress: progress.value,
      velocity: rippleVelocity.value,
    }),
    [width, height],
  );
  const playAudio = () => {
    try {
      player.seekTo(0);
      player.play();
    } catch {
      player.replace(audioSource);
      player.play();
    }
  };
  const triggerRipple = (x: number, y: number, vel: number) => {
    "worklet";
    touch.value = vec(x, y);
    rippleVelocity.value = vel;

    cancelAnimation(progress);
    progress.value = 0;

    // MUCH slower duration for "photo" realism
    // 2500ms allows the water to settle naturally
    progress.value = withTiming(1, {
      duration: 4000,
      easing: Easing.bezier(0.2, 0, 0.3, 1),
    });
  };

  const pan = Gesture.Pan()
    .onBegin((e) => {
      lastSpawnX.value = e.x;
      lastSpawnY.value = e.y;
      triggerRipple(e.x, e.y, 0);
      scheduleOnRN(playAudio);
    })
    .onUpdate((e) => {
      const dx = e.x - lastSpawnX.value;
      const dy = e.y - lastSpawnY.value;
      const moved = Math.sqrt(dx * dx + dy * dy);

      if (moved > 60) {
        // Increased threshold to avoid "shaky" water
        lastSpawnX.value = e.x;
        lastSpawnY.value = e.y;
        triggerRipple(e.x, e.y, moved * 5);
      }
    });

  if (!image) return null;

  return (
    <GestureDetector gesture={pan}>
      <View style={{ flex: 1, backgroundColor: "#000" }}>
        <Canvas style={{ flex: 1 }}>
          <Fill>
            <Shader source={rippleEffect} uniforms={uniforms}>
              <ImageShader
                image={image}
                fit="cover"
                rect={{ x: 0, y: 0, width, height }}
              />
            </Shader>
          </Fill>
        </Canvas>
      </View>
    </GestureDetector>
  );
};
