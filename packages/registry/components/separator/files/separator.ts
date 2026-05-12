import { Divider } from "perry/ui"
import type { WidgetHandle } from "@/lib/perry-ui/platform"
import { applyStyles } from "@/lib/perry-ui/platform"
import { useTheme } from "@/lib/perry-ui/theme"

export type SeparatorProps = {
  orientation?: "horizontal" | "vertical"
}

export function Separator(props?: SeparatorProps): WidgetHandle {
  const theme = useTheme()
  const divider = Divider()

  applyStyles(divider, {
    border: "border",
    borderWidth: 1,
  }, theme)

  return divider
}
