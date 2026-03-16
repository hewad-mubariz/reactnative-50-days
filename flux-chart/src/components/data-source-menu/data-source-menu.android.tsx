import { Host as ComposeHost, Picker } from "@expo/ui/jetpack-compose";
import React from "react";
import { StyleSheet } from "react-native";
import {
  DATA_SOURCE_OPTIONS,
  type DataSourceMenuProps,
  type DataSourceOption,
} from "./data-source-menu.types";

export type { DataSourceMenuProps, DataSourceOption };

/**
 * Data source menu on Android: Jetpack Compose Picker (segmented).
 * ContextMenu from @expo/ui currently warns "Unsupported child type in Menu: [Function Items]"
 * when Items has multiple Button children (library doesn't flatten Items.props.children).
 * Picked by Metro via .android.tsx.
 */
export default function DataSourceMenu({
  value,
  onChange,
}: DataSourceMenuProps) {
  const selectedIndex = DATA_SOURCE_OPTIONS.indexOf(value);

  return (
    <ComposeHost style={styles.host} matchContents>
      <Picker
        options={DATA_SOURCE_OPTIONS}
        selectedIndex={selectedIndex >= 0 ? selectedIndex : 0}
        onOptionSelected={({ nativeEvent: { index } }) => {
          const option = DATA_SOURCE_OPTIONS[index];
          if (option != null) onChange(option);
        }}
        variant="segmented"
      />
    </ComposeHost>
  );
}

const styles = StyleSheet.create({
  host: {
    minHeight: 44,
  },
});
