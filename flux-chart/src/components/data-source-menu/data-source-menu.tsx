import React from "react";
import { StyleSheet, Text } from "react-native";
import type {
  DataSourceMenuProps,
  DataSourceOption,
} from "./data-source-menu.types";

export type { DataSourceMenuProps, DataSourceOption };

/**
 * Default/fallback (web). Metro uses .ios.tsx on iOS and .android.tsx on Android.
 * @see https://docs.expo.dev/router/advanced/platform-specific-modules/
 */
export default function DataSourceMenu({
  value,
  style,
}: DataSourceMenuProps) {
  return <Text style={[styles.triggerLabel, style]}>{value}</Text>;
}

const styles = StyleSheet.create({
  triggerLabel: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
  },
});
