/**
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
