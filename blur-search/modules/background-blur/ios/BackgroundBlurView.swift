import ExpoModulesCore
import UIKit

final class BackgroundBlurView: ExpoView {
  private let blurView = BackgroundBlurUIView(radius: 20)
  private let tintView = UIView()

  private var tintBaseColor: UIColor = .clear
  private var tintOpacity: CGFloat = 1.0

  required init(appContext: AppContext? = nil) {
    super.init(appContext: appContext)
    setup()
  }

  private func setup() {
    backgroundColor = .clear
    clipsToBounds = false

    blurView.isUserInteractionEnabled = false
    blurView.backgroundColor = .clear
    // Keep blur visually behind RN-mounted children regardless of subview order.
    blurView.layer.zPosition = -2

    tintView.isUserInteractionEnabled = false
    tintView.backgroundColor = .clear
    tintView.layer.zPosition = -1

    super.addSubview(blurView)
    super.addSubview(tintView)
  }

  override func layoutSubviews() {
    super.layoutSubviews()
    blurView.frame = bounds
    tintView.frame = bounds
  }

  func setRadius(_ value: Double) {
    blurView.blurRadius = CGFloat(max(value, 0))
  }

  func setTintColor(_ value: String?) {
    tintBaseColor = parseColor(value) ?? .clear
    applyTint()
  }

  func setTintOpacity(_ value: Double) {
    tintOpacity = CGFloat(min(max(value, 0), 1))
    applyTint()
  }

  /// `tintColor` and `tintOpacity` are orthogonal, just like the blur’s radius
  /// and alpha. The color sets what’s painted; the opacity drives whether it
  /// shows up at all. Merged into `tintView.alpha` so animating opacity to 0
  /// fully removes the tint from compositing without touching the base color.
  private func applyTint() {
    tintView.backgroundColor = tintBaseColor
    tintView.alpha = tintOpacity
  }

  private func parseColor(_ value: String?) -> UIColor? {
    guard let value else { return nil }

    let trimmed = value
      .trimmingCharacters(in: .whitespacesAndNewlines)
      .replacingOccurrences(of: "#", with: "")

    var intValue: UInt64 = 0
    guard Scanner(string: trimmed).scanHexInt64(&intValue) else { return nil }

    if trimmed.count == 6 {
      return UIColor(
        red: CGFloat((intValue & 0xFF0000) >> 16) / 255,
        green: CGFloat((intValue & 0x00FF00) >> 8) / 255,
        blue: CGFloat(intValue & 0x0000FF) / 255,
        alpha: 1
      )
    }

    if trimmed.count == 8 {
      return UIColor(
        red: CGFloat((intValue & 0xFF000000) >> 24) / 255,
        green: CGFloat((intValue & 0x00FF0000) >> 16) / 255,
        blue: CGFloat((intValue & 0x0000FF00) >> 8) / 255,
        alpha: CGFloat(intValue & 0x000000FF) / 255
      )
    }

    return nil
  }
}
