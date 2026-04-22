package expo.modules.backgroundblur

import android.content.Context
import android.graphics.Color as AndroidColor
import android.view.View
import android.view.ViewGroup
import android.widget.FrameLayout
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableFloatStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.ComposeView
import androidx.compose.ui.unit.dp
import androidx.compose.ui.viewinterop.AndroidView
import dev.chrisbanes.haze.HazeState
import dev.chrisbanes.haze.HazeTint
import dev.chrisbanes.haze.hazeEffect
import dev.chrisbanes.haze.hazeSource
import expo.modules.kotlin.AppContext
import expo.modules.kotlin.views.ExpoView

class BackgroundBlurView(
  context: Context,
  appContext: AppContext
) : ExpoView(context, appContext) {

  private val hazeState = HazeState()

  private var blurRadiusDp by mutableFloatStateOf(20f)
  private var tintColor by mutableStateOf(Color.Transparent)
  private var tintOpacity by mutableFloatStateOf(1f)

  private val contentWrapper = FrameLayout(context).apply {
    layoutParams = ViewGroup.LayoutParams(
      ViewGroup.LayoutParams.MATCH_PARENT,
      ViewGroup.LayoutParams.MATCH_PARENT
    )
    clipChildren = false
    clipToPadding = false
  }

  private val composeView = ComposeView(context).apply {
    layoutParams = ViewGroup.LayoutParams(
      ViewGroup.LayoutParams.MATCH_PARENT,
      ViewGroup.LayoutParams.MATCH_PARENT
    )
    isClickable = false
    isFocusable = false
    isFocusableInTouchMode = false

    setContent { BlurContent() }
  }

  init {
    super.addView(composeView)
  }

  fun setRadius(value: Double) {
    blurRadiusDp = value.toFloat().coerceAtLeast(0f)
  }

  fun setTintColor(value: String?) {
    tintColor = parseColorOrDefault(value)
  }

  fun setTintOpacity(value: Double) {
    tintOpacity = value.toFloat().coerceIn(0f, 1f)
  }

  @Composable
  private fun BlurContent() {
    Box(modifier = Modifier.fillMaxSize()) {
      AndroidView(
        factory = { contentWrapper },
        modifier = Modifier
          .fillMaxSize()
          .hazeSource(state = hazeState)
      )

      Box(
        modifier = Modifier
          .fillMaxSize()
          .hazeEffect(state = hazeState) {
            blurRadius = blurRadiusDp.dp
            val effectiveAlpha = tintColor.alpha * tintOpacity
            tints = if (effectiveAlpha > 0f) {
              listOf(HazeTint(tintColor.copy(alpha = effectiveAlpha)))
            } else {
              emptyList()
            }
          }
      )
    }
  }

  override fun addView(child: View?, index: Int) {
    if (child == null) return

    if (child === composeView) {
      super.addView(child, index)
    } else {
      val parent = child.parent as? ViewGroup
      parent?.removeView(child)

      contentWrapper.addView(
        child,
        ViewGroup.LayoutParams(
          ViewGroup.LayoutParams.MATCH_PARENT,
          ViewGroup.LayoutParams.MATCH_PARENT
        )
      )
    }
  }

  private fun parseColorOrDefault(value: String?): Color {
    if (value.isNullOrBlank()) return Color.Transparent

    return try {
      val parsed = AndroidColor.parseColor(value)
      Color(
        red = AndroidColor.red(parsed),
        green = AndroidColor.green(parsed),
        blue = AndroidColor.blue(parsed),
        alpha = AndroidColor.alpha(parsed)
      )
    } catch (_: IllegalArgumentException) {
      Color.Transparent
    }
  }
}
