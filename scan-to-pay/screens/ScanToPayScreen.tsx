import * as Haptics from "expo-haptics";
import { QrCode, X } from "lucide-react-native";
import React, { useState } from "react";
import {
  LayoutChangeEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  interpolate,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const SPRING_CONFIG = { stiffness: 200, damping: 20, mass: 1 };
const AnimatedIcon = Animated.createAnimatedComponent(QrCode);

const GAP = 20;
const QR_SIZE_COLLAPSED = 32;
const QR_SIZE_EXPANDED = 144;
const CONTAINER_WIDTH = { collapsed: 240, expanded: 300 };
const CONTAINER_HEIGHT = { collapsed: 80, expanded: 320 };
const SEPARATOR_WIDTH = 200;

export default function MorphingQrButton() {
  const [isExpanded, setIsExpanded] = useState(false);
  const progress = useSharedValue(0);

  const iconWidth = useSharedValue(0);
  const textWidth = useSharedValue(0);

  const onIconLayout = (e: LayoutChangeEvent) => {
    iconWidth.value = e.nativeEvent.layout.width;
  };
  const onTextLayout = (e: LayoutChangeEvent) => {
    textWidth.value = e.nativeEvent.layout.width;
  };

  const expand = () => {
    setIsExpanded(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    progress.value = withSpring(1, SPRING_CONFIG);
  };
  const collapse = () => {
    setIsExpanded(false);
    Haptics.selectionAsync();
    progress.value = withSpring(0, SPRING_CONFIG);
  };

  // 1. Container: Morphing background
  const containerStyle = useAnimatedStyle(() => ({
    width: interpolate(progress.value, [0, 1], [240, 300]),
    height: interpolate(progress.value, [0, 1], [80, 320]),
    borderRadius: interpolate(progress.value, [0, 1], [40, 24]),
    backgroundColor: "#e5e7eb",
    justifyContent: "center",
    alignItems: "center",
  }));

  // 2. Dynamic QR: move with translate, grow with width/height (no scale)
  const qrStyle = useAnimatedStyle(() => {
    const startX = -(textWidth.value / 2 + GAP / 2);
    return {
      position: "absolute",
      justifyContent: "center",
      alignItems: "center",
      transform: [
        { translateX: interpolate(progress.value, [0, 1], [startX, 0]) },
        { translateY: interpolate(progress.value, [0, 1], [0, 60]) },
      ],
    };
  });

  const animatedIconProps = useAnimatedProps(() => ({
    width: interpolate(
      progress.value,
      [0, 1],
      [QR_SIZE_COLLAPSED, QR_SIZE_EXPANDED],
    ),
    height: interpolate(
      progress.value,
      [0, 1],
      [QR_SIZE_COLLAPSED, QR_SIZE_EXPANDED],
    ),
  }));

  // 3. Vertical separator: just after QR code (icon right edge + half gap), not mid
  const separatorStyle = useAnimatedStyle(() => {
    const iconRight = -(textWidth.value / 2 + GAP / 2) + iconWidth.value / 2;
    const afterIcon = iconRight + GAP / 2;
    return {
      opacity: interpolate(progress.value, [0, 0.15], [1, 0]),
      transform: [
        {
          translateX: interpolate(progress.value, [0, 1], [afterIcon, 0]),
        },
      ],
    };
  });

  // 4. Horizontal separator: position from container width/height (same as containerStyle)
  const horizontalSeparatorStyle = useAnimatedStyle(() => {
    const w = interpolate(
      progress.value,
      [0, 1],
      [CONTAINER_WIDTH.collapsed, CONTAINER_WIDTH.expanded],
    );
    const h = interpolate(
      progress.value,
      [0, 1],
      [CONTAINER_HEIGHT.collapsed, CONTAINER_HEIGHT.expanded],
    );
    return {
      opacity: interpolate(progress.value, [0.5, 1], [0, 1]),
      width: Math.min(SEPARATOR_WIDTH, w * 0.85),
      transform: [
        { translateX: -Math.min(SEPARATOR_WIDTH, w * 0.85) / 2 },
        {
          translateY: interpolate(
            progress.value,
            [0, 1],
            [0, -(h * 0.22)],
          ),
        },
      ],
    };
  });

  // 5. Dynamic Text Movement
  const textStyle = useAnimatedStyle(() => {
    const startX = iconWidth.value / 2 + GAP / 2;
    return {
      position: "absolute",
      transform: [
        { translateX: interpolate(progress.value, [0, 1], [startX, 0]) },
        { translateY: interpolate(progress.value, [0, 1], [0, -90]) },
        { scale: interpolate(progress.value, [0, 1], [1, 1.1]) },
      ],
    };
  });

  return (
    <View style={styles.screen}>
      <Animated.View style={containerStyle}>
        <Pressable
          onPress={isExpanded ? undefined : expand}
          style={styles.fullTouch}
        >
          <Animated.View onLayout={onIconLayout} style={qrStyle}>
            <AnimatedIcon color="#0f172a" animatedProps={animatedIconProps} />
          </Animated.View>

          <Animated.View style={[styles.separator, separatorStyle]} />

          <Animated.View
            style={[styles.horizontalSeparator, horizontalSeparatorStyle]}
          />

          <Animated.View onLayout={onTextLayout} style={textStyle}>
            <Text style={styles.buttonText}>Scan to pay</Text>
          </Animated.View>
        </Pressable>
      </Animated.View>

      <Animated.View
        style={useAnimatedStyle(() => ({
          opacity: progress.value,
          transform: [
            { translateY: interpolate(progress.value, [0, 1], [20, 0]) },
          ],
        }))}
      >
        <Pressable style={styles.closeButton} onPress={collapse}>
          <X size={24} color="#0f172a" />
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  fullTouch: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: { fontSize: 20, fontWeight: "600", color: "#0f172a" },
  separator: {
    position: "absolute",
    left: "50%",
    top: "50%",
    marginLeft: -0.75,
    marginTop: -16,
    width: 1.5,
    height: 32,
    backgroundColor: "#9ca3af",
  },
  horizontalSeparator: {
    position: "absolute",
    left: "50%",
    top: "50%",
    height: 2,
    backgroundColor: "#d1d5db",
  },
  closeButton: {
    marginTop: 30,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
  },
});
