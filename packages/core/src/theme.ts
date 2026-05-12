/**
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
    return `#${toHex(color.r)}${toHex(color.g)}${toHex(color.b)}${toHex(color.a)}`
  }
  return `#${toHex(color.r)}${toHex(color.g)}${toHex(color.b)}`
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
