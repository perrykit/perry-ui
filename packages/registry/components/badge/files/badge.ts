import { Text } from "perry/ui"
import type { WidgetHandle } from "@/lib/perry-ui/platform"
import { applyStyles } from "@/lib/perry-ui/platform"
import { createVariants } from "@/lib/perry-ui/variants"
import { useTheme } from "@/lib/perry-ui/theme"
import type { ThemeTokens } from "@/lib/perry-ui/tokens"

export type BadgeVariant = "default" | "secondary" | "destructive" | "outline"

export type BadgeProps = {
  children?: string
  variant?: BadgeVariant
}

const badgeVariants = createVariants({
  base: {
    radius: "full",
    paddingX: 10,
    paddingY: 2,
    fontSize: "sm",
    fontWeight: "medium",
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
    },
  },
  defaults: {
    variant: "default",
  },
})

export function Badge(props: BadgeProps): WidgetHandle {
  const theme = useTheme()
  const styles = badgeVariants({ variant: props.variant }, theme)

  const badge = Text(props.children ?? "")
  applyStyles(badge, styles, theme)

  return badge
}
