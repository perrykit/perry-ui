# Todo App Example

A functional todo application demonstrating Perry UI components.

## What It Demonstrates

- **Input** component for text entry
- **Button** component for actions
- **Checkbox** component for todo completion
- **Card** component for layout
- **Dialog** component for delete confirmation
- **Label** component for text display
- State management with TypeScript interfaces
- Dynamic list rendering

## Code Overview

This example shows:
```typescript
// Input for text entry
Input({
  placeholder: "Add a new todo...",
  onChange: (value) => { inputText = value }
})

// Checkbox for completion
Checkbox({
  checked: todo.completed,
  onCheckedChange: (checked) => toggleTodo(todo.id)
})

// Dialog for confirmation
Dialog({
  title: "Delete Todo",
  description: "Are you sure?",
  onConfirm: deleteTodo
})

// Dynamic list rendering
todos.forEach(todo => {
  const todoItem = createTodoItem(todo)
  container.appendChild(todoItem)
})
```

## How to Use This Example

This is a **code example** demonstrating component usage patterns:

1. **Read the source code** in `src/main.ts`
2. **See component imports** and usage patterns
3. **Copy patterns** to your own Perry project

**Note:** This is not a runnable app — it's example code showing how to use Perry UI components.

## Components Demonstrated

- `Input` — Text input field
- `Button` — Action buttons (default, destructive variants)
- `Checkbox` — Boolean selection
- `Card` — Container components
- `Dialog` — Modal confirmation
- `Label` — Text labels
- `VStack` / `HStack` — Layout containers

## Features Demonstrated

- Add new todos
- Mark todos as complete/incomplete
- Delete todos with confirmation
- Visual feedback for completed items
- Toast notifications pattern

## Customize

Try adding:
- Due dates for todos
- Priority levels
- Categories/tags
- Search/filter functionality
- Edit existing todos

## Learn More

- [Components Documentation](https://perry-ui.com/components)
- [Getting Started Guide](https://perry-ui.com/docs/getting-started)
- [Tutorial](https://perry-ui.com/docs/tutorial)
