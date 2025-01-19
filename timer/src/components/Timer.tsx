import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, View, Text, ViewStyle, TextStyle } from "react-native";
import { Digit } from "./Digit";

export const formatTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return {
    hours: [Math.floor(hours / 10), hours % 10],
    minutes: [Math.floor(minutes / 10), minutes % 10],
    seconds: [Math.floor(secs / 10), secs % 10],
  };
};

interface TimerProps {
  initialSeconds: number;
  resetOnEnd?: boolean;
  digitStyle?: TextStyle | TextStyle[];
  msIndicatorStyle?: TextStyle | TextStyle[];
  showIndicators?: boolean;
  style?: ViewStyle | ViewStyle[];
  onUpdate?: (remainingTime: number, totalTime: number) => void;
  hidden?: boolean;
}

export const Timer: React.FC<TimerProps> = ({
  initialSeconds,
  resetOnEnd = false,
  style,
  digitStyle,
  msIndicatorStyle,
  showIndicators = true,
  onUpdate,
}) => {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const startTimeRef = useRef(Date.now());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    startTimeRef.current = Date.now();

    const updateTimer = () => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      const remainingTime = initialSeconds - elapsed;

      if (remainingTime <= 0) {
        clearInterval(intervalRef.current as NodeJS.Timeout);
        setTimeLeft(0);
        if (onUpdate) onUpdate(0, initialSeconds);
      } else {
        setTimeLeft(remainingTime);
        if (onUpdate) onUpdate(remainingTime, initialSeconds);
      }
    };

    intervalRef.current = setInterval(updateTimer, 100); // Use a smaller interval for better accuracy

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [initialSeconds, resetOnEnd, onUpdate]);

  const time = formatTime(timeLeft);

  return (
    <View style={[styles.timeContainer, style]}>
      <View style={styles.digitGroup}>
        {initialSeconds >= 3600 && (
          <>
            {time.hours.map((digit, index) => (
              <Digit style={digitStyle} key={`hour-${index}`} value={digit} />
            ))}
            {showIndicators && (
              <Text style={[styles.timeSeparator, msIndicatorStyle]}>h</Text>
            )}
          </>
        )}
        <View style={styles.space} />

        {initialSeconds >= 60 && (
          <>
            {time.minutes.map((digit, index) => (
              <Digit style={digitStyle} key={`minute-${index}`} value={digit} />
            ))}
            {showIndicators && (
              <Text style={[styles.timeSeparator, msIndicatorStyle]}>m</Text>
            )}
          </>
        )}
      </View>
      <View style={styles.space} />

      <View style={styles.digitGroup}>
        {time.seconds.map((digit, index) => (
          <Digit style={digitStyle} key={`second-${index}`} value={digit} />
        ))}
        {showIndicators && (
          <Text style={[styles.timeSeparator, msIndicatorStyle]}>s</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  digitGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
  timeSeparator: {
    fontSize: 35,
    lineHeight: 45,
    color: "white",
    fontFamily: "Anton",
  },
  space: {
    width: 10,
  },
});

export default Timer;
