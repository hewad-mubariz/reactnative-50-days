import Slider from "@react-native-community/slider";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { DENSITY_MAX, DENSITY_MIN } from "./constants";
import { THEMES, THEME_PICKER_COLORS, THEME_TRACK_COLORS } from "./themes";

type ControlPanelProps = {
  themeIdx: number;
  onThemeChange: (idx: number) => void;
  density: number;
  onDensityChange: (v: number) => void;
};

export const ControlPanel = ({
  themeIdx,
  onThemeChange,
  density,
  onDensityChange,
}: ControlPanelProps) => {
  const fraction = Math.max(
    0,
    Math.min(1, (density - DENSITY_MIN) / (DENSITY_MAX - DENSITY_MIN)),
  );
  const percent = Math.round(fraction * 100);

  return (
    <View style={styles.panel}>
      <Text style={styles.title}>CRYSTAL THEME</Text>
      <View style={styles.themesRow}>
        {THEMES.map((_, idx) => {
          const isActive = themeIdx === idx;
          return (
            <Pressable
              key={idx}
              onPress={() => onThemeChange(idx)}
              style={[
                styles.themeButton,
                { backgroundColor: THEME_PICKER_COLORS[idx] },
                isActive && styles.themeButtonActive,
              ]}
            />
          );
        })}
      </View>
      <View style={styles.densityRow}>
        <Text style={styles.densityLabel}>Density</Text>
        <Text style={styles.densityValue}>{percent}%</Text>
      </View>
      <Slider
        style={styles.slider}
        minimumValue={DENSITY_MIN}
        maximumValue={DENSITY_MAX}
        value={density}
        onValueChange={onDensityChange}
        minimumTrackTintColor={THEME_TRACK_COLORS[themeIdx]}
        maximumTrackTintColor="rgba(255, 255, 255, 0.12)"
        thumbTintColor="#ffffff"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  panel: {
    position: "absolute",
    bottom: 60,
    left: 28,
    right: 28,
    backgroundColor: "rgba(18, 16, 32, 0.62)",
    borderColor: "rgba(255, 255, 255, 0.14)",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 22,
    paddingTop: 16,
    paddingBottom: 18,
  },
  title: {
    color: "rgba(255, 255, 255, 0.72)",
    fontSize: 11,
    letterSpacing: 2.4,
    fontWeight: "700",
    marginBottom: 14,
  },
  themesRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 18,
  },
  themeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: "transparent",
  },
  themeButtonActive: {
    borderColor: "rgba(255, 255, 255, 0.95)",
  },
  densityRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  densityLabel: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 13,
    fontWeight: "300",
  },
  densityValue: {
    color: "rgba(255, 255, 255, 0.95)",
    fontSize: 13,
    fontWeight: "600",
  },
  slider: {
    width: "100%",
    height: 36,
  },
});
