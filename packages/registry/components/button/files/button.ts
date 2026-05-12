import { Button as PerryButton } from "perry/ui"
import type { WidgetHandle } from "@/lib/perry-ui/platform"
import { applyStyles, applyButtonBordered } from "@/lib/perry-ui/platform"
import { createVariants } from "@/lib/perry-ui/variants"
import { useTheme } from "@/lib/perry-ui/theme"
import { setAccessibilityLabel, setAccessibilityRole } from "@/lib/perry-ui/accessibility"

export type ButtonVariant = "default" | "secondary" | "destructive" | "outline" | "ghost" | "link"
export type ButtonSize = "sm" | "md" | "lg" | "icon"

export type ButtonProps = {
  children?: string
  variant?: ButtonVariant
  size?: ButtonSize
  disabled?: boolean
  onPress?: () => void
  accessibilityLabel?: string
}

const buttonVariants = createVariants({
  base: {
    radius: "md",
    fontWeight: "medium",
    fontSize: "sm",
  },
  variants: {
    variant: {
      default: {
        background: "primary",
        foreground: "primaryForeground",
      },
      secondary: {
        background: "secondary",
        foreground: "secondaryForeground",
      },
      destructive: {
        background: "destructive",
        foreground: "destructiveForeground",
      },
      outline: {
        background: "transparent",
        foreground: "foreground",
        border: "border",
        borderWidth: 1,
      },
      ghost: {
        background: "transparent",
        foreground: "foreground",
      },
      link: {
        background: "transparent",
        foreground: "primary",
      },
    },
    size: {
      sm: { height: 32, paddingX: 12 },
      md: { height: 40, paddingX: 16 },
      lg: { height: 48, paddingX: 20 },
      icon: { height: 40, width: 40 },
    },
  },
  defaults: {
    variant: "default",
    size: "md",
  },
})

export function Button(props: ButtonProps): WidgetHandle {
  const theme = useTheme()
  const styles = buttonVariants(
    { variant: props.variant, size: props.size },
    theme
  )

  const button = PerryButton(props.children ?? "", props.onPress ?? (() => {}))

  // For outline variant, remove native border and use our own
  if (props.variant === "outline") {
    applyButtonBordered(button, false)
  } else if (props.variant === "ghost" || props.variant === "link") {
    applyButtonBordered(button, false)
  }

  applyStyles(button, styles, theme)

  if (props.disabled) {
    applyStyles(button, { opacity: 0.5 }, theme)
  }

  if (props.accessibilityLabel) {
    setAccessibilityLabel(button, props.accessibilityLabel)
  }
  setAccessibilityRole(button, "button")

  return button
}
