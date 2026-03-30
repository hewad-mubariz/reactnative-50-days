# Flux Chart

A high-performance, interactive data visualization component built with React Native Skia and Reanimated, featuring smooth path interpolation and real-time cursor tracking.

## Features

- **Smooth Path Interpolation**: Uses `usePathInterpolation` to transition seamlessly between different time ranges (1M, 3M, 1Y) and data sources.
- **Interactive Cursor**: Custom-built cursor that tracks the user's touch, providing real-time data point inspection.
- **Haptic Feedback**: Integrated with `expo-haptics` for tactile selection feedback as the cursor moves across data points.
- **Animated Text**: Real-time value updates using a custom `AnimatedText` component for smooth numerical transitions.
- **Glass-morphism Gradient**: Features a beautiful linear gradient fill with transparency for a modern, clean aesthetic.
- **Dynamic Data Sources**: Support for multiple data sources (e.g., Revenue, Users) with automatic unit and period label updates.

## How it Works

1. **Path Generation**: Data points are converted into Skia paths (line and fill) using custom utility functions.
2. **Interpolation**: The `transition` shared value drives the `usePathInterpolation` hook, allowing the chart to "morph" between different data sets.
3. **Gesture Handling**: A `Pan` gesture calculates the relative X position on the chart to find the nearest data point and update the cursor position.
4. **UI/JS Thread Optimization**: While cursor updates currently run on the JS thread for state management, the path rendering and animations are handled by Skia and Reanimated for maximum performance.

## Tech Stack

- **React Native** (0.81.5)
- **Expo** (54.0.33)
- **React Native Skia** (Path, LinearGradient, usePathInterpolation)
- **React Native Reanimated** (Shared values, withTiming, useAnimatedStyle)
- **Gesture Handler** (react-native-gesture-handler)
- **Lucide React Native** (Icons)
- **TypeScript**

## Installation

1. Clone the repository.
2. Navigate to the directory:
   ```bash
   cd flux-chart
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

- `src/screens/ChartScreen.tsx`: Main screen managing the chart state and gestures.
- `src/constants/chart.ts`: Chart dimensions and path generation logic.
- `src/utils/path.ts`: Utilities for building chart points and paths.
- `src/components/cursor/cursor.tsx`: Interactive cursor component.
