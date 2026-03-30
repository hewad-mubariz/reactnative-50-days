import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

const isNative = Platform.OS === "ios" || Platform.OS === "android";

/** Light impact (e.g. drag start on chart). Safe to call on web (no-op). */
export function lightImpact() {
  if (!isNative) return;
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
}

/** Selection feedback (e.g. pill tap, picker change). Safe to call on web (no-op). */
export function selection() {
  if (!isNative) return;
  Haptics.selectionAsync().catch(() => {});
}
