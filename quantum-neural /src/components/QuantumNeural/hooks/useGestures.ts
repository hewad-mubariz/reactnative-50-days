import { useMemo, type MutableRefObject, type RefObject } from "react";
import { Gesture } from "react-native-gesture-handler";

import {
  MOMENTUM_VEL_MAX,
  MOMENTUM_VEL_SENS,
  TILT_LIMIT,
} from "../constants";
import type { Interaction, PulseTrigger } from "../types";

const PAN_SENSITIVITY = 0.006;
const TAP_MAX_DURATION_MS = 250;
const TAP_MAX_DISTANCE_PX = 10;

const clamp = (v: number, lo: number, hi: number) =>
  Math.max(lo, Math.min(hi, v));

type GestureRefs = {
  interactionRef: MutableRefObject<Interaction>;
  pulseTriggerRef: MutableRefObject<PulseTrigger | null>;
  layoutRef: RefObject<{ width: number; height: number }>;
};

/**
 * Composes the pan + tap gestures used by the canvas.
 *
 * Race semantics: tap wins for short stationary touches, pan takes over once
 * the touch starts moving so quick taps still trigger pulses while drags rotate.
 */
export const useGestures = ({
  interactionRef,
  pulseTriggerRef,
  layoutRef,
}: GestureRefs) =>
  useMemo(() => {
    const pan = Gesture.Pan()
      .runOnJS(true)
      .onBegin(() => {
        const s = interactionRef.current;
        s.isDragging = true;
        s.startUserY = s.userY;
        s.startUserX = s.userX;
        s.velY = 0;
        s.velX = 0;
      })
      .onUpdate((e) => {
        const s = interactionRef.current;
        s.userY = s.startUserY + e.translationX * PAN_SENSITIVITY;
        const nextX = s.startUserX + e.translationY * PAN_SENSITIVITY;
        s.userX = clamp(nextX, -TILT_LIMIT, TILT_LIMIT);
      })
      .onEnd((e) => {
        const s = interactionRef.current;
        s.isDragging = false;
        s.velY = clamp(
          e.velocityX * MOMENTUM_VEL_SENS,
          -MOMENTUM_VEL_MAX,
          MOMENTUM_VEL_MAX,
        );
        s.velX = clamp(
          e.velocityY * MOMENTUM_VEL_SENS,
          -MOMENTUM_VEL_MAX,
          MOMENTUM_VEL_MAX,
        );
      })
      .onFinalize(() => {
        interactionRef.current.isDragging = false;
      });

    const tap = Gesture.Tap()
      .runOnJS(true)
      .maxDuration(TAP_MAX_DURATION_MS)
      .maxDistance(TAP_MAX_DISTANCE_PX)
      .onEnd((e, success) => {
        if (!success) return;
        const layout = layoutRef.current;
        if (!layout) return;
        const { width, height } = layout;
        if (width <= 0 || height <= 0) return;
        const nx = e.x / width;
        const ny = e.y / height;
        if (nx < 0 || nx > 1 || ny < 0 || ny > 1) return;
        pulseTriggerRef.current?.(nx, ny);
      });

    return Gesture.Race(tap, pan);
    // Refs are stable, so a single composition is enough for the lifetime
    // of the component.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
