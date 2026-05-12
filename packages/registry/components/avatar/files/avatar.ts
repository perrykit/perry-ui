import { Text, ZStack, ImageFile } from "perry/ui"
import type { WidgetHandle } from "@/lib/perry-ui/platform"
import { applyStyles } from "@/lib/perry-ui/platform"
import { createVariants } from "@/lib/perry-ui/variants"
import { useTheme } from "@/lib/perry-ui/theme"
import { setAccessibilityRole, setAccessibilityLabel } from "@/lib/perry-ui/accessibility"

export type AvatarSize = "sm" | "md" | "lg"

export type AvatarProps = {
  src?: string
  fallback?: string
  size?: AvatarSize
  accessibilityLabel?: string
}

const sizeMap: Record<AvatarSize, number> = {
  sm: 32,
  md: 40,
  lg: 56,
}

const fontSizeMap: Record<AvatarSize, string> = {
  sm: "xs",
  md: "sm",
  lg: "md",
}

const avatarVariants = createVariants({
  base: {
    radius: "full",
    background: "muted",
    foreground: "foreground",
  },
  variants: {
    size: {
      sm: { width: 32, height: 32 },
      md: { width: 40, height: 40 },
      lg: { width: 56, height: 56 },
    },
  },
  defaults: {
    size: "md",
  },
})

export function Avatar(props: AvatarProps): WidgetHandle {
  const theme = useTheme()
  const size = props.size ?? "md"
  const styles = avatarVariants({ size }, theme)
  const dimension = sizeMap[size]
  const initial = (props.fallback ?? "?").slice(0, 2).toUpperCase()

  let content: WidgetHandle

  if (props.src) {
    const img = ImageFile(props.src)
    applyStyles(img, {
      width: dimension,
      height: dimension,
      radius: "full",
    }, theme)
    content = img
  } else {
    const label = Text(initial)
    applyStyles(label, {
      fontWeight: "bold",
      fontSize: fontSizeMap[size],
      foreground: "foreground",
      textAlign: "center",
      textAlignVertical: "center",
    }, theme)
    content = label
  }

  const container = ZStack([content])
  applyStyles(container, {
    ...styles,
    width: dimension,
    height: dimension,
    alignment: "center",
  }, theme)

  setAccessibilityRole(container, "img")
  if (props.accessibilityLabel) {
    setAccessibilityLabel(container, props.accessibilityLabel)
  }

  return container
}
