/**
 * Button - Disabled State
 *
 * Demonstrates disabled button with reduced opacity.
 */

import { Button } from "@/components/ui/button"
import { VStack } from "perry/ui"

export function ButtonDisabledExample() {
  return VStack(8, [
    Button({
      children: "Enabled Button",
      variant: "default",
      onPress: () => console.log("Clicked")
    }),
    Button({
      children: "Disabled Button",
      variant: "default",
      disabled: true,
      onPress: () => console.log("This won't fire")
    })
  ])
}
