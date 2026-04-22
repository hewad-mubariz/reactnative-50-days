package expo.modules.backgroundblur

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class BackgroundBlurModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("BackgroundBlur")

    View(BackgroundBlurView::class) {
      Prop("radius") { view: BackgroundBlurView, value: Double ->
        view.setRadius(value)
      }

      Prop("tintColor") { view: BackgroundBlurView, value: String? ->
        view.setTintColor(value)
      }

      Prop("tintOpacity") { view: BackgroundBlurView, value: Double ->
        view.setTintOpacity(value)
      }
    }
  }
}
