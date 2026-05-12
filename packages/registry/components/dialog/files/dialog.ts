import { sheetCreate, sheetPresent, sheetDismiss, VStack, HStack, Text, Button as PerryButton, State } from "perry/ui"
import type { WidgetHandle } from "@/lib/perry-ui/platform"
import { applyStyles } from "@/lib/perry-ui/platform"
import { useTheme } from "@/lib/perry-ui/theme"
import { setAccessibilityRole } from "@/lib/perry-ui/accessibility"

export type DialogProps = {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  title?: string
  description?: string
  children?: WidgetHandle[]
  width?: number
  height?: number
}

export type DialogHeaderProps = {
  title?: string
  description?: string
}

export type DialogFooterProps = {
  children?: WidgetHandle[]
}

export type DialogContentProps = {
  children?: WidgetHandle[]
}

export function DialogHeader(props: DialogHeaderProps): WidgetHandle {
  const theme = useTheme()
  const children: WidgetHandle[] = []

  if (props.title) {
    const titleText = Text(props.title)
    applyStyles(titleText, {
      fontSize: "lg",
      fontWeight: "semibold",
      foreground: "foreground",
    }, theme)
    children.push(titleText)
  }

  if (props.description) {
    const descText = Text(props.description)
    applyStyles(descText, {
      fontSize: "sm",
      foreground: "mutedForeground",
    }, theme)
    children.push(descText)
  }

  const header = VStack(4, children)
  applyStyles(header, { padding: 0 }, theme)
  return header
}

export function DialogFooter(props: DialogFooterProps): WidgetHandle {
  const theme = useTheme()
  const footer = HStack(8, props.children ?? [])
  applyStyles(footer, { padding: 0, justify: "end" }, theme)
  return footer
}

export function DialogContent(props: DialogContentProps): WidgetHandle {
  const theme = useTheme()
  const content = VStack(8, props.children ?? [])
  applyStyles(content, { padding: 0 }, theme)
  return content
}

export function Dialog(props: DialogProps): WidgetHandle {
  const theme = useTheme()

  // Build dialog body
  const bodyChildren: WidgetHandle[] = []

  // Header section
  if (props.title || props.description) {
    bodyChildren.push(DialogHeader({ title: props.title, description: props.description }))
  }

  // Content section
  if (props.children) {
    bodyChildren.push(DialogContent({ children: props.children }))
  }

  // Close button
  const closeButton = PerryButton("Close", () => {
    sheetDismiss(sheet)
    props.onOpenChange?.(false)
  })
  applyStyles(closeButton, {
    background: "secondary",
    foreground: "secondaryForeground",
    radius: "md",
  }, theme)

  // Footer with actions
  bodyChildren.push(DialogFooter({ children: [closeButton] }))

  const body = VStack(16, bodyChildren)
  applyStyles(body, {
    background: "card",
    foreground: "cardForeground",
    radius: "lg",
    padding: 24,
    shadow: "lg",
  }, theme)

  setAccessibilityRole(body, "dialog")

  // Create and present the sheet
  const sheet = sheetCreate(body, props.width ?? 400, props.height ?? 300)

  if (props.open) {
    sheetPresent(sheet)
  }

  return sheet as unknown as WidgetHandle
}
