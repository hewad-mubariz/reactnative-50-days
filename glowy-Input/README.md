# Glowy Input

A high-end, interactive chat input component featuring a dynamic radiating aura and traveling border effects.

## Features

- **Skia-Powered Glow**: Utilizes `SweepGradient` and `BlurMask` to create a pulsing "aura" effect around the input.
- **Traveling Border**: A fast-rotating gradient border that highlights the input when active.
- **Keyboard Integration**: Seamlessly integrated with `react-native-keyboard-controller` for smooth, high-performance layout transitions.
- **Morphing Footer**: Action icons (Plus, Search, Mic) smoothly swap for a "Send" button as the user starts typing.
- **Dynamic Rotation**: Dual-layered rotation (fast for the border, slow for the aura) creates a sophisticated, organic feel.

## How it Works

1. **Dual Rotation**: Two shared values (`rotation` and `rotationSlow`) drive the gradients at different speeds using `withTiming` with linear easing.
2. **Keyboard Progress**: The `keyboardProgress` value from `react-native-keyboard-controller` drives the opacity and stroke width of the glow effects.
3. **Canvas Layering**: A Skia `Canvas` is positioned behind the input, using `RoundedRect` with `SweepGradient` to render the complex visual effects.
4. **Layout Detection**: Uses `onLayout` to dynamically calculate the input's dimensions, ensuring the glow perfectly wraps the container.

## Tech Stack

- **React Native** (0.81.5)
- **Expo** (54.0.33)
- **React Native Skia** (SweepGradient, BlurMask, RoundedRect)
- **React Native Reanimated** (Shared values, Derived values, Timing animations)
- **Keyboard Controller** (react-native-keyboard-controller)
- **Lucide React Native** (Icons)
- **TypeScript**

## Installation

1. Clone the repository.
2. Navigate to the directory:
   ```bash
   cd glowy-Input
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

- `src/components/GlowyInput.tsx`: Core component containing the Skia logic and keyboard animations.
- `src/screens/ChatScreen.tsx`: Implementation of the input within a chat interface.
