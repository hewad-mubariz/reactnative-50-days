import React, { useEffect } from "react";
import { View, StyleSheet, Pressable, Text } from "react-native";
import Svg, { Path, Defs, LinearGradient, Stop } from "react-native-svg";
import Animated, {
  Easing,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

const AnimatedPath = Animated.createAnimatedComponent(Path);

const runningBorderPath = (width: number, height: number, radius: number) => {
  const offset = 1.2;

  return `
    M ${radius + offset}, ${offset}
    L ${width - radius - offset}, ${offset}
    Q ${width - offset}, ${offset} ${width - offset}, ${radius + offset}
    L ${width - offset}, ${height - radius - offset}
    Q ${width - offset}, ${height - offset} ${width - radius - offset}, ${
    height - offset
  }
    L ${radius + offset}, ${height - offset}
    Q ${offset}, ${height - offset} ${offset}, ${height - radius - offset}
    L ${offset}, ${radius + offset}
    Q ${offset}, ${offset} ${radius + offset}, ${offset}
  `;
};

interface ButtonProps {
  width?: number;
  height?: number;
  radius?: number;
  color?: string;
  loading?: boolean;
  onPress: () => void;
}

const ButtonGradient: React.FC<ButtonProps> = ({
  width = 160,
  height = 50,
  radius = 10,
  color = "#F6F6F6",
  loading = false,
  onPress,
}) => {
  const runningBorderData = runningBorderPath(width, height, radius);
  const perimeter = 2 * (width + height) - 8 * radius + 2 * Math.PI * radius;

  const segmentLength = 80;
  const gapLength = perimeter - segmentLength;

  const offset = useSharedValue(0);
  const translateX = useSharedValue(0);

  useEffect(() => {
    if (loading) {
      translateX.value = withTiming(-5);
      offset.value = withRepeat(
        withTiming(perimeter, {
          duration: 1500,
          easing: Easing.linear,
        }),
        -1,
        false
      );
    } else {
      offset.value = 0;
      translateX.value = withTiming(0);
    }
  }, [loading]);

  const animatedProps = useAnimatedProps(() => {
    return {
      strokeDashoffset: offset.value,
    };
  });

  const labelAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  return (
    <View style={styles.container}>
      <Pressable
        onPress={onPress}
        style={[
          styles.pressable,
          { backgroundColor: color, width, height, borderRadius: radius },
        ]}
      >
        <Animated.View style={[styles.labelContainer, labelAnimatedStyle]}>
          <Text
            style={[styles.label, { color: loading ? "#A5A5AC" : "#7B7B82" }]}
          >
            {loading ? "Uploading..." : "Upload"}
          </Text>
        </Animated.View>
        {loading && (
          <Svg width={width} height={height}>
            <Defs>
              <LinearGradient id="gradient" x1="0" y1="0" x2="1" y2="0">
                <Stop offset="0%" stopColor="red" />
                <Stop offset="16.6%" stopColor="orange" />
                <Stop offset="33.3%" stopColor="#ff0" />
                <Stop offset="50%" stopColor="green" />
                <Stop offset="66.6%" stopColor="blue" />
                <Stop offset="83.3%" stopColor="purple" />
                <Stop offset="100%" stopColor="red" />
              </LinearGradient>
            </Defs>
            <AnimatedPath
              d={runningBorderData}
              strokeLinecap="round"
              fill="none"
              stroke="url(#gradient)"
              strokeWidth={1.2}
              strokeDasharray={`${segmentLength},${gapLength}`}
              animatedProps={animatedProps}
            />
          </Svg>
        )}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 8,
  },
  pressable: {
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  labelContainer: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    color: "#333333",
    fontSize: 16,
  },
});

export default ButtonGradient;
