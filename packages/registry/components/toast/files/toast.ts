import { VStack, HStack, Text, Button as PerryButton } from "perry/ui"
import type { WidgetHandle } from "@/lib/perry-ui/platform"
import { applyStyles } from "@/lib/perry-ui/platform"
import { createVariants } from "@/lib/perry-ui/variants"
import { useTheme } from "@/lib/perry-ui/theme"
import { setAccessibilityLabel, setAccessibilityRole, setLiveRegion } from "@/lib/perry-ui/accessibility"

export type ToastVariant = "default" | "success" | "destructive"

export type ToastProps = {
  title: string
  description?: string
  variant?: ToastVariant
  duration?: number
  onDismiss?: () => void
}

export type ToastProviderProps = {
  children?: WidgetHandle[]
}

const toastVariants = createVariants({
  base: {
    radius: "lg",
    padding: 16,
    border: "border",
    borderWidth: 1,
  },
  variants: {
    variant: {
      default: {
        background: "card",
        foreground: "cardForeground",
      },
      success: {
        background: "card",
        foreground: "cardForeground",
        border: "accent",
      },
      destructive: {
        background: "destructive",
        foreground: "destructiveForeground",
        border: "destructive",
      },
    },
  },
  defaults: {
    variant: "default",
  },
})

const DEFAULT_DURATION = 5000

export function Toast(props: ToastProps): WidgetHandle {
  const theme = useTheme()
  const variant = props.variant ?? "default"
  const styles = toastVariants({ variant }, theme)
  const duration = props.duration ?? DEFAULT_DURATION

  const children: WidgetHandle[] = []

  // Title
  const titleText = Text(props.title)
  applyStyles(titleText, {
    fontWeight: "semibold",
    fontSize: "sm",
    foreground: styles.foreground,
  }, theme)
  children.push(titleText)

  // Description
  if (props.description) {
    const descText = Text(props.description)
    applyStyles(descText, {
      fontSize: "sm",
      foreground: "mutedForeground",
    }, theme)
    children.push(descText)
  }

  // Content column
  const content = VStack(4, children)

  // Dismiss button
  const dismissBtn = PerryButton("\u00D7", props.onDismiss ?? (() => {}))
  applyStyles(dismissBtn, {
    background: "transparent",
    foreground: styles.foreground,
    fontSize: "lg",
    fontWeight: "medium",
  }, theme)
  setAccessibilityLabel(dismissBtn, "Dismiss notification")

  // Row: content + dismiss
  const row = HStack(8, [content, dismissBtn])
  applyStyles(row, {
    align: "center",
    justify: "between",
  }, theme)

  // Toast container
  const toast = VStack(0, [row])
  applyStyles(toast, styles, theme)

  // Accessibility: live region for screen readers
  const politeness = variant === "destructive" ? "assertive" : "polite"
  setLiveRegion(toast, politeness)
  setAccessibilityRole(toast, "status")
  setAccessibilityLabel(toast, props.title)

  // Auto-dismiss via duration
  // Perry's runtime schedules the callback after the given milliseconds.
  // On platforms without a timer API, the toast persists until manual dismiss.
  if (duration > 0) {
    try {
      // The Perry runtime provides scheduleTimeout as a free function.
      // If unavailable (e.g., during static rendering), this is a no-op.
      const scheduleTimeout: (ms: number, cb: () => void) => void | undefined =
        (globalThis as Record<string, unknown>).scheduleTimeout as typeof scheduleTimeout
      if (typeof scheduleTimeout === "function") {
        scheduleTimeout(duration, props.onDismiss ?? (() => {}))
      }
    } catch {
      // Timer unavailable; toast will persist until manually dismissed
    }
  }

  return toast
}

export function ToastProvider(props: ToastProviderProps): WidgetHandle {
  const theme = useTheme()
  const container = VStack(8, props.children ?? [])
  applyStyles(container, {
    padding: 16,
    align: "end",
    justify: "end",
  }, theme)
  return container
}
