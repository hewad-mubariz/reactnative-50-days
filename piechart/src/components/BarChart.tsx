import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { G, Text as SvgText } from "react-native-svg";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  runOnJS,
} from "react-native-reanimated";
import { BarChartSegment } from "./PieChartSegment";
import { SCREEN_WIDTH } from "../constants/window";
import { CalendarDays } from "lucide-react-native";
import { generatePieChartSegment } from "../utils/pieChart";

const days = [
  { day: "Sunday", value: 11740 },
  { day: "Monday", value: 8300 },
  { day: "Tuesday", value: 5400 },
  { day: "Wednesday", value: 9000 },
  { day: "Thursday", value: 7000 },
  { day: "Friday", value: 5000 },
  { day: "Saturday", value: 6000 },
];

// Utility function to format numbers with thousands separator
const formatNumber = (number: number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const AnimatedSvgText = Animated.createAnimatedComponent(SvgText);

export const PieChart = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const opacity = useSharedValue(1);

  const selectedSegmentAnimatedIndex = useSharedValue(0);

  const handleOnPress = (index: number) => {
    opacity.value = withTiming(0, { duration: 150 }, () => {
      runOnJS(setSelectedIndex)(index);
      opacity.value = withTiming(1);
    });
    selectedSegmentAnimatedIndex.value = index;
  };

  const animatedTextStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.headerContainer}>
          <View style={styles.header}>
            <CalendarDays color={"#dd6c85"} />
            <Text style={styles.title}>Averages</Text>
          </View>
          <Text style={{ color: "#dd6c85" }}>Last 28 days</Text>
        </View>
        <Svg width={SCREEN_WIDTH} height={SCREEN_WIDTH}>
          <G x={SCREEN_WIDTH / 2} y={SCREEN_WIDTH / 2}>
            {generatePieChartSegment(days).map((segmentData, index) => {
              return (
                <BarChartSegment
                  onPress={() => handleOnPress(index)}
                  key={index}
                  index={index}
                  segment={segmentData}
                  selectedSegmentAnimatedIndex={selectedSegmentAnimatedIndex}
                />
              );
            })}
            <AnimatedSvgText
              x={0}
              y={-10}
              textAnchor="middle"
              fontSize={24}
              fontWeight="bold"
              fill="#333"
              animatedProps={animatedTextStyle}
            >
              {days[selectedIndex].day}
            </AnimatedSvgText>
            <AnimatedSvgText
              x={0}
              y={20}
              textAnchor="middle"
              fontSize={18}
              fill="#666"
              animatedProps={animatedTextStyle}
            >
              {formatNumber(days[selectedIndex].value)}
            </AnimatedSvgText>
          </G>
        </Svg>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  content: {
    justifyContent: "center",
    alignItems: "center",
    width: SCREEN_WIDTH * 0.9,
    backgroundColor: "#efeef6",
    borderRadius: 10,
  },
  headerContainer: {
    width: "100%",
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#dd6c85",
  },
});
