import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useCallback, useRef, useState } from "react";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  FadeInDown,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { OrderForm } from "@/components/OrderForm";
import { buttonColors, colors } from "@/constants/colors";
import {
  isScrollAtEnd,
  SCROLL_END_THRESHOLD,
  springConfig,
} from "@/utils/order";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function OrderScreen() {
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<Animated.ScrollView>(null);
  const wasAtEnd = useRef(false);
  const [isAtEnd, setIsAtEnd] = useState(false);

  const endReached = useSharedValue(0);
  const borderRadius = useSharedValue(50);
  const primaryButtonWidth = useSharedValue(50);

  const scrollHandler = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { contentOffset, contentSize, layoutMeasurement } =
        event.nativeEvent;
      const atEnd = isScrollAtEnd(
        contentOffset.y,
        contentSize.height,
        layoutMeasurement.height,
        SCROLL_END_THRESHOLD,
      );

      if (atEnd && !wasAtEnd.current) {
        wasAtEnd.current = true;
        primaryButtonWidth.value = withSpring(90, springConfig);
        borderRadius.value = withTiming(14);
        endReached.value = withTiming(1);
        setIsAtEnd(true);
      }
      if (!atEnd) {
        wasAtEnd.current = false;
        primaryButtonWidth.value = withSpring(50, springConfig);
        borderRadius.value = withTiming(50);
        endReached.value = withTiming(0);
        setIsAtEnd(false);
      }
    },
    [],
  );

  const primaryButtonAnimatedStyle = useAnimatedStyle(() => ({
    width: `${primaryButtonWidth.value}%`,
    borderRadius: borderRadius.value,
    backgroundColor: interpolateColor(
      endReached.value,
      [0, 1],
      [buttonColors.collapsed, buttonColors.expanded],
    ),
  }));

  return (
    <View style={[styles.safe, { paddingTop: insets.top }]}>
      <Animated.ScrollView
        ref={scrollViewRef}
        style={styles.scroll}
        onScroll={scrollHandler}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        bounces={false}
        overScrollMode="never"
      >
        <OrderForm />
      </Animated.ScrollView>

      <View style={styles.stickyFooter}>
        <AnimatedPressable
          style={[styles.primaryButton, primaryButtonAnimatedStyle]}
          onPress={() => {
            if (!isAtEnd) {
              scrollViewRef.current?.scrollToEnd({ animated: true });
            }
          }}
        >
          {isAtEnd ? (
            <Animated.View
              entering={FadeInDown.springify()
                .damping(springConfig.damping)
                .stiffness(springConfig.stiffness)}
              style={styles.primaryButtonContent}
            >
              <View style={styles.primaryButtonIconWrap}>
                <Ionicons name="card" size={18} color="#fff" />
              </View>
              <View style={styles.primaryButtonTextWrap}>
                <Text style={styles.primaryButtonLabel}>Pay</Text>
                <Text style={styles.primaryButtonAmount}> $16.88</Text>
              </View>
            </Animated.View>
          ) : (
            <View style={styles.primaryButtonContent}>
              <Text style={styles.primaryButtonText}>Review</Text>
              <Ionicons name="arrow-down" size={24} color="white" />
            </View>
          )}
        </AnimatedPressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: "center",
    justifyContent: "center",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 190,
  },
  stickyFooter: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 56,
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    width: "90%",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    fontSize: 19,
    fontWeight: "700",
    color: "#fff",
  },
  primaryButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  primaryButtonIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.22)",
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonTextWrap: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  primaryButtonLabel: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 0.4,
  },
  primaryButtonAmount: {
    fontSize: 18,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: 0.2,
  },
});
