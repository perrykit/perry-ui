import { sheetCreate, sheetPresent, sheetDismiss, VStack, HStack, Text, Button as PerryButton, State } from "perry/ui"
import type { WidgetHandle } from "@/lib/perry-ui/platform"
import { applyStyles } from "@/lib/perry-ui/platform"
import { useTheme } from "@/lib/perry-ui/theme"
import { setAccessibilityRole } from "@/lib/perry-ui/accessibility"

export type Side = "left" | "right" | "top" | "bottom"

export type SheetProps = {
  open?: boolean
  side?: Side
  width?: number
  title?: string
  description?: string
  children?: WidgetHandle[]
  onClose?: () => void
}

export type SheetHeaderProps = {
  title?: string
  description?: string
  onClose?: () => void
}

export type SheetContentProps = {
  children?: WidgetHandle[]
}

export type SheetFooterProps = {
  children?: WidgetHandle[]
}

export function SheetHeader(props: SheetHeaderProps): WidgetHandle {
  const theme = useTheme()
  const leftChildren: WidgetHandle[] = []

  if (props.title) {
    const titleText = Text(props.title)
    applyStyles(titleText, {
      fontSize: "lg",
      fontWeight: "semibold",
      foreground: "foreground",
    }, theme)
    leftChildren.push(titleText)
  }

  if (props.description) {
    const descText = Text(props.description)
    applyStyles(descText, {
      fontSize: "sm",
      foreground: "mutedForeground",
    }, theme)
    leftChildren.push(descText)
  }

  const textBlock = VStack(2, leftChildren)

  const headerChildren: WidgetHandle[] = [textBlock]

  if (props.onClose) {
    const closeButton = PerryButton("Close", () => {
      props.onClose?.()
    })
    applyStyles(closeButton, {
      background: "secondary",
      foreground: "secondaryForeground",
      radius: "md",
    }, theme)
    headerChildren.push(closeButton)
  }

  const header = HStack(8, headerChildren)
  applyStyles(header, {
    padding: 0,
    justify: "space-between",
    align: "center",
  }, theme)

  return header
}

export function SheetContent(props: SheetContentProps): WidgetHandle {
  const theme = useTheme()
  const content = VStack(8, props.children ?? [])
  applyStyles(content, {
    padding: 0,
    flex: 1,
    overflow: "auto",
  }, theme)
  return content
}

export function SheetFooter(props: SheetFooterProps): WidgetHandle {
  const theme = useTheme()
  const footer = HStack(8, props.children ?? [])
  applyStyles(footer, {
    padding: 0,
    justify: "end",
    align: "center",
  }, theme)
  return footer
}

export function Sheet(props: SheetProps): WidgetHandle {
  const theme = useTheme()
  const side: Side = props.side ?? "right"
  const width: number = props.width ?? 400

  const bodyChildren: WidgetHandle[] = []

  // Determine sheet dimensions based on side
  const isHorizontal = side === "left" || side === "right"
  const sheetWidth = isHorizontal ? width : 0 // 0 signals full viewport width to Perry
  const sheetHeight = isHorizontal ? 0 : width // reuse width prop as the cross-axis size for vertical sheets

  // Header with optional title/description and close button
  const handleClose = () => {
    sheetDismiss(sheet)
    props.onClose?.()
  }

  if (props.title || props.description) {
    bodyChildren.push(
      SheetHeader({
        title: props.title,
        description: props.description,
        onClose: handleClose,
      })
    )
  } else if (props.onClose) {
    // Still render a minimal close button row if no title/desc but onClose is provided
    const closeButton = PerryButton("Close", handleClose)
    applyStyles(closeButton, {
      background: "secondary",
      foreground: "secondaryForeground",
      radius: "md",
    }, theme)
    const closeRow = HStack(0, [closeButton])
    applyStyles(closeRow, { justify: "end", padding: 0 }, theme)
    bodyChildren.push(closeRow)
  }

  // Content section
  if (props.children) {
    bodyChildren.push(SheetContent({ children: props.children }))
  }

  // Main body container
  const body = VStack(16, bodyChildren)

  // Compute border radius: round the exposed sides, flatten the side attached to the viewport edge
  const borderRadiusMap: Record<Side, string> = {
    left: "0 lg lg 0",    // round right corners
    right: "lg 0 0 lg",   // round left corners
    top: "0 0 lg lg",     // round bottom corners
    bottom: "lg lg 0 0",  // round top corners
  }

  applyStyles(body, {
    background: "popover",
    foreground: "popoverForeground",
    border: 1,
    borderColor: "border",
    radius: borderRadiusMap[side],
    padding: 24,
    shadow: "lg",
  }, theme)

  setAccessibilityRole(body, "dialog")

  // Create and present the sheet
  const sheet = sheetCreate(body, sheetWidth, sheetHeight)

  if (props.open) {
    sheetPresent(sheet)
  }

  return sheet as unknown as WidgetHandle
}
