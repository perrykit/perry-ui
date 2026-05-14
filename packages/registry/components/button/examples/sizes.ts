/**
 * Button - All Sizes
 *
 * Demonstrates all available button sizes.
 */

import { Button } from "@/components/ui/button"
import { HStack } from "perry/ui"

export function ButtonSizesExample() {
  return HStack(8, [
    Button({ children: "Small", size: "sm" }),
    Button({ children: "Medium", size: "md" }),
    Button({ children: "Large", size: "lg" }),
    Button({ children: "Icon", size: "icon" })
  ])
}
