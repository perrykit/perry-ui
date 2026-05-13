/**
 * Embedded core source files for the Perry UI CLI.
 *
 * These are the source files that get copied into user projects
 * by `perry-ui init`. Embedded here so the npm package is self-contained.
 */

export const CORE_SOURCES: Record<string, string> = {
  "tokens.ts": `/**
 * Perry UI Design Tokens
 *
 * Type definitions for the token system that drives component styling.
 * Tokens are semantic (e.g., "primary", "muted") rather than raw values.
 */

// ── Color ──────────────────────────────────────────────────────────────

export type Color = {
  r: number
  g: number
  b: number
  a: number
}

export type ColorTokens = {
  background: Color
  foreground: Color
  card: Color
  cardForeground: Color
  popover: Color
  popoverForeground: Color
  primary: Color
  primaryForeground: Color
  secondary: Color
  secondaryForeground: Color
  muted: Color
  mutedForeground: Color
  accent: Color
  accentForeground: Color
  destructive: Color
  destructiveForeground: Color
  border: Color
  input: Color
  ring: Color
}

// ── Radius ─────────────────────────────────────────────────────────────

export type RadiusTokens = {
  none: number
  sm: number
  md: number
  lg: number
  xl: number
  full: number
}

// ── Spacing ────────────────────────────────────────────────────────────

export type SpacingTokens = {
  0: number
  1: number
  2: number
  3: number
  4: number
  5: number
  6: number
  8: number
  10: number
  12: number
}

// ── Typography ─────────────────────────────────────────────────────────

export type TypographyTokens = {
  fontFamily: string
  xs: number
  sm: number
  base: number
  lg: number
  xl: number
  xxl: number
}

// ── Border ─────────────────────────────────────────────────────────────

export type BorderTokens = {
  thin: number
  medium: number
}

// ── Shadow ─────────────────────────────────────────────────────────────

export type ShadowValue = {
  x: number
  y: number
  blur: number
  opacity: number
}

export type ShadowTokens = {
  none: ShadowValue | null
  sm: ShadowValue
  md: ShadowValue
}

// ── Duration ───────────────────────────────────────────────────────────

export type DurationTokens = {
  fast: number
  normal: number
  slow: number
}

// ── Aggregate ──────────────────────────────────────────────────────────

export type ThemeTokens = {
  color: ColorTokens
  radius: RadiusTokens
  spacing: SpacingTokens
  typography: TypographyTokens
  border: BorderTokens
  shadow: ShadowTokens
  duration: DurationTokens
}
`,

  "theme.ts": `/**
 * Perry UI Theme System
 *
 * Provides the default zinc theme and utilities for theme management.
 * Based on shadcn/ui's zinc theme adapted for Perry's native Color type.
 */

import type { Color, ThemeTokens } from "./tokens"

// ── Utilities ──────────────────────────────────────────────────────────

export function hexToColor(hex: string): Color {
  const h = hex.replace("#", "")
  const r = parseInt(h.substring(0, 2), 16) / 255
  const g = parseInt(h.substring(2, 4), 16) / 255
  const b = parseInt(h.substring(4, 6), 16) / 255
  const a = h.length === 8 ? parseInt(h.substring(6, 8), 16) / 255 : 1
  return { r, g, b, a }
}

export function colorToHex(color: Color): string {
  const toHex = (v: number) => Math.round(v * 255).toString(16).padStart(2, "0")
  if (color.a < 1) {
    return \`#\${toHex(color.r)}\${toHex(color.g)}\${toHex(color.b)}\${toHex(color.a)}\`
  }
  return \`#\${toHex(color.r)}\${toHex(color.g)}\${toHex(color.b)}\`
}

export function rgb(r: number, g: number, b: number, a = 1): Color {
  return { r: r / 255, g: g / 255, b: b / 255, a }
}

// ── Zinc Theme (Default) ───────────────────────────────────────────────

export const zincTheme: ThemeTokens = {
  color: {
    background: rgb(250, 250, 250),
    foreground: rgb(24, 24, 27),
    card: rgb(255, 255, 255),
    cardForeground: rgb(24, 24, 27),
    popover: rgb(255, 255, 255),
    popoverForeground: rgb(24, 24, 27),
    primary: rgb(24, 24, 27),
    primaryForeground: rgb(250, 250, 250),
    secondary: rgb(244, 244, 245),
    secondaryForeground: rgb(24, 24, 27),
    muted: rgb(244, 244, 245),
    mutedForeground: rgb(113, 113, 122),
    accent: rgb(244, 244, 245),
    accentForeground: rgb(24, 24, 27),
    destructive: rgb(239, 68, 68),
    destructiveForeground: rgb(255, 255, 255),
    border: rgb(228, 228, 231),
    input: rgb(228, 228, 231),
    ring: rgb(24, 24, 27),
  },
  radius: {
    none: 0,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,
  },
  spacing: {
    0: 0,
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    5: 20,
    6: 24,
    8: 32,
    10: 40,
    12: 48,
  },
  typography: {
    fontFamily: "system",
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
  },
  border: {
    thin: 1,
    medium: 2,
  },
  shadow: {
    none: null,
    sm: { x: 0, y: 1, blur: 2, opacity: 0.08 },
    md: { x: 0, y: 4, blur: 12, opacity: 0.1 },
  },
  duration: {
    fast: 120,
    normal: 180,
    slow: 240,
  },
}

// ── Dark Zinc Theme ────────────────────────────────────────────────────

export const zincDarkTheme: ThemeTokens = {
  color: {
    background: rgb(24, 24, 27),
    foreground: rgb(250, 250, 250),
    card: rgb(24, 24, 27),
    cardForeground: rgb(250, 250, 250),
    popover: rgb(24, 24, 27),
    popoverForeground: rgb(250, 250, 250),
    primary: rgb(250, 250, 250),
    primaryForeground: rgb(24, 24, 27),
    secondary: rgb(39, 39, 42),
    secondaryForeground: rgb(250, 250, 250),
    muted: rgb(39, 39, 42),
    mutedForeground: rgb(161, 161, 170),
    accent: rgb(39, 39, 42),
    accentForeground: rgb(250, 250, 250),
    destructive: rgb(239, 68, 68),
    destructiveForeground: rgb(250, 250, 250),
    border: rgb(39, 39, 42),
    input: rgb(39, 39, 42),
    ring: rgb(212, 212, 216),
  },
  radius: zincTheme.radius,
  spacing: zincTheme.spacing,
  typography: zincTheme.typography,
  border: zincTheme.border,
  shadow: {
    none: null,
    sm: { x: 0, y: 1, blur: 2, opacity: 0.2 },
    md: { x: 0, y: 4, blur: 12, opacity: 0.25 },
  },
  duration: zincTheme.duration,
}

// ── Theme Resolution ───────────────────────────────────────────────────

let _activeTheme: ThemeTokens = zincTheme

export function useTheme(): ThemeTokens {
  return _activeTheme
}

export function setTheme(theme: ThemeTokens): void {
  _activeTheme = theme
}

export function getTheme(mode: "light" | "dark" | "system"): ThemeTokens {
  switch (mode) {
    case "dark":
      return zincDarkTheme
    case "light":
      return zincTheme
    case "system":
      // In Perry, check platform preference. Default to light for now.
      return zincTheme
  }
}
`,

  "variants.ts": `/**
 * Perry UI Variant System
 *
 * A token-based variant resolver inspired by class-variance-authority,
 * but using style objects instead of CSS class strings.
 */

import type { Color, ThemeTokens, ColorTokens } from "./tokens"
import type { ThemeTokens as TT } from "./tokens"

// ── Style Object ───────────────────────────────────────────────────────

export type StyleObject = {
  width?: number | "fill" | "hug"
  height?: number | "fill" | "hug"
  minWidth?: number
  minHeight?: number
  padding?: number
  paddingX?: number
  paddingY?: number
  margin?: number
  marginX?: number
  marginY?: number
  radius?: keyof TT["radius"] | number
  background?: keyof ColorTokens | Color | "transparent"
  foreground?: keyof ColorTokens | Color
  border?: keyof ColorTokens | Color | "none"
  borderWidth?: number
  fontSize?: keyof TT["typography"] | number
  fontWeight?: "regular" | "medium" | "semibold" | "bold"
  opacity?: number
  gap?: number
  align?: "start" | "center" | "end" | "stretch"
  justify?: "start" | "center" | "end" | "between"
}

// ── Variant Definition ─────────────────────────────────────────────────

export type VariantDefinition = {
  base?: StyleObject
  variants?: Record<string, Record<string, StyleObject>>
  compoundVariants?: Array<{
    conditions: Record<string, string | boolean>
    styles: StyleObject
  }>
  defaults?: Record<string, string | boolean>
}

// ── Merge Helpers ──────────────────────────────────────────────────────

function mergeStyles(base: StyleObject, ...overrides: StyleObject[]): StyleObject {
  const result: Record<string, unknown> = { ...base }
  for (const override of overrides) {
    for (const [key, value] of Object.entries(override)) {
      if (value !== undefined) {
        result[key] = value
      }
    }
  }
  return result as StyleObject
}

// ── Create Variants ────────────────────────────────────────────────────

/**
 * Creates a variant resolver from a VariantDefinition.
 * Returns a function that, given variant selections and a theme,
 * resolves to a merged StyleObject with token references intact.
 */
export function createVariants(definition: VariantDefinition) {
  return function resolve(
    input: Record<string, string | boolean | undefined>,
    theme?: ThemeTokens
  ): StyleObject {
    const resolved: StyleObject[] = []

    // 1. Base styles
    if (definition.base) {
      resolved.push(definition.base)
    }

    // 2. Apply defaults for missing inputs
    const effective = { ...input }
    if (definition.defaults) {
      for (const [key, defaultValue] of Object.entries(definition.defaults)) {
        if (effective[key] === undefined) {
          effective[key] = defaultValue
        }
      }
    }

    // 3. Apply matching variant styles
    if (definition.variants) {
      for (const [variantKey, variantMap] of Object.entries(definition.variants)) {
        const selectedValue = effective[variantKey]
        if (selectedValue && typeof selectedValue === "string" && variantMap[selectedValue]) {
          resolved.push(variantMap[selectedValue])
        }
      }
    }

    // 4. Apply compound variants
    if (definition.compoundVariants) {
      for (const compound of definition.compoundVariants) {
        const matches = Object.entries(compound.conditions).every(
          ([key, value]) => effective[key] === value
        )
        if (matches) {
          resolved.push(compound.styles)
        }
      }
    }

    // 5. Merge all resolved styles
    const merged = resolved.reduce(
      (acc, style) => mergeStyles(acc, style),
      {} as StyleObject
    )

    return merged
  }
}

/**
 * Resolve a style value that might be a token key to a concrete value.
 */
export function resolveRadius(
  radius: keyof TT["radius"] | number | undefined,
  theme: ThemeTokens
): number | undefined {
  if (radius === undefined) return undefined
  if (typeof radius === "number") return radius
  return theme.radius[radius]
}

export function resolveFontSize(
  size: keyof TT["typography"] | number | undefined,
  theme: ThemeTokens
): number | undefined {
  if (size === undefined) return undefined
  if (typeof size === "number") return size
  return theme.typography[size]
}

export function resolveColor(
  colorRef: keyof ColorTokens | Color | "transparent" | "none" | undefined,
  theme: ThemeTokens
): Color | undefined {
  if (colorRef === undefined) return undefined
  if (colorRef === "transparent") return { r: 0, g: 0, b: 0, a: 0 }
  if (colorRef === "none") return undefined
  if (typeof colorRef === "string") {
    return theme.color[colorRef as keyof ColorTokens]
  }
  return colorRef
}
`,

  "platform.ts": `/**
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
  return \`#\${toHex(color.r)}\${toHex(color.g)}\${toHex(color.b)}\`
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
`,

  "compose.ts": `/**
 * Perry UI Style Composition
 *
 * Helpers for merging and composing style objects.
 */

import type { StyleObject } from "./variants"

/**
 * Merge multiple style objects. Later values override earlier ones.
 */
export function composeStyles(...styles: StyleObject[]): StyleObject {
  const result: Record<string, unknown> = {}
  for (const style of styles) {
    for (const [key, value] of Object.entries(style)) {
      if (value !== undefined) {
        result[key] = value
      }
    }
  }
  return result as StyleObject
}

/**
 * Add uniform padding to a style object.
 */
export function withPadding(style: StyleObject, padding: number): StyleObject {
  return { ...style, padding }
}

/**
 * Add horizontal/vertical padding.
 */
export function withPaddingXY(style: StyleObject, px: number, py: number): StyleObject {
  return { ...style, paddingX: px, paddingY: py }
}
`,

  "accessibility.ts": `/**
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
`,

  "compat.ts": `/**
 * Perry UI Compatibility Layer
 *
 * Centralizes Perry version feature checks and compatibility notes.
 */

export const COMPAT = {
  minPerryVersion: "0.5.0",
  testedVersions: ["0.5.x"],

  features: {
    inlineStyles: true,
    freeFunctionAPI: true,
    stateReactivity: true,
    canvas: "web-only",
    camera: "ios-android-only",
    table: "macos-web-only",
    menuBar: "macos-only",
    hoverEvents: "desktop-only",
    vibrancy: "macos-only",
  },
} as const

/**
 * Check if a feature is available on the current platform.
 * Returns a boolean for universal features, or a string note for platform-specific ones.
 */
export function checkFeature(feature: keyof typeof COMPAT.features): boolean | string {
  return COMPAT.features[feature]
}
`,

}
