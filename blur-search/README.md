# Blur Search

A gesture-driven app search concept featuring a pull-to-reveal blur layer, a morphing search pill, and a glassmorphism "Recently Searched" panel built with React Native Reanimated and a custom native blur view.

## Features

- **Pull-to-Reveal Search State**: Vertical drag transitions the screen between a clean app grid and an active search mode.
- **Native Animated Blur Overlay**: A custom `BackgroundBlurView` module animates blur radius and tint opacity in sync with gesture progress.
- **Morphing Search Pill**: Search control expands from a compact pill into an input-ready field and tracks keyboard movement.
- **Tap-to-Close Interaction Model**: Gesture race combines pan and tap interactions for smooth open/close behavior.
- **Glassmorphism Recent Actions**: "Recently Searched" card fades/slides in with animated icon buttons and layered gradients.

## How it Works

1. **Gesture Pipeline**: A `Pan` gesture updates shared values (`pullDown`, `searchProgress`, `contentTranslateY`) with clamped drag distance.
2. **Blur Mapping**: `useAnimatedProps` maps pull distance to native blur `radius` and `tintOpacity` values.
3. **Layout Response**: Grid scales/translates and the recent-search panel interpolates opacity and Y offset as progress changes.
4. **Keyboard-Aware Search Box**: `useReanimatedKeyboardAnimation` keeps the search pill positioned above the keyboard while preserving spring/timing transitions.

## Tech Stack

- **React Native** (0.83.4)
- **Expo** (55.0.15)
- **React Native Reanimated** (4.2.1)
- **React Native Gesture Handler** (2.30.0)
- **React Native Keyboard Controller** (1.20.7)
- **Expo Linear Gradient**
- **Lucide React Native** (icons)
- **TypeScript**
- **Custom Expo Module** (`modules/background-blur`)

## Installation

1. Clone the repository.
2. Navigate to the project directory:
   ```bash
   cd blur-search
   ```
3. Install dependencies:
   ```bash
   yarn install
   ```
4. Start the app:
   ```bash
   npx expo start
   ```

## Key Files

- `src/screens/SearchScreen.tsx`: Core screen with gesture orchestration, blur animation, and staged UI transitions.
- `src/components/SearchBox.tsx`: Morphing search pill, keyboard-aware positioning, and input interactions.
- `src/components/AppIcon.tsx`: Gradient app tile mock component used in the main icon wall.
- `src/components/RecentIconButton.tsx`: Animated icon buttons inside the recent-search glass card.
- `modules/background-blur/src/BackgroundBlurView.tsx`: Native view bridge used for animated blur rendering.
- `src/constants/search.ts`: Shared motion thresholds, dimensions, and spring configuration.
