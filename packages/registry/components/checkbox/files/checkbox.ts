import { Toggle, HStack, Text } from "perry/ui"
import type { WidgetHandle } from "@/lib/perry-ui/platform"
import { applyStyles } from "@/lib/perry-ui/platform"
import { useTheme } from "@/lib/perry-ui/theme"
import { setAccessibilityLabel, setAccessibilityRole } from "@/lib/perry-ui/accessibility"

export type CheckboxProps = {
  checked?: boolean
  label?: string
  disabled?: boolean
  onChange?: (value: boolean) => void
  accessibilityLabel?: string
}

export function Checkbox(props: CheckboxProps): WidgetHandle {
  const theme = useTheme()

  const toggle = Toggle(props.checked ?? false, props.onChange ?? (() => {}))

  applyStyles(toggle, {
    width: 20,
    height: 20,
    background: props.checked ? "primary" : "transparent",
    border: "border",
    borderWidth: 1,
    radius: "sm",
  }, theme)

  setAccessibilityRole(toggle, "checkbox")

  if (props.accessibilityLabel) {
    setAccessibilityLabel(toggle, props.accessibilityLabel)
  } else if (props.label) {
    setAccessibilityLabel(toggle, props.label)
  }

  if (!props.label) {
    if (props.disabled) {
      applyStyles(toggle, { opacity: 0.5 }, theme)
    }
    return toggle
  }

  const labelText = Text(props.label)
  applyStyles(labelText, {
    fontSize: "sm",
    fontWeight: "medium",
    foreground: "foreground",
  }, theme)

  const container = HStack(8, [toggle, labelText])

  if (props.disabled) {
    applyStyles(container, { opacity: 0.5 }, theme)
  }

  return container
}
