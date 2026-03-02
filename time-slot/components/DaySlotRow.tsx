import { TimeSlotRow } from "@/components/TimeSlotRow";
import * as Haptics from "expo-haptics";
import { Plus } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Switch, Text, View } from "react-native";
import Animated, {
  interpolateColor,
  LinearTransition,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
type Props = {
  label: string;
  value: boolean;
  onToggle: () => void;
};

type TimeSlot = {
  id: string;
  startHour: number;
  endHour: number;
};

const DAY_START = 7;
const DAY_END = 19;
const SLOT_DURATION = 1;

const LAYOUT_SPRING = LinearTransition.springify()
  .stiffness(970)
  .damping(70)
  .mass(4)
  .energyThreshold(6e-9)
  .reduceMotion(ReduceMotion.System);

export function DaySlotRow({ label, value, onToggle }: Props) {
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const progress = useSharedValue(0);
  useEffect(() => {
    progress.value = withTiming(value ? 1 : 0, { duration: 180 });
  }, [value]);
  useEffect(() => {
    if (value) {
      if (slots.length === 0) {
        setSlots([
          {
            id: "slot-7-8",
            startHour: DAY_START,
            endHour: DAY_START + SLOT_DURATION,
          },
        ]);
      }
    } else if (slots.length) {
      setSlots([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const formatHour = (hour: number) => {
    const suffix = hour >= 12 ? "PM" : "AM";
    const hour12 = ((hour + 11) % 12) + 1;
    return `${hour12}:00 ${suffix}`;
  };
  const daySlotRowAnimatedStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      progress.value,
      [0, 1],
      ["#f7f7fb", "#ffffff"],
    );
    const borderColor = interpolateColor(
      progress.value,
      [0, 1],
      ["#f4f4f6", "#efeff1"],
    );

    return {
      backgroundColor: color,
    };
  });
  const containerBorderAnimatedStyle = useAnimatedStyle(() => {
    const borderColor = interpolateColor(
      progress.value,
      [0, 1],
      ["#f4f4f6", "#efeff1"],
    );
    return {
      borderColor: borderColor,
      borderWidth: 1,
      borderRadius: 18,
    };
  });
  const expandedContentAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(value ? 1 : 0, { duration: 180 }),
    };
  });

  const handleAddMore = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const usedStarts = new Set(slots.map((s) => s.startHour));
    for (let h = DAY_START; h < DAY_END; h += SLOT_DURATION) {
      if (!usedStarts.has(h) && h + SLOT_DURATION <= DAY_END) {
        setSlots((prev) => [
          ...prev,
          {
            id: `slot-${h}-${h + SLOT_DURATION}`,
            startHour: h,
            endHour: h + SLOT_DURATION,
          },
        ]);
        return;
      }
    }
  };

  const handleRemoveSlot = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSlots((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <View style={[styles.container, value && styles.containerActive]}>
      <Animated.View
        style={[styles.row, daySlotRowAnimatedStyle]}
        layout={LAYOUT_SPRING}
      >
        <Text style={styles.dayLabel}>{label}</Text>
        <Switch
          value={value}
          onValueChange={onToggle}
          trackColor={{ false: "#e5e7eb", true: "#4ade80" }}
          thumbColor="#ffffff"
        />
      </Animated.View>
      {value && (
        <Animated.View style={styles.expandedContent}>
          {slots.map((slot, index) => (
            <TimeSlotRow
              key={slot.id}
              id={slot.id}
              startHour={slot.startHour}
              endHour={slot.endHour}
              onRemove={handleRemoveSlot}
              formatHour={formatHour}
              animate={index > 0}
            />
          ))}

          <Pressable style={styles.addMoreButton} onPress={handleAddMore}>
            <Plus size={16} color="#4b5563" />
            <Text style={styles.addMoreText}>Add More</Text>
          </Pressable>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 18,
  },
  containerActive: {
    borderWidth: 1,
    borderColor: "#ebebf2",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 18,
    // backgroundColor: "#f7f7fb",
  },
  expandedContent: {
    marginTop: 8,
    borderRadius: 18,
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  timeRange: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexShrink: 1,
  },
  timeLabel: {
    fontSize: 13,
    color: "#6b7280",
  },
  timeBox: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: "#ffffff",
  },
  timeBoxText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#111827",
  },
  closeChip: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f3f4f6",
  },
  closeChipText: {
    fontSize: 18,
    lineHeight: 18,
    color: "#9ca3af",
  },
  addMoreButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 4,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#f3f4ff",
  },
  addMoreContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  addMoreText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#4b5563",
  },
  dayLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111827",
  },
});
