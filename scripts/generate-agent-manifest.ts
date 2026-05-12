/**
 * Agent Manifest Generator
 *
 * Generates agent-manifest.json from registry items.
 * This file is designed for AI agents to understand available components.
 */

import { readFileSync, writeFileSync, existsSync, readdirSync } from "fs"
import { join, resolve } from "path"

const ROOT = resolve(__dirname, "..")
const REGISTRY_DIR = join(ROOT, "packages", "registry")
const DIST_DIR = join(ROOT, "dist")

interface AgentComponent {
  name: string
  import: string
  purpose: string
  props: Array<{ name: string; type: string; description: string }>
  examples: string[]
  useWhen: string[]
  avoidWhen: string[]
}

interface AgentManifest {
  name: string
  version: string
  instructions: string[]
  constraints: string[]
  components: AgentComponent[]
}

const manifest: AgentManifest = {
  name: "Perry UI",
  version: "0.1.0",
  instructions: [
    "Use Perry-native function components from src/components/ui.",
    "Do not use React, JSX, DOM APIs, CSS, className, Radix, MUI, or Tailwind in Perry app source.",
    "Use tokens and variants from src/lib/perry-ui.",
    "Prefer installed Perry UI components over creating one-off styling.",
    "Use blocks for full screens and layouts.",
    "Check platform notes before using advanced components.",
    "All widget imports come from 'perry/ui'.",
    "All styling helpers come from 'perry-styling' or local platform.ts shim.",
    "Widgets are opaque handles — use free functions to modify them.",
  ],
  constraints: [
    "No React or JSX in Perry component files.",
    "No browser DOM APIs (document, window, etc.).",
    "No CSS or Tailwind class strings.",
    "No npm packages that depend on a browser runtime.",
    "Component source must be valid TypeScript compiling against perry/ui.",
  ],
  components: [],
}

// ── Collect component metadata ─────────────────────────────────────────

const componentsDir = join(REGISTRY_DIR, "components")
if (existsSync(componentsDir)) {
  const dirs = readdirSync(componentsDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)

  for (const dir of dirs) {
    const regPath = join(componentsDir, dir, "registry.json")
    if (!existsSync(regPath)) continue

    const item = JSON.parse(readFileSync(regPath, "utf-8"))

    manifest.components.push({
      name: item.name,
      import: `import { ${item.title} } from "@/components/ui/${item.name}"`,
      purpose: item.description || item.docs?.overview || "",
      props: (item.props || []).map((p: { name: string; type: string; description: string }) => ({
        name: p.name,
        type: p.type,
        description: p.description,
      })),
      examples: (item.examples || []).map((e: { code: string }) => e.code),
      useWhen: item.agent?.useWhen || [],
      avoidWhen: item.agent?.doNotUseWhen || [],
    })
  }
}

// ── Write manifest ─────────────────────────────────────────────────────

if (!existsSync(DIST_DIR)) {
  const { mkdirSync } = await import("fs")
  mkdirSync(DIST_DIR, { recursive: true })
}

writeFileSync(join(DIST_DIR, "agent-manifest.json"), JSON.stringify(manifest, null, 2))
console.log(`Agent manifest generated: ${manifest.components.length} components`)
