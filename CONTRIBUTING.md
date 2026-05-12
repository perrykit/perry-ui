# Contributing to Perry UI

Thanks for your interest in contributing! This guide covers the basics.

## Repositories

| Repo | Purpose |
|------|---------|
| `perry-ui` | Registry, core helpers, components, blocks, themes |
| `perry-ui-cli` | CLI tool (published as `perry-ui` on npm) |
| `perry-ui-docs` | Documentation website (Next.js) |
| `perry-ui-examples` | Example Perry applications |

## Setup

```bash
git clone https://github.com/perry-ui/perry-ui.git
cd perry-ui
bun install
```

## Adding a Component

1. Create `packages/registry/components/your-component/`
2. Write the component in `files/your-component.ts`
   - Import only from `"perry/ui"` and `"@/lib/perry-ui/*"`
   - Use `createVariants()` for style variations
   - Use `applyStyles()` from platform.ts — never call Perry APIs directly
3. Create `registry.json` with full metadata (props, variants, examples, docs, agent)
4. Add at least one example in `examples/`
5. Validate: `bun run validate:registry`
6. Build: `bun run build:registry`

## Component Guidelines

- Keep files under 150 lines
- Export a Props type
- Include platform notes for platform-specific behavior
- Fill in all agent metadata fields (summary, useWhen, commonCombinations)
- Set `registryDependencies` only for other registry items, not core helpers

## Development Commands

```bash
bun run validate:registry   # Validate all registry items
bun run build:registry      # Validate + inline sources + emit dist/
bun run typecheck           # TypeScript type checking
bun run lint                # Lint check
```

## Pull Requests

- Keep PRs focused on a single change
- Run `bun run validate:registry` before pushing
- Add tests for new functionality
- Update registry metadata for component changes

## Code Style

- TypeScript strict mode
- No external dependencies in components (only `"perry/ui"` and local helpers)
- Follow existing patterns in the codebase

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
