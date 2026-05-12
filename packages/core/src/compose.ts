/**
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
