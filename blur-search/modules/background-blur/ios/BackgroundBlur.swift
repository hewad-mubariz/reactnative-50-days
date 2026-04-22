import UIKit

open class BackgroundBlurUIView: UIVisualEffectView {
  private let keyPath = "filters.gaussianBlur.inputRadius"
  private weak var blurLayer: CALayer?

  public var blurRadius: CGFloat = 0 {
    didSet {
      if blurLayer == nil { captureBlurLayer() }
      
      blurLayer?.setValue(blurRadius as NSNumber, forKeyPath: keyPath)
      
      // Set to 0 to ensure clarity
      self.alpha = blurRadius > 0.01 ? 1.0 : 0.0
    }
  }

  public init(radius: CGFloat) {
    super.init(effect: UIBlurEffect(style: .regular))
    self.blurRadius = radius
    captureBlurLayer()
  }

  required public init?(coder: NSCoder) {
    fatalError("init(coder:) has not been implemented")
  }

  private func captureBlurLayer() {
    // Hide the default tinting/vibrancy subviews
    for subview in subviews {
      if subview.description.contains("VisualEffectSubview") {
        subview.isHidden = true
      }
    }

    guard let sublayer = layer.sublayers?.first else { return }
    
    if let filters = sublayer.filters {
      sublayer.backgroundColor = nil
      sublayer.isOpaque = false
      // Filter out everything except the actual gaussian blur
      sublayer.filters = filters.filter { "\($0)" == "gaussianBlur" }
      self.blurLayer = sublayer
    }
  }

  open override func layoutSubviews() {
    super.layoutSubviews()
    if blurLayer == nil { captureBlurLayer() }
  }

  open override func traitCollectionDidChange(_ previousTraitCollection: UITraitCollection?) {
  }
}