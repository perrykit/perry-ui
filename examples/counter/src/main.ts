/**
 * Perry UI Counter Example
 *
 * A simple counter app demonstrating:
 * - Button component (variants, sizes)
 * - Card component (layout)
 * - Label component (text display)
 */

import { Window } from "perry/ui"
import { VStack } from "perry/ui"
import { Button } from "./components/ui/button"
import { Card } from "./components/ui/card"
import { Label } from "./components/ui/label"

let count = 0

function updateDisplay() {
  const display = document.getElementById("counter-display")
  if (display) {
    display.textContent = count.toString()
  }
}

function increment() {
  count++
  updateDisplay()
}

function decrement() {
  count--
  updateDisplay()
}

function reset() {
  count = 0
  updateDisplay()
}

export function main() {
  return Window({
    title: "Counter Example",
    width: 400,
    height: 300,
    children: [
      VStack(16, [
        // Header card
        Card({
          children: [
            Label({
              children: "Perry UI Counter",
              variant: "heading"
            })
          ]
        }),

        // Counter display card
        Card({
          children: [
            Label({
              id: "counter-display",
              children: "0",
              variant: "display"
            })
          ]
        }),

        // Control buttons
        VStack(8, [
          Button({
            children: "Increment",
            variant: "default",
            size: "md",
            onPress: increment
          }),
          Button({
            children: "Decrement",
            variant: "secondary",
            size: "md",
            onPress: decrement
          }),
          Button({
            children: "Reset",
            variant: "destructive",
            size: "md",
            onPress: reset
          })
        ])
      ])
    ]
  })
}
