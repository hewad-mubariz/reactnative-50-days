import ExpoModulesCore

public class BackgroundBlurModule: Module {
  public func definition() -> ModuleDefinition {
    Name("BackgroundBlur")

    View(BackgroundBlurView.self) {
      Prop("radius") { (view: BackgroundBlurView, value: Double) in
        view.setRadius(value)
      }

      Prop("tintColor") { (view: BackgroundBlurView, value: String?) in
        view.setTintColor(value)
      }

      Prop("tintOpacity") { (view: BackgroundBlurView, value: Double) in
        view.setTintOpacity(value)
      }
    }
  }
}
