import { DaySlotRow } from "@/components/DaySlotRow";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type DayKey = "monday" | "tuesday" | "wednesday" | "thursday" | "friday";
const borderColor = "#f4f4f6";
type Day = {
  key: DayKey;
  label: string;
};

const DAYS: Day[] = [
  { key: "monday", label: "Monday" },
  { key: "tuesday", label: "Tuesday" },
  { key: "wednesday", label: "Wednesday" },
  { key: "thursday", label: "Thursday" },
  { key: "friday", label: "Friday" },
];

export default function TimeSlotScreen() {
  const [selectedDays, setSelectedDays] = useState<Record<DayKey, boolean>>({
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
  });

  const toggleDay = (key: DayKey) => {
    setSelectedDays((prev) => ({ ...prev, [key]: !prev[key] }));
  };
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.safeArea, { paddingTop: insets.top + 50 }]}>
      <View style={styles.screen}>
        <Text style={styles.title}>Time Slot</Text>
        <Text style={styles.subtitle}>Choose the days you want active.</Text>

        <ScrollView
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        >
          {DAYS.map((day) => (
            <DaySlotRow
              key={day.key}
              label={day.label}
              value={selectedDays[day.key]}
              onToggle={() => toggleDay(day.key)}
            />
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "white",
  },
  screen: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
  },
  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: "#6b7280",
  },
  listContent: {
    paddingVertical: 4,
    gap: 10,
    marginTop: 24,
  },
});
