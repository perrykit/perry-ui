import { VStack, HStack, Text, Toggle } from "perry/ui"
import type { WidgetHandle } from "@/lib/perry-ui/platform"
import { applyStyles } from "@/lib/perry-ui/platform"
import { useTheme } from "@/lib/perry-ui/theme"
import { setAccessibilityLabel, setAccessibilityRole } from "@/lib/perry-ui/accessibility"

export type RadioOption = {
  label: string
  value: string
  disabled?: boolean
}

export type RadioGroupProps = {
  options: RadioOption[]
  value?: string
  onChange?: (value: string) => void
  name?: string
  accessibilityLabel?: string
}

function RadioItem(
  option: RadioOption,
  selected: boolean,
  onSelect: () => void,
  theme: ReturnType<typeof useTheme>
): WidgetHandle {
  const indicator = Toggle(selected, () => {
    if (!option.disabled) {
      onSelect()
    }
  })

  applyStyles(indicator, {
    width: 20,
    height: 20,
    background: selected ? "primary" : "transparent",
    border: selected ? "none" : "border",
    borderWidth: selected ? 0 : 1,
    radius: "full",
  }, theme)

  setAccessibilityRole(indicator, "radio")
  setAccessibilityLabel(indicator, option.label)

  const labelText = Text(option.label)
  applyStyles(labelText, {
    fontSize: "sm",
    fontWeight: "medium",
    foreground: "foreground",
  }, theme)

  const row = HStack(8, [indicator, labelText])

  if (option.disabled) {
    applyStyles(row, { opacity: 0.5 }, theme)
  }

  return row
}

export function RadioGroup(props: RadioGroupProps): WidgetHandle {
  const theme = useTheme()

  const currentValue = props.value ?? ""
  const handleChange = props.onChange ?? (() => {})

  const items = props.options.map((option) =>
    RadioItem(
      option,
      currentValue === option.value,
      () => handleChange(option.value),
      theme
    )
  )

  const container = VStack(8, items)

  setAccessibilityRole(container, "radiogroup")
  if (props.accessibilityLabel) {
    setAccessibilityLabel(container, props.accessibilityLabel)
  }

  return container
}
