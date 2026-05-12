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
| Button | Native button with variants and sizes |
| Card | Container with header, content, footer |
| Input | Styled text input field |
| Label | Styled text label |
| Badge | Status indicator with variants |
| Alert | Alert message with title/description |
| Separator | Horizontal/vertical divider |

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
