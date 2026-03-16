import { Host, Text } from "@expo/ui/swift-ui";
import {
  Animation,
  animation,
  contentTransition,
  font,
  foregroundStyle,
  frame,
} from "@expo/ui/swift-ui/modifiers";
import React from "react";
import { StyleSheet } from "react-native";
import { AnimatedTextProps } from "../../../types";

function formatValue(value: number): string {
  return value.toLocaleString("en-US");
}

const fontWeights = {
  normal: "regular" as const,
  bold: "bold" as const,
  "600": "semibold" as const,
  "700": "bold" as const,
};

/** Rolling numeric text on iOS: SwiftUI contentTransition + animation. Picked by Metro via .ios.tsx. */
export default function AnimatedText({
  value,
  fontSize = 52,
  fontWeight = "700",
  style,
}: AnimatedTextProps) {
  const displayText = formatValue(value);
  const weight = fontWeights[fontWeight] ?? "bold";

  return (
    <Host style={[styles.host, style]}>
      <Text
        modifiers={[
          foregroundStyle("#000000"),
          font({ size: fontSize, weight, design: "monospaced" }),
          contentTransition("numericText"),
          animation(
            Animation.spring({ response: 0.4, dampingFraction: 0.6 }),
            value,
          ),
          frame({ maxWidth: 400, alignment: "center" }),
        ]}
      >
        {displayText}
      </Text>
    </Host>
  );
}

const styles = StyleSheet.create({
  host: {
    minHeight: 56,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});
