import { VStack, HStack, Text, Button as PerryButton, State } from "perry/ui"
import type { WidgetHandle } from "@/lib/perry-ui/platform"
import { applyStyles } from "@/lib/perry-ui/platform"
import { useTheme } from "@/lib/perry-ui/theme"
import { setAccessibilityLabel, setAccessibilityRole } from "@/lib/perry-ui/accessibility"

export type TabItem = {
  label: string
  value: string
  content: WidgetHandle
}

export type TabsProps = {
  items: TabItem[]
  defaultValue?: string
  onChange?: (value: string) => void
}

export type TabTriggerProps = {
  label: string
  value: string
  active: boolean
  onPress: () => void
}

export type TabContentProps = {
  children: WidgetHandle
}

export function Tabs(props: TabsProps): WidgetHandle {
  const theme = useTheme()

  const activeValue = props.defaultValue ?? (props.items.length > 0 ? props.items[0].value : "")
  const activeTab = State(activeValue)

  const tabButtons: WidgetHandle[] = props.items.map((item) =>
    TabTrigger({
      label: item.label,
      value: item.value,
      active: activeTab.get() === item.value,
      onPress: () => {
        activeTab.set(item.value)
        props.onChange?.(item.value)
      },
    })
  )

  const tabBar = HStack(0, tabButtons)
  applyStyles(tabBar, {
    borderBottom: "border",
    borderBottomWidth: 1,
    align: "center",
  }, theme)

  const activeItem = props.items.find((item) => item.value === activeTab.get())
  const contentArea = TabContent({ children: activeItem?.content ?? VStack(0, []) })

  const container = VStack(0, [tabBar, contentArea])
  applyStyles(container, {}, theme)

  return container
}

export function TabTrigger(props: TabTriggerProps): WidgetHandle {
  const theme = useTheme()

  const button = PerryButton(props.label, props.onPress)
  applyStyles(button, {
    background: "transparent",
    foreground: props.active ? "foreground" : "mutedForeground",
    fontSize: "sm",
    fontWeight: props.active ? "medium" : "normal",
    paddingX: 16,
    paddingY: 8,
    borderBottom: props.active ? "primary" : "transparent",
    borderBottomWidth: props.active ? 2 : 0,
  }, theme)

  setAccessibilityRole(button, "tab")
  setAccessibilityLabel(button, props.label)

  return button
}

export function TabContent(props: TabContentProps): WidgetHandle {
  const theme = useTheme()

  const panel = VStack(16, [props.children])
  applyStyles(panel, {
    padding: 16,
  }, theme)

  setAccessibilityRole(panel, "tabpanel")

  return panel
}
