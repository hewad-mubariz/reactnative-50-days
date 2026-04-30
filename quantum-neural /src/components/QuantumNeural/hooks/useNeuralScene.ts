import { useCallback, useMemo, useRef, useState } from "react";

import { useWebGPU } from "@/hooks/useWebGPU";

import { DENSITY_DEFAULT } from "../constants";
import { createSceneCallback } from "../scene/sceneCallback";
import type { Interaction, PulseTrigger, ThemeUpdater } from "../types";

const initialInteraction: Interaction = {
  autoY: 0,
  userY: 0,
  userX: 0.2,
  velY: 0,
  velX: 0,
  startUserY: 0,
  startUserX: 0.2,
  isDragging: false,
  lastT: 0,
  scale: DENSITY_DEFAULT,
};

/**
 * Wires the WebGPU scene + the imperative refs that the gesture/UI layers
 * use to talk to it (theme updates, tap pulses) and exposes a slim API.
 */
export const useNeuralScene = () => {
  const interactionRef = useRef<Interaction>({ ...initialInteraction });
  const themeUpdaterRef = useRef<ThemeUpdater | null>(null);
  const pulseTriggerRef = useRef<PulseTrigger | null>(null);

  const [density, setDensity] = useState(DENSITY_DEFAULT);
  const [themeIdx, setThemeIdx] = useState(0);

  const setDensityValue = useCallback((v: number) => {
    setDensity(v);
    interactionRef.current.scale = v;
  }, []);

  const setThemeIndex = useCallback((idx: number) => {
    setThemeIdx(idx);
    themeUpdaterRef.current?.(idx);
  }, []);

  // Refs are stable, so building the scene callback once is safe.
  const scene = useMemo(
    () =>
      createSceneCallback({ interactionRef, themeUpdaterRef, pulseTriggerRef }),
    [],
  );

  const canvasRef = useWebGPU(scene);

  return {
    canvasRef,
    interactionRef,
    pulseTriggerRef,
    density,
    setDensity: setDensityValue,
    themeIdx,
    setTheme: setThemeIndex,
  };
};
