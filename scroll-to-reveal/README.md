# Scroll to Reveal (Expandable Button)

A sleek React Native component that features a sticky floating action button which expands and transforms as the user scrolls to the end of the content. Perfect for "Review & Pay" or "Accept Terms" flows.

## Features

- **Dynamic Transformation**: Button morphs from a collapsed "Review" state to an expanded "Pay" state.
- **Scroll Detection**: Automatically triggers expansion when the user reaches the bottom of the scroll view.
- **Smooth Animations**: Powered by `react-native-reanimated` for 60fps performance.
- **Interactive Trigger**: Users can tap the collapsed button to automatically scroll to the end.
- **Haptic-ready Logic**: Built-in state management for easy haptic feedback integration.

## How it Works

The component monitors the scroll position of an `Animated.ScrollView`. When the `contentOffset` plus the `layoutMeasurement` reaches the `contentSize` (within a threshold), the button:
1. Expands its width from a fixed size to a percentage-based width.
2. Changes its background color.
3. Morphs its border radius.
4. Swaps the internal content (icon and text) with a spring-based entry animation.

## Tech Stack

- **React Native** (0.81.5)
- **Expo** (54.0.33)
- **React Native Reanimated** (Shared values, Interpolation, Spring/Timing animations)
- **Lucide/Ionicons** (Vector icons)
- **TypeScript**

## Preview

| Collapsed (Scroll to End) | Expanded (At Bottom) |
| ------------------------- | -------------------- |
| ![Collapsed State](https://via.placeholder.com/200x400?text=Collapsed+Button) | ![Expanded State](https://via.placeholder.com/200x400?text=Expanded+Button) |

*(Note: Replace placeholders with actual screenshots if available)*

## Installation

1. Clone the repository.
2. Navigate to the directory:
   ```bash
   cd scroll-to-reveal
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

- `screens/OrderScreen.tsx`: Main logic for scroll handling and button animation.
- `components/OrderForm.tsx`: The UI content being scrolled.
- `utils/order.ts`: Helper functions for scroll detection logic.
- `constants/colors.ts`: Theme and button color definitions.
