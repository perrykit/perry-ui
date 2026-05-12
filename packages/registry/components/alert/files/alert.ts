import { VStack, HStack, Text } from "perry/ui"
import type { WidgetHandle } from "@/lib/perry-ui/platform"
import { applyStyles } from "@/lib/perry-ui/platform"
import { createVariants } from "@/lib/perry-ui/variants"
import { useTheme } from "@/lib/perry-ui/theme"
import type { ThemeTokens } from "@/lib/perry-ui/tokens"

export type AlertVariant = "default" | "destructive"

export type AlertProps = {
  variant?: AlertVariant
  title?: string
  description?: string
  children?: WidgetHandle[]
}

const alertVariants = createVariants({
  base: {
    radius: "lg",
    padding: 16,
    border: "border",
    borderWidth: 1,
  },
  variants: {
    variant: {
      default: {
        background: "card",
        foreground: "foreground",
      },
      destructive: {
        background: "destructive",
        foreground: "destructiveForeground",
        border: "destructive",
      },
    },
  },
  defaults: {
    variant: "default",
  },
})

export function Alert(props: AlertProps): WidgetHandle {
  const theme = useTheme()
  const styles = alertVariants({ variant: props.variant }, theme)

  const children: WidgetHandle[] = []

  if (props.title) {
    const titleText = Text(props.title)
    applyStyles(titleText, {
      fontWeight: "medium",
      fontSize: "sm",
      foreground: styles.foreground,
    }, theme)
    children.push(titleText)
  }

  if (props.description) {
    const descText = Text(props.description)
    applyStyles(descText, {
      fontSize: "sm",
      foreground: "mutedForeground",
    }, theme)
    children.push(descText)
  }

  if (props.children) {
    children.push(...props.children)
  }

  const alert = VStack(8, children)
  applyStyles(alert, styles, theme)

  return alert
}
