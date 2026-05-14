# Examples

This directory contains example Perry apps demonstrating Perry UI components in action.

## Available Examples

### Counter App (`examples/counter/`)
A simple counter app demonstrating:
- Button component with variants (default, secondary, destructive)
- Card component for layout grouping
- Label component for text display
- VStack for vertical layout
- State management with simple variables

**Files:**
- `src/main.ts` — Counter app implementation
- `README.md` — Detailed explanation

### Todo App (`examples/todo-app/`)
A functional todo app demonstrating:
- Input component for text entry
- Button component for actions
- Checkbox component for completion
- Card component for layout
- Dialog component for confirmations
- State management with TypeScript interfaces

**Files:**
- `src/main.ts` — Todo app implementation
- `README.md` — Detailed explanation

## How to Use These Examples

These are **code examples**, not runnable Perry apps. They demonstrate:
- Component usage patterns
- State management approaches
- TypeScript typing
- Layout patterns

**To learn from these examples:**
1. Read the source code in `src/main.ts`
2. See how components are imported and used
3. Copy patterns to your own Perry project

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

