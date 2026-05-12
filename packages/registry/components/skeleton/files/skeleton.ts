import { VStack } from "perry/ui"
import type { WidgetHandle } from "@/lib/perry-ui/platform"
import { applyStyles, applyBg, applyRadius } from "@/lib/perry-ui/platform"
import { useTheme } from "@/lib/perry-ui/theme"
import { setAccessibilityRole } from "@/lib/perry-ui/accessibility"

export type SkeletonRadius = "none" | "sm" | "md" | "lg" | "full"

export type SkeletonVariant = "text" | "circular" | "rectangular"

export type SkeletonProps = {
  width?: number
  height?: number
  radius?: SkeletonRadius
  variant?: SkeletonVariant
}

function resolveDimensions(variant: SkeletonVariant, width: number, height: number): { w: number; h: number } {
  if (variant === "circular") {
    const size = Math.max(width, height)
    return { w: size, h: size }
  }
  if (variant === "text") {
    return { w: width, h: Math.min(Math.max(height, 12), 16) }
  }
  return { w: width, h: height }
}

function resolveRadius(variant: SkeletonVariant, radius: SkeletonRadius): SkeletonRadius {
  if (variant === "circular") return "full"
  if (variant === "text") return "sm"
  return radius
}

export function Skeleton(props?: SkeletonProps): WidgetHandle {
  const theme = useTheme()

  const variant: SkeletonVariant = props?.variant ?? "rectangular"
  const rawWidth: number = props?.width ?? 100
  const rawHeight: number = props?.height ?? 16
  const rawRadius: SkeletonRadius = props?.radius ?? "md"

  const { w, h } = resolveDimensions(variant, rawWidth, rawHeight)
  const finalRadius = resolveRadius(variant, rawRadius)

  const el = VStack(0, [])

  applyStyles(el, {
    width: w,
    height: h,
    opacity: 0.5,
  }, theme)

  applyBg(el, "muted", theme)
  applyRadius(el, finalRadius, theme)

  setAccessibilityRole(el, "img")
  applyStyles(el, {
    accessibilityLabel: "Loading placeholder",
    accessibilityHidden: true,
  }, theme)

  return el
}
