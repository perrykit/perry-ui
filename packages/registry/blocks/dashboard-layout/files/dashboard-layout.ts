/**
 * Dashboard Layout Block
 *
 * A complete dashboard layout with sidebar, header, and content area.
 */

import { HStack, VStack } from "perry/ui"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"

export interface DashboardLayoutProps {
  sidebarItems?: DashboardItem[]
  headerTitle?: string
  headerActions?: Array<{ label: string; onPress: () => void }>
  children?: any
}

export interface DashboardItem {
  label: string
  icon?: string
  onPress: () => void
  active?: boolean
}

export function DashboardLayout(props: DashboardLayoutProps = {}) {
  const {
    sidebarItems = [
      { label: "Dashboard", onPress: () => console.log("Dashboard"), active: true },
      { label: "Projects", onPress: () => console.log("Projects") },
      { label: "Settings", onPress: () => console.log("Settings") }
    ],
    headerTitle = "Dashboard",
    headerActions = [
      { label: "New", onPress: () => console.log("New") }
    ],
    children
  } = props

  return HStack(0, [
    // Sidebar
    VStack(0, [
      VStack(24, [
        // Logo area
        VStack(8, [
          Label({
            children: "My App",
            variant: "logo"
          }),
          Separator()
        ]),

        // Navigation
        VStack(4, [
          ...sidebarItems.map(item =>
            Button({
              children: item.label,
              variant: item.active ? "secondary" : "ghost",
              onPress: item.onPress
            })
          )
        ])
      ])
    ]),

    Separator({ orientation: "vertical" }),

    // Main content
    VStack(0, [
      // Header
      HStack(16, [
        Label({
          children: headerTitle,
          variant: "heading"
        }),
        ...headerActions.map(action =>
          Button({
            children: action.label,
            variant: "default",
            size: "sm",
            onPress: action.onPress
          })
        )
      ]),

      Separator(),

      // Content area
      children || Label({
        children: "Dashboard content goes here",
        variant: "muted"
      })
    ])
  ])
}
