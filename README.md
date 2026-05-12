# Perry UI

Beautiful native UI for Perry.

## What is this?

Perry UI is a shadcn-style component registry for Perry native TypeScript apps. It provides copy-paste components, blocks, themes, and a CLI for building beautiful native applications.

## Quick Start

```bash
bunx perry-ui init
bunx perry-ui add button card input dialog
```

## Repository Structure

```
packages/
  core/          → Token types, theme system, variant resolver, platform adapter
  registry/      → Component source files, registry metadata, themes, blocks

scripts/         → Registry build, validation, and agent manifest generation
docs/            → Perry framework API documentation
```

## Commands

```bash
bun install                    # Install dependencies
bun run validate:registry      # Validate all registry items
bun run build:registry         # Build registry to dist/
bun run typecheck              # TypeScript type checking
```

## Components

| Component | Description |
|---|---|
| Alert | Alert message with title/description |
| Avatar | User avatar with image or initials fallback |
| Badge | Status indicator with variants |
| Button | Native button with variants and sizes |
| Card | Container with header, content, footer |
| Checkbox | Boolean selection control with label |
| Dialog | Modal overlay with header, content, footer |
| Input | Styled text input with error state |
| Label | Styled text label |
| Progress | Horizontal progress bar with label |
| Radio | Mutually exclusive option group |
| Select | Native dropdown using Perry's Picker |
| Separator | Horizontal/vertical divider |
| Sheet | Sliding panel overlay (left/right/top/bottom) |
| Skeleton | Loading placeholder with shape variants |
| Switch | Toggle control for immediate settings |
| Tabs | Tab navigation with content panels |
| Textarea | Multiline text input with error state |
| Toast | Notification with auto-dismiss and variants |
| Tooltip | Hover tooltip for contextual information |

## Blocks

| Block | Description |
|---|---|
| settings-window | Complete settings window with toggles, inputs, and actions |

## Themes

- **zinc** (default) — Neutral zinc palette
- **slate** — Cool blue-gray slate
- **neutral** — Pure neutral gray
- **graphite** — Warm dark graphite
- **midnight** — Deep dark blue-black

## Why not a normal package?

You own the component source. The CLI copies files into your project so you can customize freely.

## License

MIT
