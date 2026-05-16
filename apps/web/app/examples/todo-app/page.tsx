import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { getExampleById } from "@/lib/examples"
import { ExamplePreview } from "@/components/example-preview"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Todo App Example — Perry UI",
  description: "A todo application demonstrating multiple Perry UI components including Input, Button, Card, Checkbox, and Dialog.",
}

const exampleCode = `// Todo App Example Code
import { Window } from "perry/ui"
import { VStack } from "perry/ui"
import { HStack } from "perry/ui"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Dialog } from "@/components/ui/dialog"

interface Todo {
  id: number
  text: string
  completed: boolean
}

let todos: Todo[] = []
let nextId = 1

function renderTodos() {
  const list = document.getElementById("todo-list")
  if (list) {
    list.innerHTML = ""
    todos.forEach((todo) => {
      const item = document.createElement("div")
      item.className = "flex items-center gap-2 p-2"
      item.innerHTML = \`
        \${Checkbox({
          checked: todo.completed,
          onChange: () => toggleTodo(todo.id)
        })}
        \${Label({
          children: todo.text,
          className: todo.completed ? "line-through text-muted-foreground" : ""
        })}
        \${Button({
          children: "Delete",
          variant: "destructive",
          size: "sm",
          onPress: () => deleteTodo(todo.id)
        })}
      \`
      list.appendChild(item)
    })
  }
}

function addTodo() {
  const input = document.getElementById("todo-input") as HTMLInputElement
  if (input && input.value.trim()) {
    todos.push({
      id: nextId++,
      text: input.value.trim(),
      completed: false
    })
    input.value = ""
    renderTodos()
  }
}

function toggleTodo(id: number) {
  const todo = todos.find((t) => t.id === id)
  if (todo) {
    todo.completed = !todo.completed
    renderTodos()
  }
}

function deleteTodo(id: number) {
  Dialog({
    title: "Delete Todo",
    content: "Are you sure you want to delete this todo?",
    onConfirm: () => {
      todos = todos.filter((t) => t.id !== id)
      renderTodos()
    }
  })
}

export function main() {
  return Window({
    title: "Todo App Example",
    width: 500,
    height: 600,
    children: [
      VStack(16, [
        Card({
          children: [
            Label({
              children: "Perry UI Todo App",
              variant: "heading"
            })
          ]
        }),
        Card({
          children: [
            HStack(8, [
              Input({
                id: "todo-input",
                placeholder: "Add a new todo...",
                flex: 1
              }),
              Button({
                children: "Add",
                variant: "default",
                size: "md",
                onPress: addTodo
              })
            ])
          ]
        }),
        Card({
          children: [
            Label({
              children: "Todos",
              variant: "subheading"
            }),
            VStack(8, [
              {
                id: "todo-list",
                className: "w-full"
              }
            ])
          ]
        })
      ])
    ]
  })
}`

export default function TodoAppExamplePage() {
  const example = getExampleById("todo-app")

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
              <li>Input component for text entry</li>
              <li>Button component for actions</li>
              <li>Checkbox component for completion tracking</li>
              <li>Card component for layout grouping</li>
              <li>Dialog component for confirmations</li>
              <li>TypeScript interfaces for type safety</li>
              <li>State management with arrays</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Example Preview</h2>
            <ExamplePreview
              name="todo-app"
              title="Todo App Preview"
              description="Functional todo app with forms, dialogs, and state management"
              code={exampleCode}
            />
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Running This Example</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-2">1. Navigate to the example directory:</p>
                <pre className="bg-muted p-3 rounded text-sm">
                  <code>cd examples/todo-app</code>
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
                  <code>bunx perry-ui add input button card checkbox label dialog</code>
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
                <h3 className="text-sm font-semibold mb-1">Form Input Handling</h3>
                <p className="text-sm text-muted-foreground">
                  Input component with placeholder text and value retrieval for user data entry.
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold mb-1">State Management</h3>
                <p className="text-sm text-muted-foreground">
                  TypeScript interfaces with array-based state and manual DOM re-rendering.
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold mb-1">Confirmation Dialogs</h3>
                <p className="text-sm text-muted-foreground">
                  Dialog component for user confirmation before destructive actions.
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold mb-1">Layout Composition</h3>
                <p className="text-sm text-muted-foreground">
                  VStack and HStack for flexible layout composition with consistent spacing.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Related Components</h2>
            <div className="flex flex-wrap gap-2">
              <Button asChild variant="outline" size="sm">
                <Link href="/components/input">Input Component →</Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/components/button">Button Component →</Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/components/card">Card Component →</Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/components/checkbox">Checkbox Component →</Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/components/label">Label Component →</Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/components/dialog">Dialog Component →</Link>
              </Button>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
