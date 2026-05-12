/**
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
