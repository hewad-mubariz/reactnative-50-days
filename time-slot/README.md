# Time Slot Picker

An interactive scheduling component that allows users to manage availability with smooth layout transitions and haptic feedback.

## Features

- **Dynamic Slots**: Toggle specific days to reveal or hide time slot management.
- **Add/Remove Logic**: Easily add multiple time slots per day or remove them with a single tap.
- **Smooth Transitions**: Powered by `react-native-reanimated`, using `LinearTransition` for fluid UI updates when slots are added or removed.
- **Haptic Feedback**: Integrated with `expo-haptics` for tactile interaction (Light impact on add, Medium on remove).
- **Responsive Layout**: Automatically adjusts its layout as content expands or collapses.

## How it Works

The component uses a state-driven approach to manage selected days and their respective time slots:
1. **Day Toggling**: Toggling a switch updates the `selectedDays` state and triggers a smooth expansion animation.
2. **Slot Management**: Adding a slot finds the next available hour in the day and inserts it into the `slots` array.
3. **Layout Animations**: `LinearTransition` from Reanimated ensures that other elements on the screen shift smoothly when a day's content expands or a slot is removed.

## Tech Stack

- **React Native** (0.81.5)
- **Expo** (54.0.33)
- **React Native Reanimated** (LinearTransition, Shared values, Timing animations)
- **Lucide React Native** (Icons)
- **Expo Haptics** (Tactile feedback)
- **TypeScript**

## Installation

1. Clone the repository.
2. Navigate to the directory:
   ```bash
   cd time-slot
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

- `screens/TimeSlotScreen.tsx`: Main screen managing the list of days.
- `components/DaySlotRow.tsx`: Logic for toggling days and managing individual time slots.
- `components/TimeSlotRow.tsx`: UI for a single time slot entry.
