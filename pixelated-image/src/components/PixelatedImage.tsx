import React, { FC, useEffect } from "react";
import {
  Canvas,
  useImage,
  Skia,
  Fill,
  Shader,
  ImageShader,
} from "@shopify/react-native-skia";
import {
  SharedValue,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

type Props = {
  image: string;
  width: number;
  height: number;
  index: number;
  currentIndex: number;
};

const DENSITY = 20;

const pixelated = Skia.RuntimeEffect.Make(`
  uniform vec2 amount; 
  uniform vec2 resolution; 
  uniform shader image; 
  uniform float shakeIntensity; 

  // Define swap speed directly in the shader
  const float SWAP_SPEED = 0.0005; // Lower value = slower swapping, higher = faster

  float random(vec2 uv) {
    return fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453123);
  }

  half4 main(vec2 uv) {
    vec2 blockSize = resolution / amount;
    vec2 blockUV = floor(uv / blockSize) * blockSize;

    // Use SWAP_SPEED directly for controlling the randomness
    vec2 shake = vec2(
      (random(blockUV + vec2(SWAP_SPEED * shakeIntensity)) - 0.5) * blockSize.x,
      (random(blockUV - vec2(SWAP_SPEED * shakeIntensity)) - 0.5) * blockSize.y
    );

    vec2 coord = blockUV + shake;
    coord = mod(coord, resolution);

    half4 pixelatedColor = image.eval(coord);
    half4 originalColor = image.eval(uv);

    // Blend based on shakeIntensity (for revealing effect)
    return mix(originalColor, pixelatedColor, shakeIntensity);
  }
`)!;

export const PixelatedImage: FC<Props> = ({
  image,
  width,
  height,
  index,
  currentIndex,
}) => {
  const sImage = useImage(image);
  const shakeIntensity = useSharedValue(1); // Start fully pixelated

  const uniforms = useDerivedValue(() => ({
    amount: [DENSITY, DENSITY],
    resolution: [width, height],
    shakeIntensity: shakeIntensity.value,
  }));

  useEffect(() => {
    if (index === currentIndex) {
      shakeIntensity.value = withTiming(0, { duration: 6000 });
    }
  }, [currentIndex]);

  if (!sImage) {
    return null;
  }

  return (
    <Canvas style={{ flex: 1, width, height }}>
      <Fill>
        <Shader source={pixelated} uniforms={uniforms}>
          <ImageShader
            image={sImage}
            fit="cover"
            width={width}
            height={height}
          />
        </Shader>
      </Fill>
    </Canvas>
  );
};
