/**
 * Platform-specific AnimatedText. Metro resolves to:
 * - animated-text.ios.tsx on iOS
 * - animated-text.android.tsx on Android
 * - animated-text.tsx (web/fallback)
 * @see https://docs.expo.dev/router/advanced/platform-specific-modules/
 */
export { default } from "./animated-text";
export type { AnimatedTextProps } from "../../../types";
