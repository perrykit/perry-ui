/**
 * Input - Basic Usage
 *
 * Simple text input field.
 */

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function BasicInputExample() {
  return Input({
    placeholder: "Enter text...",
    onChange: (value) => console.log("Input value:", value)
  })
}
