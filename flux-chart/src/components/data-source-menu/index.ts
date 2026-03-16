/**
 * Platform-specific DataSourceMenu. Metro resolves to:
 * - data-source-menu.ios.tsx on iOS
 * - data-source-menu.android.tsx on Android
 * - data-source-menu.tsx (web/fallback)
 * @see https://docs.expo.dev/router/advanced/platform-specific-modules/
 */
export { default } from "./data-source-menu";
export type { DataSourceMenuProps, DataSourceOption } from "./data-source-menu.types";
