import { VStack, HStack, Text } from "perry/ui"
import type { WidgetHandle } from "@/lib/perry-ui/platform"
import { applyStyles, applyRadius, applyWidth, applyHeight, applyBg } from "@/lib/perry-ui/platform"
import { useTheme } from "@/lib/perry-ui/theme"
import { resolveColor, resolveRadius } from "@/lib/perry-ui/variants"
import { setAccessibilityRole, setAccessibilityLabel } from "@/lib/perry-ui/accessibility"

export type ProgressProps = {
  value?: number
  max?: number
  label?: string
  showValue?: boolean
  accessibilityLabel?: string
}

export function Progress(props: ProgressProps): WidgetHandle {
  const theme = useTheme()

  const value = props.value ?? 0
  const max = props.max ?? 100
  const clampedValue = Math.max(0, Math.min(value, max))
  const percentage = max > 0 ? (clampedValue / max) * 100 : 0

  const children: WidgetHandle[] = []

  // Optional label row above the track
  if (props.label || props.showValue) {
    const labelChildren: WidgetHandle[] = []

    if (props.label) {
      const labelText = Text(props.label)
      applyStyles(labelText, {
        fontSize: "sm",
        fontWeight: "medium",
        foreground: "foreground",
      }, theme)
      labelChildren.push(labelText)
    }

    if (props.showValue) {
      const valueText = Text(`${Math.round(percentage)}%`)
      applyStyles(valueText, {
        fontSize: "sm",
        foreground: "mutedForeground",
      }, theme)
      labelChildren.push(valueText)
    }

    const labelRow = HStack(0, labelChildren)
    applyStyles(labelRow, {
      justify: "between",
    }, theme)
    children.push(labelRow)
  }

  // Track (background bar) with fill inside
  const fill = HStack(0, [])

  const fillColor = resolveColor("primary", theme)
  if (fillColor) applyBg(fill, fillColor)

  applyHeight(fill, 8)
  applyRadius(fill, resolveRadius("full", theme) ?? 9999)
  applyWidth(fill, percentage)

  const track = HStack(0, [fill])

  const trackColor = resolveColor("secondary", theme)
  if (trackColor) applyBg(track, trackColor)

  applyHeight(track, 8)
  applyRadius(track, resolveRadius("full", theme) ?? 9999)

  children.push(track)

  // Root container
  const root = VStack(4, children)
  applyStyles(root, {
    width: "fill",
  }, theme)

  // Accessibility
  const a11yLabel = props.accessibilityLabel ?? props.label ?? `Progress ${Math.round(percentage)}%`
  setAccessibilityLabel(root, a11yLabel)
  setAccessibilityRole(root, "progressbar")

  return root
}
