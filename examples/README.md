# Examples

Example apps are generated using the Perry UI CLI.

## Generate an example

```bash
# From the monorepo root
mkdir -p examples/basic-app && cd examples/basic-app

# Initialize
bun run ../../packages/cli/src/index.ts init --yes

# Add components
bun run ../../packages/cli/src/index.ts add button card input label
```

Do not hand-maintain these apps — they exist to validate the CLI works correctly.
