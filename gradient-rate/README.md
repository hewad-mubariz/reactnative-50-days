# Gradient Rating Bar

A visually striking feedback component built with React Native Skia and Reanimated, featuring a glowing gradient bar and interactive star selection.

## Features

- **Skia-Powered Graphics**: Custom-drawn rating bar with linear gradients, inner shadows, and blur masks for a high-end visual feel.
- **Interactive Gestures**: Smooth star selection using `react-native-gesture-handler` with spring-based animations.
- **Dynamic Feedback**: Integrated with `@gorhom/bottom-sheet` to reveal additional feedback options after rating.
- **Haptic Feedback**: Tactile response on star selection using `expo-haptics`.
- **Glass-morphism Effect**: Sophisticated use of shadows and masks to create a modern, glowing UI.

## How it Works

1. **Skia Rendering**: The rating bar is composed of a background `RoundedRect`, a masked `LinearGradient` for the fill, and multiple `Shadow` and `BlurMask` layers for the glow effect.
2. **Gesture Handling**: A `Tap` gesture calculates the relative X position on the bar to determine the selected star index.
3. **State Management**: The rating is stored as a shared value, driving the `fillWidth` of the gradient bar and the scale of individual stars.
4. **Bottom Sheet Integration**: Upon rating, the bottom sheet expands to show contextual feedback chips and a text input.

## Tech Stack

- **React Native** (0.81.5)
- **Expo** (54.0.33)
- **React Native Skia** (Gradients, Shadows, Masks)
- **React Native Reanimated** (Shared values, Spring animations)
- **Bottom Sheet** (@gorhom/bottom-sheet)
- **Lucide React Native** (Icons)
- **TypeScript**

## Installation

1. Clone the repository.
2. Navigate to the directory:
   ```bash
   cd gradient-rate
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

- `src/screens/RatingScreen.tsx`: Main screen with Bottom Sheet and feedback logic.
- `src/components/SkiaRating.tsx`: Core Skia-based rating bar component.
- `src/components/Star.tsx`: Animated individual star component.
