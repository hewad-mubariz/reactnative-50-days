# Quantum Neural

A GPU-driven neural constellation experience built with Expo, React Native WebGPU, and custom WGSL shaders. The scene combines a layered starfield, dynamic node-link geometry, tap-triggered pulse waves, and an interactive control panel for theme and density tuning.

## Features

- **WebGPU Neural Scene**: Custom render pipelines for nodes, links, stars, and bloom post-processing.
- **Tap Pulse Interaction**: Quick taps inject pulse waves into the network, creating reactive highlights across nodes and edges.
- **Drag + Momentum Camera Feel**: Pan gestures tilt and orbit the scene with velocity-based momentum decay.
- **Live Density Control**: Slider adjusts network scale/density in real time without rebuilding the screen.
- **Theme Switching**: One-tap palette switching updates shader colors across the full scene.

## How it Works

1. **Scene Bootstrapping**: `useNeuralScene` connects the `Canvas` to a WebGPU scene callback and exposes imperative refs for interaction.
2. **Gesture Composition**: `useGestures` races tap and pan gestures so short taps trigger pulses while drags control orientation.
3. **GPU Rendering Flow**: Scene callbacks feed uniforms and buffers into dedicated pipelines (nodes, lines, stars, bloom).
4. **UI-to-Shader Sync**: Control panel updates (theme index, density) are propagated through refs to the running renderer.

## Tech Stack

- **React Native** (0.81.4)
- **Expo** (54)
- **React Native WebGPU** (`react-native-wgpu`)
- **WGSL Shaders** (custom shader modules)
- **React Native Gesture Handler**
- **React Native Reanimated**
- **@react-native-community/slider**
- **TypeScript**

## Installation

1. Clone the repository.
2. Navigate to the project directory:
   ```bash
   cd "quantum-neural "
   ```
3. Install dependencies:
   ```bash
   yarn install
   ```
4. Run a native build (required for WebGPU):
   ```bash
   npx expo run:ios
   ```
   or
   ```bash
   npx expo run:android
   ```

## Key Files

- `src/components/QuantumNeural/QuantumNeural.tsx`: Main screen composition for the canvas, gestures, and control panel.
- `src/components/QuantumNeural/hooks/useNeuralScene.ts`: Bridges UI state/refs with the WebGPU scene lifecycle.
- `src/components/QuantumNeural/hooks/useGestures.ts`: Tap/pan gesture race logic for pulses and scene motion.
- `src/components/QuantumNeural/scene/sceneCallback.ts`: Central renderer callback wiring scene updates and draw passes.
- `src/components/QuantumNeural/constants.ts`: Shared numeric tuning for geometry, pulse behavior, and bloom.
- `src/components/QuantumNeural/ControlPanel.tsx`: Theme picker and density slider UI.
