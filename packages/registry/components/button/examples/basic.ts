/**
 * Button - Basic Usage
 *
 * Simple button with default styling.
 */

import { Button } from "@/components/ui/button"

export function BasicButtonExample() {
  return Button({
    children: "Click me",
    variant: "default",
    size: "md",
    onPress: () => console.log("Button clicked!")
  })
}
