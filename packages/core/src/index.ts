/**
 * Perry UI Core
 *
 * Re-exports all core helpers for convenient importing.
 */

export type { Color, ColorTokens, ThemeTokens, RadiusTokens, SpacingTokens, TypographyTokens, BorderTokens, ShadowTokens, ShadowValue, DurationTokens } from "./tokens"
export { zincTheme, zincDarkTheme, useTheme, setTheme, getTheme, hexToColor, colorToHex, rgb } from "./theme"
export type { StyleObject, VariantDefinition } from "./variants"
export { createVariants, resolveRadius, resolveFontSize, resolveColor } from "./variants"
export type { WidgetHandle } from "./platform"
export { applyStyles, applyBg, applyTextColor, applyBorderColor, applyBorderWidth, applyRadius, applyFontSize, applyFontWeight, applyFontBold, applyEdgeInsets, applyOpacity, applyWidth, applyHeight, applyButtonBg, applyButtonTextColor, applyButtonBordered } from "./platform"
export { composeStyles, withPadding, withPaddingXY } from "./compose"
export type { A11yRole } from "./accessibility"
export { setAccessibilityLabel, setAccessibilityRole, setLiveRegion } from "./accessibility"
export { COMPAT, checkFeature } from "./compat"
