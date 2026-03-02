import { X } from "lucide-react-native";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown, ReduceMotion } from "react-native-reanimated";

type Props = {
  id: string;
  startHour: number;
  endHour: number;
  onRemove: (id: string) => void;
  formatHour: (hour: number) => string;
  animate?: boolean;
};
const enteringSpring = FadeInDown.springify()
  .stiffness(900)
  .damping(75)
  .mass(4)
  .energyThreshold(6e-9)
  .reduceMotion(ReduceMotion.System);
export function TimeSlotRow({
  id,
  startHour,
  endHour,
  onRemove,
  formatHour,
  animate = true,
}: Props) {
  return (
    <Animated.View
      entering={animate ? enteringSpring : undefined}
      style={styles.timeRow}
    >
      <View style={styles.timeRange}>
        <Text style={styles.timeLabel}>From</Text>
        <View style={styles.timeBox}>
          <Text style={styles.timeBoxText}>{formatHour(startHour)}</Text>
        </View>
        <Text style={styles.timeLabel}>To</Text>
        <View style={styles.timeBox}>
          <Text style={styles.timeBoxText}>{formatHour(endHour)}</Text>
        </View>
      </View>

      <Pressable
        hitSlop={8}
        onPress={() => onRemove(id)}
        style={styles.closeChip}
      >
        <X size={16} color="#9ca3af" />
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
    gap: 12,
  },
  timeRange: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexShrink: 1,
  },
  timeLabel: {
    fontSize: 18,
    fontWeight: "500",
    color: "#6b7280",
  },
  timeBox: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#eee7e7",
    alignItems: "center",
    justifyContent: "center",
  },
  timeBoxText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111827",
  },
  closeChip: {
    width: 28,
    height: 28,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f3f4f6",
  },
  closeChipText: {
    fontSize: 18,
    lineHeight: 18,
    color: "#9ca3af",
  },
});
