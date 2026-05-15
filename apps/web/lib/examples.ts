export const examples = [
  {
    id: "counter",
    name: "counter",
    title: "Counter App",
    description: "Simple counter with button variants and state management",
    href: "/examples/counter",
    component: "Button",
    tags: ["state", "variants", "basic"],
  },
  {
    id: "todo-app",
    name: "todo-app",
    title: "Todo App",
    description: "Functional todo app with forms, dialogs, and state management",
    href: "/examples/todo-app",
    component: "Input",
    tags: ["forms", "state", "intermediate"],
  },
]

export function getExampleById(id: string) {
  return examples.find((ex) => ex.id === id)
}

export function getExamplesByComponent(componentName: string) {
  return examples.filter((ex) => ex.component === componentName)
}

export function getAllExamples() {
  return examples
}
