/**
 * Dialog - Basic Usage
 *
 * Modal dialog with title, description, and actions.
 */

import { Dialog } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export function BasicDialogExample() {
  return Button({
    children: "Open Dialog",
    onPress: () => {
      Dialog({
        title: "Confirm Action",
        description: "Are you sure you want to proceed?",
        onConfirm: () => console.log("Confirmed"),
        onCancel: () => console.log("Cancelled")
      })
    }
  })
}
