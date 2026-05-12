import { TextArea } from "perry/ui"
import type { WidgetHandle } from "@/lib/perry-ui/platform"
import { applyStyles } from "@/lib/perry-ui/platform"
import { createVariants } from "@/lib/perry-ui/variants"
import { useTheme } from "@/lib/perry-ui/theme"
import { setAccessibilityLabel, setAccessibilityRole } from "@/lib/perry-ui/accessibility"

export type TextareaProps = {
  value?: string
  placeholder?: string
  disabled?: boolean
  rows?: number
  error?: boolean
  onChange?: (value: string) => void
  accessibilityLabel?: string
}

const textareaVariants = createVariants({
  base: {
    border: "input",
    borderWidth: 1,
    radius: "md",
    paddingX: 12,
    paddingY: 8,
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

export function Textarea(props: TextareaProps): WidgetHandle {
  const theme = useTheme()
  const rows = props.rows ?? 3
  const field = TextArea(props.placeholder ?? "", rows, props.onChange ?? (() => {}))

  const styles = textareaVariants(
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
