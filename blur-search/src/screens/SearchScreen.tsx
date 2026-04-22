import { AppIcon } from "@/components/AppIcon";
import { RecentIconButton } from "@/components/RecentIconButton";
import SearchBox from "@/components/SearchBox";
import { ICON_ROWS, RECENT_ITEMS } from "@/constants/data";
import {
  MAX_BLUR_RADIUS,
  MAX_PULL,
  OPEN_THRESHOLD,
  springConfig,
} from "@/constants/search";
import { useCallback, useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { KeyboardController } from "react-native-keyboard-controller";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { scheduleOnRN } from "react-native-worklets";
import { BackgroundBlurView } from "../../modules/background-blur";

const AnimatedBackgroundBlurView =
  Animated.createAnimatedComponent(BackgroundBlurView);

export const SearchScreen = () => {
  const insets = useSafeAreaInsets();
  const pullDown = useSharedValue(0);
  const pullStart = useSharedValue(0);
  const searchProgress = useSharedValue(0);
  const contentTranslateY = useSharedValue(0);
  const panGesture = useMemo(
    () =>
      Gesture.Pan()
        .onBegin(() => {
          pullStart.value = pullDown.value;
        })
        .onUpdate((event) => {
          const nextValue = pullStart.value + event.translationY * 0.45;
          const clamped = Math.max(0, Math.min(nextValue, MAX_PULL));
          pullDown.value = clamped;
          contentTranslateY.value = clamped;
          if (clamped === MAX_PULL) {
            searchProgress.value = withSpring(1, {
              ...springConfig,
            });
          } else {
            searchProgress.value = withSpring(0, {
              ...springConfig,
            });
          }
        })
        .onEnd(() => {
          const target = pullDown.value >= OPEN_THRESHOLD ? MAX_PULL : 0;
          pullDown.value = withTiming(target, {
            duration: 300,
          });
          searchProgress.value = withSpring(target === MAX_PULL ? 1 : 0, {
            ...springConfig,
          });
          contentTranslateY.value = withSpring(0, {
            ...springConfig,
          });
        }),
    [pullDown, pullStart, searchProgress],
  );
  const handleTapEnd = useCallback(async () => {
    KeyboardController.dismiss();
  }, []);

  const tapToCloseGesture = useMemo(
    () =>
      Gesture.Tap().onEnd((_event, success) => {
        if (!success) return;
        if (pullDown.value <= 0) return;

        pullDown.value = withSpring(0, {
          ...springConfig,
        });
        searchProgress.value = withSpring(0, {
          ...springConfig,
        });
        scheduleOnRN(handleTapEnd);
      }),
    [pullDown, searchProgress],
  );
  const recentAreaTapGesture = useMemo(
    () =>
      Gesture.Tap()
        .onEnd(() => {})
        .blocksExternalGesture(tapToCloseGesture),
    [tapToCloseGesture],
  );

  const gridAnimatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      contentTranslateY.value,
      [0, MAX_PULL],
      [1, 0.95],
    );
    return {
      transform: [{ translateY: contentTranslateY.value }, { scale }],
    };
  });

  const blurAnimatedProps = useAnimatedProps(() => ({
    radius: interpolate(
      pullDown.value,
      [0, MAX_PULL],
      [0, MAX_BLUR_RADIUS],
      Extrapolation.CLAMP,
    ),
    tintOpacity: interpolate(
      pullDown.value,
      [0, MAX_PULL],
      [0, 0.2],
      Extrapolation.CLAMP,
    ),
  }));
  const recentSectionAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      searchProgress.value,
      [0, 0.25, 1],
      [0, 0.45, 1],
      Extrapolation.CLAMP,
    ),
    transform: [
      {
        translateY: interpolate(searchProgress.value, [0, 1], [-20, 0]),
      },
    ],
  }));

  const screenGesture = useMemo(
    () => Gesture.Race(panGesture, tapToCloseGesture),
    [panGesture, tapToCloseGesture],
  );
  const handleSearchTap = useCallback(() => {
    const target = pullDown.value > OPEN_THRESHOLD ? 0 : MAX_PULL;
    searchProgress.value = withSpring(target === MAX_PULL ? 1 : 0, {
      ...springConfig,
    });
    pullDown.value = withSpring(target, {
      ...springConfig,
    });
  }, [pullDown, searchProgress]);

  return (
    <GestureDetector gesture={screenGesture}>
      <View style={styles.screen}>
        <View pointerEvents="none" style={styles.backgroundBase} />
        <Animated.View
          style={[
            styles.content,
            { paddingTop: insets.top + 30 },
            gridAnimatedStyle,
          ]}
        >
          <View style={styles.headerWrap}>
            <Text style={styles.headerTitle}>Apps</Text>
            <Text style={styles.headerSubtitle}>
              A clean icon wall, ready for social icons next.
            </Text>
          </View>

          <View style={styles.gridWrap}>
            {ICON_ROWS.map((row, rowIndex) => (
              <View key={`row-${rowIndex}`} style={styles.row}>
                {row.map((item, itemIndex) => (
                  <AppIcon key={`mock-${rowIndex}-${itemIndex}`} item={item} />
                ))}
              </View>
            ))}
          </View>
        </Animated.View>

        <AnimatedBackgroundBlurView
          style={styles.blurOverlay}
          tintColor="#454443"
          animatedProps={blurAnimatedProps}
        >
          <GestureDetector gesture={recentAreaTapGesture}>
            <Animated.View
              style={[
                styles.recentSection,
                { top: insets.top + 30 },
                recentSectionAnimatedStyle,
              ]}
            >
              <Text style={styles.recentTitle}>Recently Searched</Text>
              <View style={styles.recentGlassCard}>
                <View style={styles.recentRow}>
                  {RECENT_ITEMS.map((item, index) => (
                    <RecentIconButton key={`recent-${index}`} item={item} />
                  ))}
                </View>
              </View>
            </Animated.View>
          </GestureDetector>
        </AnimatedBackgroundBlurView>

        <SearchBox
          searchProgress={searchProgress}
          handleSearchTap={handleSearchTap}
        />
      </View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#11131A",
  },

  backgroundBase: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "#1A1D28",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    gap: 18,
  },
  headerWrap: {
    gap: 5,
  },
  headerTitle: {
    color: "#F8FAFF",
    fontSize: 34,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  headerSubtitle: {
    color: "rgba(208, 218, 235, 0.72)",
    fontSize: 14,
    fontWeight: "500",
  },
  gridWrap: {
    gap: 18,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  blurOverlay: {
    ...StyleSheet.absoluteFill,
  },
  recentSection: {
    position: "absolute",
    left: 20,
    right: 20,
    gap: 10,
  },
  recentTitle: {
    color: "rgba(245, 248, 255, 0.96)",
    fontSize: 22,
    fontWeight: "700",
  },
  recentGlassCard: {
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "rgba(255,255,255,0.14)",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255,255,255,0.32)",
    shadowColor: "#000000",
    shadowOpacity: 0.22,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 7 },
  },
  recentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
