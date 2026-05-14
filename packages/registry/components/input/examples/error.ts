/**
 * Input - Error State
 *
 * Input field with error styling.
 */

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function ErrorInputExample() {
  return Input({
    placeholder: "Email address",
    error: true,
    onChange: (value) => {
      // Validate email
      const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
      console.log("Valid email:", isValid)
    }
  })
}
