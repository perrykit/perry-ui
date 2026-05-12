import { ZStack, Text, State } from "perry/ui"
import type { WidgetHandle } from "@/lib/perry-ui/platform"
import { applyStyles, widgetSetTooltip } from "@/lib/perry-ui/platform"
import { useTheme } from "@/lib/perry-ui/theme"
import { setAccessibilityRole } from "@/lib/perry-ui/accessibility"

export type TooltipProps = {
  content: string
  children: WidgetHandle
  delay?: number
}

export function Tooltip(props: TooltipProps): WidgetHandle {
  const theme = useTheme()
  const delay = props.delay ?? 500

  // Use Perry's native tooltip as the primary mechanism
  widgetSetTooltip(props.children, props.content)

  // State-driven visibility for the styled overlay bubble
  const visible = State(false)

  // Build the tooltip bubble as a styled overlay
  const bubble = Text(props.content)
  applyStyles(bubble, {
    fontSize: "sm",
    foreground: "mutedForeground",
    background: "muted",
    radius: "md",
    paddingX: 8,
    paddingY: 4,
    shadow: "sm",
  }, theme)
  setAccessibilityRole(bubble, "label")

  // Conditionally include the bubble in the overlay based on visibility
  const overlayChildren: WidgetHandle[] = []
  if (visible.get()) {
    overlayChildren.push(bubble)
  }

  // Stack: children at the base, tooltip bubble on top
  const tooltip = ZStack([
    props.children,
    ...overlayChildren,
  ])

  // Bind hover state with delay
  tooltip.onHoverChange((hovering: boolean) => {
    if (hovering) {
      setTimeout(() => visible.set(true), delay)
    } else {
      visible.set(false)
    }
  })

  return tooltip
}
