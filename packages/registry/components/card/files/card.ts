import { VStack, HStack, Text } from "perry/ui"
import type { WidgetHandle } from "@/lib/perry-ui/platform"
import { applyStyles } from "@/lib/perry-ui/platform"
import { useTheme } from "@/lib/perry-ui/theme"

export type CardProps = {
  children?: WidgetHandle[]
}

export type CardHeaderProps = {
  title?: string
  description?: string
}

export type CardTitleProps = {
  children?: string
}

export type CardDescriptionProps = {
  children?: string
}

export type CardContentProps = {
  children?: WidgetHandle[]
}

export type CardFooterProps = {
  children?: WidgetHandle[]
}

export function Card(props: CardProps): WidgetHandle {
  const theme = useTheme()
  const card = VStack(0, props.children ?? [])
  applyStyles(card, {
    background: "card",
    border: "border",
    borderWidth: 1,
    radius: "lg",
    padding: 24,
  }, theme)
  return card
}

export function CardHeader(props: CardHeaderProps): WidgetHandle {
  const theme = useTheme()
  const children: WidgetHandle[] = []
  if (props.title) children.push(CardTitle({ children: props.title }))
  if (props.description) children.push(CardDescription({ children: props.description }))

  const header = VStack(4, children)
  applyStyles(header, { padding: 0 }, theme)
  return header
}

export function CardTitle(props: CardTitleProps): WidgetHandle {
  const theme = useTheme()
  const title = Text(props.children ?? "")
  applyStyles(title, {
    fontSize: "lg",
    fontWeight: "semibold",
    foreground: "cardForeground",
  }, theme)
  return title
}

export function CardDescription(props: CardDescriptionProps): WidgetHandle {
  const theme = useTheme()
  const desc = Text(props.children ?? "")
  applyStyles(desc, {
    fontSize: "sm",
    foreground: "mutedForeground",
  }, theme)
  return desc
}

export function CardContent(props: CardContentProps): WidgetHandle {
  const theme = useTheme()
  const content = VStack(8, props.children ?? [])
  applyStyles(content, { padding: 0 }, theme)
  return content
}

export function CardFooter(props: CardFooterProps): WidgetHandle {
  const theme = useTheme()
  const footer = HStack(8, props.children ?? [])
  applyStyles(footer, { padding: 0 }, theme)
  return footer
}
