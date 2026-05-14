/**
 * Form Wizard Block
 *
 * Multi-step form with progress indicator.
 */

import { VStack, HStack } from "perry/ui"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"

export interface FormWizardProps {
  steps: FormStep[]
  onComplete?: (data: Record<string, any>) => void
}

export interface FormStep {
  title: string
  fields: FormField[]
}

export interface FormField {
  name: string
  label: string
  type: "text" | "email" | "password" | "number"
  required?: boolean
}

export function FormWizard(props: FormWizardProps) {
  const {
    steps = [
      {
        title: "Personal Info",
        fields: [
          { name: "name", label: "Name", type: "text", required: true },
          { name: "email", label: "Email", type: "email", required: true }
        ]
      },
      {
        title: "Account",
        fields: [
          { name: "username", label: "Username", type: "text", required: true },
          { name: "password", label: "Password", type: "password", required: true }
        ]
      }
    ],
    onComplete = (data) => console.log("Complete:", data)
  } = props

  let currentStep = 0
  const formData: Record<string, any> = {}

  function nextStep() {
    if (currentStep < steps.length - 1) {
      currentStep++
    } else {
      onComplete(formData)
    }
  }

  function prevStep() {
    if (currentStep > 0) {
      currentStep--
    }
  }

  const progress = ((currentStep + 1) / steps.length) * 100

  return VStack(24, [
    // Progress
    VStack(8, [
      Label({
        children: `Step ${currentStep + 1} of ${steps.length}`,
        variant: "muted"
      }),
      Progress({ value: progress })
    ]),

    // Current step
    Card({
      children: [
        {
          type: "header",
          content: steps[currentStep].title
        },
        {
          type: "content",
          content: VStack(16, [
            ...steps[currentStep].fields.map(field =>
              VStack(4, [
                Label({
                  children: field.label + (field.required ? " *" : ""),
                  variant: "label"
                }),
                // Input field would go here
                Label({
                  children: `${field.name} input`,
                  variant: "muted"
                })
              ])
            )
          ])
        }
      ]
    }),

    Separator(),

    // Navigation
    HStack(8, [
      Button({
        children: "Back",
        variant: "outline",
        onPress: prevStep,
        disabled: currentStep === 0
      }),
      Button({
        children: currentStep === steps.length - 1 ? "Complete" : "Next",
        variant: "default",
        onPress: nextStep
      })
    ])
  ])
}
