import { TextField } from "perry/ui"
import type { WidgetHandle } from "@/lib/perry-ui/platform"
import { applyStyles } from "@/lib/perry-ui/platform"
import { useTheme } from "@/lib/perry-ui/theme"

export type InputProps = {
  value?: string
  placeholder?: string
  disabled?: boolean
  onChange?: (value: string) => void
  accessibilityLabel?: string
}

export function Input(props: InputProps): WidgetHandle {
  const theme = useTheme()
  const field = TextField(props.placeholder ?? "", props.onChange ?? (() => {}))

  applyStyles(field, {
    height: 40,
    paddingX: 12,
    border: "input",
    borderWidth: 1,
    radius: "md",
    fontSize: "sm",
  }, theme)

  if (props.disabled) {
    applyStyles(field, { opacity: 0.5 }, theme)
  }

  return field
}
