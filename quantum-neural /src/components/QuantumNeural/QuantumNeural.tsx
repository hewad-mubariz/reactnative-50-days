import React, { useRef } from "react";
import { StyleSheet, View } from "react-native";
import { GestureDetector } from "react-native-gesture-handler";
import { Canvas } from "react-native-wgpu";

import { ControlPanel } from "./ControlPanel";
import { useGestures } from "./hooks/useGestures";
import { useNeuralScene } from "./hooks/useNeuralScene";

export const QuantumNeural = () => {
  const layoutRef = useRef({ width: 1, height: 1 });
  const {
    canvasRef,
    interactionRef,
    pulseTriggerRef,
    density,
    setDensity,
    themeIdx,
    setTheme,
  } = useNeuralScene();

  const composedGesture = useGestures({
    interactionRef,
    pulseTriggerRef,
    layoutRef,
  });

  return (
    <View style={styles.root}>
      <GestureDetector gesture={composedGesture}>
        <View
          style={styles.canvasWrap}
          onLayout={(e) => {
            const { width, height } = e.nativeEvent.layout;
            layoutRef.current = { width, height };
          }}
        >
          <Canvas ref={canvasRef} style={styles.canvas} />
        </View>
      </GestureDetector>
      <ControlPanel
        themeIdx={themeIdx}
        onThemeChange={setTheme}
        density={density}
        onDensityChange={setDensity}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#000" },
  canvasWrap: { flex: 1 },
  canvas: { flex: 1 },
});
