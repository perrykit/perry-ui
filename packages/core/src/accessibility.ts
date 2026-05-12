/**
 * Perry UI Accessibility Helpers
 *
 * Bridges accessibility concepts to Perry's native platform APIs.
 * Uses widgetSetTooltip as fallback where dedicated APIs are unavailable.
 */

import type { WidgetHandle } from "./platform"

// Perry runtime function — declared here so TypeScript compiles.
// At runtime, the real Perry function is resolved by the Perry compiler.
declare function widgetSetTooltip(w: WidgetHandle, text: string): void

/**
 * Common ARIA-like roles mapped to Perry platform behavior.
 */
export type A11yRole =
  | "button"
  | "link"
  | "heading"
  | "label"
  | "input"
  | "checkbox"
  | "radio"
  | "switch"
  | "tab"
  | "tabpanel"
  | "dialog"
  | "alert"
  | "status"
  | "navigation"
  | "list"
  | "listitem"
  | "separator"
  | "progressbar"
  | "img"

/**
 * Set an accessibility label on a widget.
 * Falls back to tooltip where native accessibility APIs are unavailable.
 */
export function setAccessibilityLabel(widget: WidgetHandle, label: string): void {
  if (!label) return
  try {
    widgetSetTooltip(widget, label)
  } catch {
    // Platform may not support tooltip or accessibility APIs yet
  }
}

/**
 * Set an accessibility role hint on a widget.
 * Currently documents intent; platforms will use this when they expose role APIs.
 */
export function setAccessibilityRole(widget: WidgetHandle, role: A11yRole): void {
  // Perry does not yet expose a dedicated role API.
  // Some platforms infer role from widget type (Button → button, etc.)
  // Store the intent for future platform support.
  try {
    // When Perry adds widgetSetA11yRole, it goes here:
    // widgetSetA11yRole(widget, role)
    widgetSetTooltip(widget, role)
  } catch {
    // No-op on unsupported platforms
  }
  void widget
  void role
}

/**
 * Mark a widget as live-updating for screen readers (equivalent to aria-live).
 * Useful for toasts, alerts, and status messages.
 */
export function setLiveRegion(widget: WidgetHandle, politeness: "polite" | "assertive" = "polite"): void {
  // Future: widgetSetA11yLiveRegion(widget, politeness)
  void widget
  void politeness
}
