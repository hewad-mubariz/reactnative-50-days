import {
  Host,
  HStack,
  Image,
  Menu,
  Text as NativeText,
  Toggle,
} from "@expo/ui/swift-ui";
import {
  bold,
  font,
  foregroundStyle,
  frame,
} from "@expo/ui/swift-ui/modifiers";
import React from "react";
import { StyleSheet } from "react-native";
import {
  DATA_SOURCE_OPTIONS,
  type DataSourceMenuProps,
  type DataSourceOption,
} from "./data-source-menu.types";

export type { DataSourceMenuProps, DataSourceOption };

/** Data source menu on iOS: SwiftUI Menu + Toggle. Picked by Metro via .ios.tsx. */
export default function DataSourceMenu({
  value,
  onChange,
}: DataSourceMenuProps) {
  return (
    <Host style={styles.menuHost}>
      <Menu
        label={
          <HStack
            spacing={10}
            alignment="center"
            modifiers={[frame({ minWidth: 150 })]}
          >
            <NativeText
              modifiers={[
                foregroundStyle("#000000"),
                font({ size: 18, weight: "bold" }),
              ]}
            >
              {value}
            </NativeText>
            <Image
              systemName="chevron.up.chevron.down"
              size={16}
              color="#8E8E93"
            />
          </HStack>
        }
        modifiers={[foregroundStyle("#000000"), bold()]}
      >
        {DATA_SOURCE_OPTIONS.map((option) => (
          <Toggle
            key={option}
            label={option}
            isOn={value === option}
            onIsOnChange={(isOn) => isOn && onChange(option)}
          />
        ))}
      </Menu>
    </Host>
  );
}

const styles = StyleSheet.create({
  menuHost: {
    height: 44,
    width: 160,
    minWidth: 160,
  },
});
