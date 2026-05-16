import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { getExampleById } from "@/lib/examples"
import { ExamplePreview } from "@/components/example-preview"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Counter Example — Perry UI",
  description: "A simple counter app demonstrating Perry UI Button and Heading components.",
}

const exampleCode = `// Counter Example Code
import { Window } from "perry/ui"
import { VStack } from "perry/ui"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

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
        Card({
          children: [
            Label({
              children: "Perry UI Counter",
              variant: "heading"
            })
          ]
        }),
        Card({
          children: [
            Label({
              id: "counter-display",
              children: "0",
              variant: "display"
            })
          ]
        }),
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
}`

export default function CounterExamplePage() {
  const example = getExampleById("counter")

  if (!example) {
    notFound()
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="max-w-3xl">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Link href="/examples" className="hover:text-foreground">Examples</Link>
          <span>/</span>
          <span className="text-foreground">{example.title}</span>
        </div>

        <h1 className="text-3xl font-bold">{example.title}</h1>
        <p className="text-lg text-muted-foreground mt-2 mb-6">
          {example.description}
        </p>

        <div className="space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-4">About This Example</h2>
            <p className="text-muted-foreground">
              This example demonstrates:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
              <li>Button component with multiple variants (default, secondary, destructive)</li>
              <li>Card component for layout grouping</li>
              <li>Label component for text display</li>
              <li>VStack for vertical layout</li>
              <li>Simple state management with variables</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Example Preview</h2>
            <ExamplePreview
              name="counter"
              title="Counter App Preview"
              description="Simple counter with increment, decrement, and reset"
              code={exampleCode}
            />
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Running This Example</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-2">1. Navigate to the example directory:</p>
                <pre className="bg-muted p-3 rounded text-sm">
                  <code>cd examples/counter</code>
                </pre>
              </div>
              <div>
                <p className="text-sm font-medium mb-2">2. Install dependencies:</p>
                <pre className="bg-muted p-3 rounded text-sm">
                  <code>bun install</code>
                </pre>
              </div>
              <div>
                <p className="text-sm font-medium mb-2">3. Initialize Perry UI:</p>
                <pre className="bg-muted p-3 rounded text-sm">
                  <code>bunx perry-ui init</code>
                </pre>
              </div>
              <div>
                <p className="text-sm font-medium mb-2">4. Add required components:</p>
                <pre className="bg-muted p-3 rounded text-sm">
                  <code>bunx perry-ui add button card label</code>
                </pre>
              </div>
              <div>
                <p className="text-sm font-medium mb-2">5. Run the example:</p>
                <pre className="bg-muted p-3 rounded text-sm">
                  <code>bun run dev</code>
                </pre>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Key Concepts Demonstrated</h2>
            <div className="space-y-3">
              <div>
                <h3 className="text-sm font-semibold mb-1">Button Variants</h3>
                <p className="text-sm text-muted-foreground">
                  Shows different button styles: default (primary action), secondary (less emphasis), and destructive (danger actions).
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold mb-1">State Management</h3>
                <p className="text-sm text-muted-foreground">
                  Simple variable-based state (let count = 0) with manual DOM updates.
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold mb-1">Layout Composition</h3>
                <p className="text-sm text-muted-foreground">
                  Uses VStack for vertical spacing and Card for content grouping.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Related Components</h2>
            <div className="flex flex-wrap gap-2">
              <Button asChild variant="outline" size="sm">
                <Link href="/components/button">Button Component →</Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/components/card">Card Component →</Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/components/label">Label Component →</Link>
              </Button>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
