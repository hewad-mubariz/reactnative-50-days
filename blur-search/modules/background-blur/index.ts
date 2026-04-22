// Reexport the native module. On web, it will be resolved to BackgroundBlurModule.web.ts
// and on native platforms to BackgroundBlurModule.ts
export { default } from "./src/BackgroundBlurModule";
export { default as BackgroundBlurView } from "./src/BackgroundBlurView";
export * from "./src/BackgroundBlur.types";
