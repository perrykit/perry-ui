# Counter Example

A simple counter app demonstrating Perry UI components.

## What It Demonstrates

- **Button** component with 3 variants (default, secondary, destructive)
- **Card** component for layout grouping
- **Label** component for text display
- **VStack** for vertical layout
- State management with simple variables

## Code Overview

This example shows:
```typescript
// Button with different variants
Button({ children: "Increment", variant: "default" })
Button({ children: "Decrement", variant: "secondary" })
Button({ children: "Reset", variant: "destructive" })

// Card for grouping
Card({
  children: [
    { type: "header", content: "Counter" },
    { type: "content", content: displayValue }
  ]
})

// Label for text display
Label({ children: count.toString() })
```

## How to Use This Example

This is a **code example** demonstrating component usage patterns:

1. **Read the source code** in `src/main.ts`
2. **See component imports** and usage patterns
3. **Copy patterns** to your own Perry project

**Note:** This is not a runnable app — it's example code showing how to use Perry UI components.

## Components Demonstrated

- `Button` — Clickable actions with variants
- `Card` — Container components for layout
- `Label` — Styled text display
- `VStack` — Vertical layout container

## Customize

Try changing:
- Button variants (outline, ghost, link)
- Button sizes (sm, md, lg, icon)
- Card styling and layout
- Add more counters or features

## Learn More

- [Components Documentation](https://perry-ui.com/components)
- [Getting Started Guide](https://perry-ui.com/docs/getting-started)
- [Tutorial](https://perry-ui.com/docs/tutorial)

