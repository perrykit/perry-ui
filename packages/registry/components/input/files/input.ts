import { TextField } from "perry/ui"
import type { WidgetHandle } from "@/lib/perry-ui/platform"
import { applyStyles } from "@/lib/perry-ui/platform"
import { createVariants } from "@/lib/perry-ui/variants"
import { useTheme } from "@/lib/perry-ui/theme"
import { setAccessibilityLabel, setAccessibilityRole } from "@/lib/perry-ui/accessibility"

export type InputProps = {
  value?: string
  placeholder?: string
  disabled?: boolean
  error?: boolean
  onChange?: (value: string) => void
  accessibilityLabel?: string
}

const inputVariants = createVariants({
  base: {
    height: 40,
    paddingX: 12,
    border: "input",
    borderWidth: 1,
    radius: "md",
    fontSize: "sm",
  },
  variants: {
    error: {
      true: {
        border: "destructive",
        foreground: "destructive",
      },
    },
    disabled: {
      true: {
        opacity: 0.5,
      },
    },
  },
})

export function Input(props: InputProps): WidgetHandle {
  const theme = useTheme()
  const field = TextField(props.placeholder ?? "", props.onChange ?? (() => {}))

  const styles = inputVariants(
    { error: props.error ?? false, disabled: props.disabled ?? false },
    theme
  )
  applyStyles(field, styles, theme)

  if (props.accessibilityLabel) {
    setAccessibilityLabel(field, props.accessibilityLabel)
  }
  setAccessibilityRole(field, "input")

  return field
}
