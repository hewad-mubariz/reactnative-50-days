import AnimatedText from "@/components/animated-text/animated-text";
import { Cursor } from "@/components/cursor";
import DataSourceMenu, {
  type DataSourceOption,
} from "@/components/data-source-menu";
import { RangeType } from "@/components/data-source-menu/data-source-menu.types";
import { Pills } from "@/components/Pills";
import { CHART_HEIGHT, CHART_WIDTH, getPaths } from "@/constants/chart";
import { CHART_DATA_BY_SOURCE } from "@/data/chartData";
import { lightImpact, selection } from "@/utils/haptics";
import { buildChartPoints } from "@/utils/path";
import {
  Canvas,
  LinearGradient,
  Path,
  usePathInterpolation,
  vec,
} from "@shopify/react-native-skia";
import { ArrowUp } from "lucide-react-native";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { StyleSheet, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { CursorPoint } from "../../types";

const AnimatedArrowUpIcon = Animated.createAnimatedComponent(ArrowUp);

export const ChartScreen = () => {
  const [selected, setSelected] = useState<RangeType>("1M");
  const [cursor, setCursor] = useState<CursorPoint | null>(null);
  const [dataSource, setDataSource] = useState<DataSourceOption>("Revenue");

  const transition = useSharedValue(0);
  const lastHapticIndexRef = useRef<number | null>(null);

  const source = CHART_DATA_BY_SOURCE[dataSource];

  const rangeDataSets = useMemo(
    () => source.chartDataSets,
    [source.chartDataSets],
  );

  const paths = useMemo(() => {
    return {
      "1M": getPaths(rangeDataSets["1M"]),
      "3M": getPaths(rangeDataSets["3M"]),
      "1Y": getPaths(rangeDataSets["1Y"]),
    };
  }, [rangeDataSets]);

  const data = useMemo(
    () => rangeDataSets[selected],
    [rangeDataSets, selected],
  );

  const points = useMemo(() => buildChartPoints(data), [data]);

  const animatedLine = usePathInterpolation(
    transition,
    [0, 1, 2],
    [paths["1M"].line, paths["3M"].line, paths["1Y"].line],
  );

  const animatedFill = usePathInterpolation(
    transition,
    [0, 1, 2],
    [paths["1M"].fill, paths["3M"].fill, paths["1Y"].fill],
  );
  // FIXME: Update on JS thread causes frame drops during rapid gestures.
  // Consider refactoring to Shared Values (UI thread) to keep 60 FPS.
  const updateCursor = useCallback(
    (x: number) => {
      if (!points.length) return;

      const clampedX = Math.max(0, Math.min(CHART_WIDTH, x));
      const rawIndex = Math.round(
        (clampedX / CHART_WIDTH) * (points.length - 1),
      );
      const safeIndex = Math.max(0, Math.min(points.length - 1, rawIndex));

      const point = points[safeIndex];

      if (lastHapticIndexRef.current !== safeIndex) {
        lastHapticIndexRef.current = safeIndex;
        selection();
      }

      setCursor(point);
    },
    [points],
  );

  const clearCursor = useCallback(() => {
    lastHapticIndexRef.current = null;
    setCursor(null);
  }, []);

  const onDragStart = useCallback(() => {
    lastHapticIndexRef.current = null;
    lightImpact();
  }, []);

  const onDragEnd = useCallback(() => {
    selection();
    clearCursor();
  }, [clearCursor]);

  const panGesture = useMemo(
    () =>
      Gesture.Pan()
        .onStart(() => {
          onDragStart();
        })
        .onUpdate((e) => {
          updateCursor(e.x);
        })
        .onEnd(() => {
          onDragEnd();
        })
        .onFinalize(() => {
          clearCursor();
        })
        .runOnJS(true),
    [updateCursor, clearCursor, onDragStart, onDragEnd],
  );

  const handlePress = useCallback(
    (key: RangeType, index: number) => {
      setSelected(key);
      setCursor(null);
      transition.value = withTiming(index, { duration: 200 });
    },
    [transition, setSelected, setCursor],
  );

  const handleChangeDataSource = useCallback(
    (nextSource: DataSourceOption) => {
      setDataSource(nextSource);
      setSelected("1M");
      setCursor(null);
      transition.value = 0;
      transition.value = withTiming(1, { duration: 200 });
    },
    [transition],
  );

  const meta = source.rangeMetadata[selected];

  const displayValue = cursor
    ? Math.round(meta.totalValue * (cursor.value / 100))
    : meta.totalValue;

  const { isPositive, percentValue } = useMemo(
    () => ({
      isPositive: meta.percentChange >= 0,
      percentValue: Math.abs(meta.percentChange),
    }),
    [meta.percentChange],
  );

  const iconRotation = useSharedValue(isPositive ? 0 : 180);

  useEffect(() => {
    iconRotation.value = withTiming(isPositive ? 0 : 180, {
      duration: 150,
    });
  }, [iconRotation, isPositive]);

  const animatedIconRotation = useAnimatedStyle(() => ({
    transform: [{ rotate: `${iconRotation.value}deg` }],
  }));

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <DataSourceMenu value={dataSource} onChange={handleChangeDataSource} />
      </View>

      <AnimatedText value={displayValue} fontSize={52} fontWeight="700" />

      <View style={styles.header}>
        <View style={styles.subtitleRow}>
          <AnimatedArrowUpIcon
            style={animatedIconRotation}
            size={18}
            color={isPositive ? "#32C5FF" : "#E53935"}
            strokeWidth={2.5}
          />
          <Text
            style={[styles.subtitle, !isPositive && styles.subtitleNegative]}
          >
            {percentValue}%{" "}
          </Text>
          <Text style={styles.periodLabel}>{meta.periodLabel}</Text>
        </View>
      </View>

      <View style={styles.chartWrapper}>
        <GestureDetector gesture={panGesture}>
          <View style={{ width: CHART_WIDTH, height: CHART_HEIGHT }}>
            <Canvas style={{ flex: 1 }}>
              <Path path={animatedFill}>
                <LinearGradient
                  start={vec(0, 0)}
                  end={vec(0, CHART_HEIGHT)}
                  colors={["rgba(50, 197, 255, 0.4)", "rgba(50, 197, 255, 0)"]}
                />
              </Path>

              <Path
                path={animatedLine}
                style="stroke"
                strokeWidth={4}
                color="#32C5FF"
              />

              {cursor ? <Cursor cursor={cursor} /> : null}
            </Canvas>
          </View>
        </GestureDetector>
      </View>

      <Pills
        selected={selected}
        handlePress={(item, index) => handlePress(item as RangeType, index)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    alignItems: "center",
    paddingTop: 80,
  },
  topBar: {
    alignSelf: "stretch",
    width: "100%",
    marginBottom: 8,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  chartWrapper: {
    position: "relative",
  },
  tooltipText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "700",
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  valueContainer: {
    minHeight: 56,
    width: "100%",
    alignSelf: "stretch",
    justifyContent: "center",
  },
  title: {
    fontSize: 16,
    color: "#666",
    fontWeight: "600",
  },
  value: {
    fontSize: 52,
    fontWeight: "700",
    color: "#000",
    letterSpacing: -1,
  },
  subtitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  subtitle: {
    fontSize: 17,
    color: "#32C5FF",
    fontWeight: "600",
  },
  subtitleNegative: {
    color: "#E53935",
  },
  periodLabel: {
    fontSize: 17,
    color: "#999",
    fontWeight: "600",
  },
});
