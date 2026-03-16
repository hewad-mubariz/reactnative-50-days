import React from "react";
import { StyleSheet, Text } from "react-native";
import type { AnimatedTextProps } from "../../../types";

/**
 * Default/fallback AnimatedText (web and any platform without a specific implementation).
 * Uses Reanimated-based RollingDigits. Metro will use .ios.tsx on iOS and .android.tsx on Android.
 */
export default function AnimatedText({
  value,
  fontSize = 52,
  fontWeight = "700",
  style,
}: AnimatedTextProps) {
  return <Text style={[{ fontSize, fontWeight }]}>{value}</Text>;
}

const styles = StyleSheet.create({
  host: {
    minHeight: 56,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});
