/**
 * Button - All Variants
 *
 * Demonstrates all available button variants.
 */

import { Button } from "@/components/ui/button"
import { VStack } from "perry/ui"

export function ButtonVariantsExample() {
  return VStack(8, [
    Button({ children: "Default", variant: "default" }),
    Button({ children: "Secondary", variant: "secondary" }),
    Button({ children: "Destructive", variant: "destructive" }),
    Button({ children: "Outline", variant: "outline" }),
    Button({ children: "Ghost", variant: "ghost" }),
    Button({ children: "Link", variant: "link" })
  ])
}
