import { Text } from "perry/ui"
import type { WidgetHandle } from "@/lib/perry-ui/platform"
import { applyStyles } from "@/lib/perry-ui/platform"
import { useTheme } from "@/lib/perry-ui/theme"

export type LabelProps = {
  children?: string
}

export function Label(props: LabelProps): WidgetHandle {
  const theme = useTheme()
  const label = Text(props.children ?? "")

  applyStyles(label, {
    fontSize: "sm",
    fontWeight: "medium",
    foreground: "foreground",
  }, theme)

  return label
}
