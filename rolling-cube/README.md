# Rolling Cube

A high-performance 3D interactive cube built with React Native Skia and Reanimated, featuring a custom Raymarching engine and smooth gesture-based rotation.

## Features

- **Custom Raymarching Engine**: Renders a 3D cube directly in Skia Shaders for pixel-perfect edges and smooth performance.
- **Dual Modes**:
  - **Gradient Mode**: Features a dynamic, multi-layered mesh gradient with glossy highlights.
  - **Images Mode**: Maps six local images to the faces of the cube with realistic lighting.
- **Momentum-based Dragging**: Supports fluid rotation with momentum and velocity tracking.
- **Spring-based Snapping**: Automatically snaps to the nearest face when the user stops dragging, using sophisticated angle normalization.
- **Realistic Lighting**: Includes diffuse lighting and Fresnel effects to enhance the 3D depth.

## How it Works

1. **Shader-based Rendering**: The cube is rendered using a Signed Distance Function (SDF) for a box within a Skia `RuntimeEffect`.
2. **Matrix Transformations**: A 4x4 rotation matrix is calculated from shared values (`rotX`, `rotY`) and passed to the shader to rotate the 3D space.
3. **Face Mapping**: The shader calculates which face is being hit by the ray and maps the corresponding image or gradient seed based on the surface normal.
4. **Resting Orientations**: A set of 16 predefined orientations ensures the cube always snaps to a clean, face-forward position.

## Tech Stack

- **React Native** (0.81.5)
- **Expo** (54.0.33)
- **React Native Skia** (RuntimeEffect, Shader, ImageShader)
- **React Native Reanimated** (Shared values, withSpring, useDerivedValue)
- **Gesture Handler** (react-native-gesture-handler)
- **TypeScript**

## Installation

1. Clone the repository.
2. Navigate to the directory:
   ```bash
   cd rolling-cube
   ```
3. Install dependencies:
   ```bash
   yarn install
   ```
4. Start the project:
   ```bash
   npx expo start
   ```

## Key Files

- `src/screens/rolling-cube.tsx`: Main screen managing the 3D state and gestures.
- `src/shaders/rollingCube.ts`: Custom Skia Shaders for the Raymarching engine.
- `src/hooks/useCubeImages.ts`: Hook for loading and managing the cube's face images.
