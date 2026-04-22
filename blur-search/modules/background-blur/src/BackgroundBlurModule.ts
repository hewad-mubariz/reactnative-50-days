import { NativeModule, requireNativeModule } from "expo";

import { BackgroundBlurModuleEvents } from "./BackgroundBlur.types";

declare class BackgroundBlurModule extends NativeModule<BackgroundBlurModuleEvents> {}

export default requireNativeModule<BackgroundBlurModule>("BackgroundBlur");
