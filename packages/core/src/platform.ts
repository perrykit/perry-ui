/**
 * Perry UI Platform Adapter
 *
 * Local shim for perry-styling helpers. Bridges the variant system
 * to Perry's actual free-function API.
 *
 * This file centralizes all Perry API calls so components stay decoupled
 * from Perry API changes.
 */

import type { Color, ThemeTokens, ColorTokens } from "./tokens"
import type { StyleObject } from "./variants"
import { useTheme } from "./theme"
import { resolveColor, resolveRadius, resolveFontSize } from "./variants"

// ── Widget handle type ─────────────────────────────────────────────────
// In Perry, widgets are opaque 64-bit handles. We type them generically.
// The actual Perry runtime would provide the real type.
export type WidgetHandle = number

// ── Perry API Imports (shim) ───────────────────────────────────────────
// These would normally come from "perry/ui". In the shim, we declare
// the signatures so TypeScript compiles. At runtime, the real Perry
// functions are used.

declare function widgetSetBackgroundColor(w: WidgetHandle, r: number, g: number, b: number, a: number): void
declare function widgetSetBorderColor(w: WidgetHandle, r: number, g: number, b: number, a: number): void
declare function widgetSetBorderWidth(w: WidgetHandle, width: number): void
declare function setCornerRadius(w: WidgetHandle, radius: number): void
declare function widgetSetWidth(w: WidgetHandle, width: number): void
declare function widgetSetHeight(w: WidgetHandle, height: number): void
declare function widgetSetOpacity(w: WidgetHandle, opacity: number): void
declare function widgetSetEnabled(w: WidgetHandle, enabled: boolean): void
declare function widgetSetHidden(w: WidgetHandle, hidden: boolean): void
declare function widgetSetTooltip(w: WidgetHandle, text: string): void
declare function widgetSetEdgeInsets(w: WidgetHandle, top: number, left: number, bottom: number, right: number): void
declare function textSetFontSize(w: WidgetHandle, size: number): void
declare function textSetFontWeight(w: WidgetHandle, weight: string): void
declare function textSetColor(w: WidgetHandle, color: string | Color): void
declare function buttonSetBordered(w: WidgetHandle, bordered: boolean): void
declare function buttonSetTextColor(w: WidgetHandle, color: string | Color): void
declare function buttonSetContentTintColor(w: WidgetHandle, color: string | Color): void
declare function widgetSetOnClick(w: WidgetHandle, callback: () => void): void

// ── Color Helpers ──────────────────────────────────────────────────────

function colorToComponents(color: Color): [number, number, number, number] {
  return [color.r, color.g, color.b, color.a]
}

function colorToString(color: Color): string {
  const toHex = (v: number) => Math.round(v * 255).toString(16).padStart(2, "0")
  return `#${toHex(color.r)}${toHex(color.g)}${toHex(color.b)}`
}

// ── Style Application Helpers (perry-styling shim) ─────────────────────

export function applyBg(widget: WidgetHandle, color: Color): void {
  const [r, g, b, a] = colorToComponents(color)
  widgetSetBackgroundColor(widget, r, g, b, a)
}

export function applyTextColor(widget: WidgetHandle, color: Color): void {
  textSetColor(widget, colorToString(color))
}

export function applyBorderColor(widget: WidgetHandle, color: Color): void {
  const [r, g, b, a] = colorToComponents(color)
  widgetSetBorderColor(widget, r, g, b, a)
}

export function applyBorderWidth(widget: WidgetHandle, width: number): void {
  widgetSetBorderWidth(widget, width)
}

export function applyRadius(widget: WidgetHandle, radius: number): void {
  setCornerRadius(widget, radius)
}

export function applyFontSize(widget: WidgetHandle, size: number): void {
  textSetFontSize(widget, size)
}

export function applyFontWeight(widget: WidgetHandle, weight: string): void {
  textSetFontWeight(widget, weight)
}

export function applyFontBold(widget: WidgetHandle): void {
  textSetFontWeight(widget, "bold")
}

export function applyEdgeInsets(widget: WidgetHandle, padding: number | { top: number; right: number; bottom: number; left: number }): void {
  if (typeof padding === "number") {
    widgetSetEdgeInsets(widget, padding, padding, padding, padding)
  } else {
    widgetSetEdgeInsets(widget, padding.top, padding.left, padding.bottom, padding.right)
  }
}

export function applyOpacity(widget: WidgetHandle, opacity: number): void {
  widgetSetOpacity(widget, opacity)
}

export function applyWidth(widget: WidgetHandle, width: number): void {
  widgetSetWidth(widget, width)
}

export function applyHeight(widget: WidgetHandle, height: number): void {
  widgetSetHeight(widget, height)
}

export function applyButtonBg(widget: WidgetHandle, color: Color): void {
  const [r, g, b, a] = colorToComponents(color)
  widgetSetBackgroundColor(widget, r, g, b, a)
}

export function applyButtonTextColor(widget: WidgetHandle, color: Color): void {
  buttonSetTextColor(widget, colorToString(color))
}

export function applyButtonBordered(widget: WidgetHandle, bordered: boolean): void {
  buttonSetBordered(widget, bordered)
}

// ── Master Style Application ───────────────────────────────────────────

/**
 * Apply a resolved StyleObject to a Perry widget handle.
 * This is the main bridge between the variant system and Perry's API.
 */
export function applyStyles(
  widget: WidgetHandle,
  style: StyleObject,
  theme?: ThemeTokens
): void {
  const t = theme ?? useTheme()

  if (style.background && style.background !== "transparent") {
    const color = resolveColor(style.background, t)
    if (color) applyBg(widget, color)
  }

  if (style.foreground) {
    const color = resolveColor(style.foreground, t)
    if (color) applyTextColor(widget, color)
  }

  if (style.border && style.border !== "none") {
    const color = resolveColor(style.border, t)
    if (color) applyBorderColor(widget, color)
  }

  if (style.borderWidth !== undefined) {
    applyBorderWidth(widget, style.borderWidth)
  }

  if (style.radius !== undefined) {
    const r = resolveRadius(style.radius, t)
    if (r !== undefined) applyRadius(widget, r)
  }

  if (style.width !== undefined && typeof style.width === "number") {
    applyWidth(widget, style.width)
  }

  if (style.height !== undefined && typeof style.height === "number") {
    applyHeight(widget, style.height)
  }

  if (style.fontSize !== undefined) {
    const size = resolveFontSize(style.fontSize, t)
    if (size !== undefined) applyFontSize(widget, size)
  }

  if (style.fontWeight !== undefined) {
    applyFontWeight(widget, style.fontWeight)
  }

  if (style.padding !== undefined) {
    applyEdgeInsets(widget, style.padding)
  }

  if (style.paddingX !== undefined || style.paddingY !== undefined) {
    const px = style.paddingX ?? 0
    const py = style.paddingY ?? 0
    applyEdgeInsets(widget, { top: py, right: px, bottom: py, left: px })
  }

  if (style.opacity !== undefined) {
    applyOpacity(widget, style.opacity)
  }
}
