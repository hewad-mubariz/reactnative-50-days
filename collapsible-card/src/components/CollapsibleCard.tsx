import React, { useState } from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  useAnimatedProps,
  LinearTransition,
  FadeIn,
  FadeOut,
} from "react-native-reanimated";
import {
  Bell,
  ChevronDown,
  MessageCircle,
  Star,
  Calendar,
  Tag,
  CheckCircle,
} from "lucide-react-native";
import { ActionItem, Action } from "./ActionItem";
import { LinearGradient } from "expo-linear-gradient";

const AnimatedBellIcon = Animated.createAnimatedComponent(Bell);
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedChevronDown = Animated.createAnimatedComponent(ChevronDown);
const ALinearGradient = Animated.createAnimatedComponent(LinearGradient);
const SPACING = 12;

const actions: Action[] = [
  {
    Icon: MessageCircle,
    title: "New Message!",
    subtitle: "Sarah sent a message.",
    time: "Just Now",
  },
  {
    Icon: Star,
    title: "Level Up!",
    subtitle: "New achievement unlocked.",
    time: "2 min ago",
  },
  {
    Icon: Calendar,
    title: "Reminder: Meeting",
    subtitle: "Your Meeting starts in 30 min.",
    time: "3 hours ago",
  },
  {
    Icon: Tag,
    title: "Special Offer!",
    subtitle: "Save 20% on upgrade.",
    time: "12 hours ago",
  },
  {
    Icon: CheckCircle,
    title: "Task Assigned!",
    subtitle: "New task awaiting action.",
    time: "Yesterday",
  },
];

export const CollapsibleCard = () => {
  const [expanded, setExpanded] = useState(false);
  const progress = useSharedValue(0);

  const iconAnimatedStyle = useAnimatedStyle(() => {
    const degree = interpolate(progress.value, [0, 1], [0, 180]);
    return {
      transform: [{ rotateX: `${degree}deg` }],
    };
  });

  const cardAnimatedStyle = useAnimatedStyle(() => {
    const borderBottomWidth = interpolate(progress.value, [0, 1], [0, 1]);
    const paddingBottom = interpolate(progress.value, [0, 1], [0, SPACING]);
    return {
      borderBottomWidth,
      borderBottomColor: "#f1f1f1",
      paddingBottom,
    };
  });

  const animatedBellIconStyle = useAnimatedStyle(() => {
    const size = interpolate(progress.value, [0, 1], [60, 40]);
    const borderRadius = interpolate(progress.value, [0, 1], [12, 8]);
    return {
      width: size,
      height: size,
      borderRadius,
    };
  });

  const animatedBellIconProps = useAnimatedProps(() => {
    const size = interpolate(progress.value, [0, 1], [36, 26]);
    return {
      width: size,
      height: size,
    };
  }, [progress.value]);

  const toggleExpand = () => {
    progress.value = withTiming(progress.value ? 0 : 1);
    setExpanded(!expanded);
  };

  return (
    <Animated.View
      style={styles.container}
      layout={LinearTransition.springify()
        .damping(expanded ? 15 : 16)
        .stiffness(100)
        .restSpeedThreshold(2)
        .restDisplacementThreshold(0.01)}
    >
      <AnimatedPressable
        onPress={toggleExpand}
        style={[styles.card, cardAnimatedStyle]}
      >
        <View style={styles.cardContent}>
          <ALinearGradient
            colors={["#f5f5f5", "#e9eaf1"]}
            style={[styles.mainIcon, animatedBellIconStyle]}
          >
            <AnimatedBellIcon
              animatedProps={animatedBellIconProps}
              fill={"white"}
              strokeWidth={1.2}
              color={"#d2d1db"}
            />
          </ALinearGradient>
          <View style={styles.textContainer}>
            <Text style={styles.title}>5 New Activities</Text>
            {!expanded && (
              <Text style={styles.subTitle}>What's happening around you</Text>
            )}
          </View>
        </View>
        <View style={styles.chevronContainer}>
          <AnimatedChevronDown style={[iconAnimatedStyle]} color={"white"} />
        </View>
      </AnimatedPressable>

      {expanded && (
        <Animated.View
          entering={FadeIn}
          exiting={FadeOut}
          style={styles.expandedContent}
        >
          {actions.map((action, index) => (
            <ActionItem key={index} {...action} />
          ))}
        </Animated.View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    borderColor: "#eaeaea",
    borderWidth: 1,
    backgroundColor: "#fff",
    paddingVertical: SPACING,
    borderRadius: SPACING,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: SPACING,
    paddingHorizontal: SPACING,
  },
  mainIcon: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    backgroundColor: "#eeeff6",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0.5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 1.4,
    elevation: 5,
  },
  textContainer: {
    gap: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  subTitle: {
    color: "#9f9fa1",
  },
  chevronContainer: {
    backgroundColor: "#9998a3",
    borderRadius: 20,
    right: 20,
  },
  expandedContent: {
    paddingHorizontal: SPACING,
    paddingTop: SPACING,
    gap: 16,
  },
});
