/**
 * Notification List Block
 *
 * List of toast/alert notifications with actions.
 */

import { VStack } from "perry/ui"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export interface NotificationListProps {
  notifications: Notification[]
  onDismiss?: (id: string) => void
  onAction?: (id: string, action: string) => void
}

export interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  actions?: Array<{ label: string; value: string }>
  timestamp?: string
}

export function NotificationList(props: NotificationListProps) {
  const {
    notifications = [
      {
        id: "1",
        title: "Welcome",
        message: "Get started with Perry UI",
        type: "info",
        actions: [{ label: "Get Started", value: "start" }]
      }
    ],
    onDismiss = (id) => console.log("Dismiss:", id),
    onAction = (id, action) => console.log("Action:", id, action)
  } = props

  return VStack(8, [
    ...notifications.map(notification => {
      const variant = notification.type === "error" ? "destructive" : "default"

      return Card({
        children: [
          {
            type: "content",
            content: VStack(12, [
              // Header
              HStack(8, [
                Label({
                  children: notification.title,
                  variant: "heading"
                }),
                Badge({
                  children: notification.type,
                  variant: variant
                }),
                Label({
                  children: notification.timestamp || "Just now",
                  variant: "muted"
                })
              ]),

              Separator(),

              // Message
              Label({
                children: notification.message,
                variant: "body"
              }),

              // Actions
              if (notification.actions && notification.actions.length > 0) {
                HStack(8, [
                  ...notification.actions.map(action =>
                    Button({
                      children: action.label,
                      variant: "outline",
                      size: "sm",
                      onPress: () => onAction(notification.id, action.value)
                    })
                  ),
                  Button({
                    children: "Dismiss",
                    variant: "ghost",
                    size: "sm",
                    onPress: () => onDismiss(notification.id)
                  })
                ])
              }
            ])
          }
        ]
      })
    })
  ])
}
