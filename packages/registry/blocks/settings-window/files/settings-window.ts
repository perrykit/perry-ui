import { Window, VStack, HStack, Text, Toggle, State } from "perry/ui"
import type { WidgetHandle } from "@/lib/perry-ui/platform"
import { applyStyles } from "@/lib/perry-ui/platform"
import { useTheme } from "@/lib/perry-ui/theme"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export type SettingsWindowProps = {
  title?: string
  width?: number
  height?: number
}

function SettingsRow(label: string, control: WidgetHandle): WidgetHandle {
  const theme = useTheme()
  const row = HStack(12, [
    Label({ children: label }),
    control,
  ])
  applyStyles(row, { padding: 8, align: "center", justify: "between" }, theme)
  return row
}

export function SettingsWindow(props?: SettingsWindowProps): WidgetHandle {
  const theme = useTheme()

  // State for settings
  const notifications = State(true)
  const darkMode = State(false)
  const autoSave = State(true)
  const username = State("")

  // Build sections
  const content = VStack(24, [
    // General section
    Card({
      children: [
        CardHeader({ title: "General", description: "Manage your app preferences." }),
        Separator(),
        SettingsRow("Notifications", Toggle("", (v) => notifications.set(v))),
        SettingsRow("Dark Mode", Toggle("", (v) => darkMode.set(v))),
        SettingsRow("Auto Save", Toggle("", (v) => autoSave.set(v))),
      ],
    }),

    // Account section
    Card({
      children: [
        CardHeader({ title: "Account", description: "Update your account settings." }),
        Separator(),
        SettingsRow("Username", Input({
          placeholder: "Enter username...",
          onChange: (v) => username.set(v),
        })),
      ],
    }),

    // Actions
    HStack(8, [
      Button({ children: "Save Changes", variant: "default" }),
      Button({ children: "Reset", variant: "outline" }),
    ]),
  ])

  applyStyles(content, { padding: 24 }, theme)

  const win = Window(props?.title ?? "Settings", props?.width ?? 500, props?.height ?? 600)
  win.setBody(content)
  win.show()

  return win as unknown as WidgetHandle
}
