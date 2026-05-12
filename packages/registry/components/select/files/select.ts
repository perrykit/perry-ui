import { Picker, Text } from "perry/ui"
import type { WidgetHandle } from "@/lib/perry-ui/platform"
import { applyStyles } from "@/lib/perry-ui/platform"
import { createVariants } from "@/lib/perry-ui/variants"
import { useTheme } from "@/lib/perry-ui/theme"
import { setAccessibilityLabel, setAccessibilityRole } from "@/lib/perry-ui/accessibility"

export type SelectOption = {
  label: string
  value: string
}

export type SelectProps = {
  options: SelectOption[]
  value?: string
  placeholder?: string
  disabled?: boolean
  onChange?: (value: string) => void
  accessibilityLabel?: string
}

const selectVariants = createVariants({
  base: {
    height: 40,
    paddingX: 12,
    border: "input",
    borderWidth: 1,
    radius: "md",
    fontSize: "sm",
  },
  variants: {
    disabled: {
      true: {
        opacity: 0.5,
      },
    },
  },
})

export function Select(props: SelectProps): WidgetHandle {
  const theme = useTheme()
  const labels = props.options.map((o) => o.label)
  const picker = Picker(labels, props.onChange ?? (() => {}))

  const styles = selectVariants(
    { disabled: props.disabled ?? false },
    theme
  )
  applyStyles(picker, styles, theme)

  if (props.accessibilityLabel) {
    setAccessibilityLabel(picker, props.accessibilityLabel)
  }
  setAccessibilityRole(picker, "input")

  return picker
}
