import { Host, Text } from "@expo/ui/jetpack-compose";
import {
  animateContentSize,
  graphicsLayer,
} from "@expo/ui/jetpack-compose/modifiers";
import React from "react";
import { StyleSheet } from "react-native";
import { AnimatedTextProps } from "../../../types";

function formatValue(value: number): string {
  return value.toLocaleString("en-US");
}

const fontWeights = {
  normal: "normal" as const,
  bold: "bold" as const,
  "600": "bold" as const, // Compose weight mapping
  "700": "bold" as const,
};

export default function AnimatedText({
  value,
  fontSize = 52,
  fontWeight = "700",
  style,
}: AnimatedTextProps) {
  const displayText = formatValue(value);

  return (
    <Host style={[styles.host, style]}>
      <Text
        style={{ fontSize, fontWeight, textAlign: "center" }}
        color="#000000"
        modifiers={[
          animateContentSize(0.6, 300),
          graphicsLayer({
            scaleX: 1.0,
            scaleY: 1.0,
            alpha: 1.0,
          }),
        ]}
      >
        {displayText}
      </Text>
    </Host>
  );
}

const styles = StyleSheet.create({
  host: {
    minHeight: 90,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});
