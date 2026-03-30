import React, { useRef, useState } from "react";
import {
  Pressable,
  StyleSheet,
  View,
  useWindowDimensions,
  type GestureResponderEvent,
} from "react-native";
import { BurstButton } from "../components/BurstButton";
import { BurstSignal, FireworkField } from "../components/FireworkField";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#05070f" },
});

export const Fireworks: React.FC = () => {
  const { width, height } = useWindowDimensions();
  const [burst, setBurst] = useState<BurstSignal>({
    x: 0,
    y: 0,
    power: 1,
    tick: 0,
  });
  const lastTouchRef = useRef({ x: -999, y: -999 });

  const fireAt = (x: number, y: number, power: number) => {
    setBurst((prev) => ({ x, y, power, tick: prev.tick + 1 }));
  };

  const onTouchStart = (e: GestureResponderEvent) => {
    const { locationX, locationY } = e.nativeEvent;
    lastTouchRef.current = { x: locationX, y: locationY };
    fireAt(locationX, locationY, 1.35);
  };

  const onTouchMove = (e: GestureResponderEvent) => {
    const { locationX, locationY } = e.nativeEvent;
    const dx = locationX - lastTouchRef.current.x;
    const dy = locationY - lastTouchRef.current.y;
    if (dx * dx + dy * dy > 26 * 26) {
      lastTouchRef.current = { x: locationX, y: locationY };
      fireAt(locationX, locationY, 0.9);
    }
  };

  return (
    <View style={styles.container}>
      <Pressable
        style={{ flex: 1 }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
      >
        <FireworkField burst={burst} />
      </Pressable>
      <BurstButton onTrigger={() => fireAt(width / 2, height / 2, 1.8)} />
    </View>
  );
};
