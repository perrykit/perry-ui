# Examples

This directory contains **runnable** Perry apps demonstrating Perry UI components in action.

## Running Examples

Each example is a complete, runnable Perry app:

```bash
cd examples/counter
bun install
bun run dev
```

## Available Examples

### Counter App (`examples/counter/`)
A simple counter app demonstrating:
- Button component with variants (default, secondary, destructive)
- Card component for layout grouping
- Label component for text display
- VStack for vertical layout
- State management with simple variables

### Todo App (`examples/todo-app/`)
A functional todo app demonstrating:
- Input component for text entry
- Button component for actions
- Checkbox component for completion
- Card component for layout
- Dialog component for confirmations
- State management with TypeScript interfaces

## Example Setup

Each example requires Perry UI to be initialized. From the example directory:

```bash
# Initialize Perry UI in this directory
bunx perry-ui init

# Add required components
bunx perry-ui add button card label input checkbox dialog
```

## What Changed

Previously these were code examples only. Now they're **runnable apps** you can:
- Run locally with `bun run dev`
- Modify and experiment with
- Use as templates for your own apps

## To Build Your Own Perry App

```bash
# Initialize a new Perry project
mkdir my-app && cd my-app
bunx perry init

# Add Perry UI components
bunx perry-ui add button card input

# Run your app
bun run dev
```

See the [Tutorial](https://perry-ui.com/docs/tutorial) for a complete guide.

