import { describe, expect, it } from "bun:test"
import { createVariants, resolveRadius, resolveFontSize, resolveColor } from "../variants"
import { zincTheme, zincDarkTheme } from "../theme"

describe("createVariants", () => {
  it("returns base styles when no variants selected", () => {
    const resolve = createVariants({
      base: { padding: 16, radius: "md" as const },
    })
    const result = resolve({})
    expect(result.padding).toBe(16)
  })

  it("applies matching variant styles", () => {
    const resolve = createVariants({
      base: { padding: 16 },
      variants: {
        size: {
          sm: { height: 32 },
          lg: { height: 48 },
        },
      },
    })
    const result = resolve({ size: "lg" })
    expect(result.padding).toBe(16)
    expect(result.height).toBe(48)
  })

  it("applies defaults for missing inputs", () => {
    const resolve = createVariants({
      base: { padding: 16 },
      variants: {
        variant: {
          default: { background: "primary" as const },
          secondary: { background: "secondary" as const },
        },
      },
      defaults: { variant: "default" },
    })
    const result = resolve({})
    expect(result.background).toBe("primary")
  })

  it("overrides base with variant styles", () => {
    const resolve = createVariants({
      base: { padding: 16, opacity: 1 },
      variants: {
        disabled: {
          true: { opacity: 0.5 },
        },
      },
    })
    const result = resolve({ disabled: "true" })
    expect(result.padding).toBe(16)
    expect(result.opacity).toBe(0.5)
  })

  it("applies compound variants when all conditions match", () => {
    const resolve = createVariants({
      base: {},
      variants: {
        variant: {
          outline: { border: "border" as const },
        },
        size: {
          icon: { width: 40, height: 40 },
        },
      },
      compoundVariants: [
        {
          conditions: { variant: "outline", size: "icon" },
          styles: { radius: "full" as const },
        },
      ],
    })
    const result = resolve({ variant: "outline", size: "icon" })
    expect(result.border).toBe("border")
    expect(result.width).toBe(40)
    expect(result.radius).toBe("full")
  })

  it("does not apply compound variant when conditions do not match", () => {
    const resolve = createVariants({
      base: {},
      variants: {
        variant: {
          outline: { border: "border" as const },
        },
      },
      compoundVariants: [
        {
          conditions: { variant: "outline", size: "icon" },
          styles: { radius: "full" as const },
        },
      ],
    })
    const result = resolve({ variant: "outline" })
    expect(result.radius).toBeUndefined()
  })

  it("handles empty definition", () => {
    const resolve = createVariants({})
    const result = resolve({})
    expect(Object.keys(result)).toHaveLength(0)
  })
})

describe("resolveRadius", () => {
  it("resolves named radius token", () => {
    expect(resolveRadius("md", zincTheme)).toBe(8)
    expect(resolveRadius("lg", zincTheme)).toBe(12)
    expect(resolveRadius("full", zincTheme)).toBe(9999)
  })

  it("passes through numeric values", () => {
    expect(resolveRadius(6, zincTheme)).toBe(6)
    expect(resolveRadius(0, zincTheme)).toBe(0)
  })

  it("returns undefined for undefined input", () => {
    expect(resolveRadius(undefined, zincTheme)).toBeUndefined()
  })
})

describe("resolveFontSize", () => {
  it("resolves named typography tokens", () => {
    expect(resolveFontSize("sm", zincTheme)).toBe(14)
    expect(resolveFontSize("base", zincTheme)).toBe(16)
    expect(resolveFontSize("xl", zincTheme)).toBe(20)
  })

  it("passes through numeric values", () => {
    expect(resolveFontSize(18, zincTheme)).toBe(18)
  })

  it("returns undefined for undefined input", () => {
    expect(resolveFontSize(undefined, zincTheme)).toBeUndefined()
  })
})

describe("resolveColor", () => {
  it("resolves semantic color tokens", () => {
    const bg = resolveColor("background", zincTheme)
    expect(bg).toBeDefined()
    expect(bg!.r).toBeCloseTo(0.98, 1)
    expect(bg!.a).toBe(1)
  })

  it("resolves primary color token", () => {
    const primary = resolveColor("primary", zincTheme)
    expect(primary).toBeDefined()
    expect(primary!.r).toBeCloseTo(0.094, 2)
  })

  it("returns transparent color for 'transparent'", () => {
    const c = resolveColor("transparent", zincTheme)
    expect(c).toEqual({ r: 0, g: 0, b: 0, a: 0 })
  })

  it("returns undefined for 'none'", () => {
    expect(resolveColor("none", zincTheme)).toBeUndefined()
  })

  it("returns undefined for undefined input", () => {
    expect(resolveColor(undefined, zincTheme)).toBeUndefined()
  })

  it("passes through Color objects", () => {
    const color = { r: 0.5, g: 0.5, b: 0.5, a: 1 }
    expect(resolveColor(color, zincTheme)).toEqual(color)
  })
})

describe("theme system", () => {
  it("zinc light theme has all required color tokens", () => {
    const requiredColors = [
      "background", "foreground", "card", "cardForeground",
      "popover", "popoverForeground", "primary", "primaryForeground",
      "secondary", "secondaryForeground", "muted", "mutedForeground",
      "accent", "accentForeground", "destructive", "destructiveForeground",
      "border", "input", "ring",
    ] as const

    for (const key of requiredColors) {
      expect(zincTheme.color[key]).toBeDefined()
      expect(zincTheme.color[key].r).toBeGreaterThanOrEqual(0)
      expect(zincTheme.color[key].r).toBeLessThanOrEqual(1)
      expect(zincTheme.color[key].a).toBeGreaterThanOrEqual(0)
      expect(zincTheme.color[key].a).toBeLessThanOrEqual(1)
    }
  })

  it("zinc dark theme inverts light/dark colors", () => {
    expect(zincDarkTheme.color.background.r).toBeLessThan(zincTheme.color.background.r)
    expect(zincDarkTheme.color.foreground.r).toBeGreaterThan(zincTheme.color.foreground.r)
  })

  it("radius tokens cover full range", () => {
    expect(zincTheme.radius.none).toBe(0)
    expect(zincTheme.radius.sm).toBeLessThan(zincTheme.radius.md)
    expect(zincTheme.radius.md).toBeLessThan(zincTheme.radius.lg)
    expect(zincTheme.radius.lg).toBeLessThan(zincTheme.radius.xl)
    expect(zincTheme.radius.full).toBe(9999)
  })

  it("spacing tokens are monotonically increasing", () => {
    const spacing = zincTheme.spacing
    const values = Object.values(spacing)
    for (let i = 1; i < values.length; i++) {
      expect(values[i]).toBeGreaterThan(values[i - 1])
    }
  })
})

describe("composeStyles", () => {
  it("merges multiple style objects", async () => {
    const { composeStyles } = await import("../compose")
    const result = composeStyles(
      { padding: 16, opacity: 1 },
      { opacity: 0.5, radius: "md" as const },
    )
    expect(result.padding).toBe(16)
    expect(result.opacity).toBe(0.5)
    expect(result.radius).toBe("md")
  })

  it("withPadding sets uniform padding", async () => {
    const { withPadding } = await import("../compose")
    const result = withPadding({ opacity: 1 }, 24)
    expect(result.padding).toBe(24)
    expect(result.opacity).toBe(1)
  })

  it("withPaddingXY sets directional padding", async () => {
    const { withPaddingXY } = await import("../compose")
    const result = withPaddingXY({ opacity: 1 }, 16, 8)
    expect(result.paddingX).toBe(16)
    expect(result.paddingY).toBe(8)
  })
})
