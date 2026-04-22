import { registerWebModule, NativeModule } from "expo";

import { ChangeEventPayload } from "./BackgroundBlur.types";

type BackgroundBlurModuleEvents = {
  onChange: (params: ChangeEventPayload) => void;
};

class BackgroundBlurModule extends NativeModule<BackgroundBlurModuleEvents> {
  PI = Math.PI;
  async setValueAsync(value: string): Promise<void> {
    this.emit("onChange", { value });
  }
  hello() {
    return "Hello world!";
  }
}

export default registerWebModule(BackgroundBlurModule, "BackgroundBlurModule");
