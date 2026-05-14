/**
 * Card - Basic Usage
 *
 * Simple card with header and content.
 */

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function BasicCardExample() {
  return Card({
    children: [
      {
        type: "header",
        content: "Card Header"
      },
      {
        type: "content",
        content: "This is the card content area. You can put any content here."
      },
      {
        type: "footer",
        content: Button({
          children: "Action",
          variant: "default"
        })
      }
    ]
  })
}
