import { readFileSync, readdirSync, existsSync } from "fs"
import { join, resolve } from "path"
import type { RegistryRoot, RegistryItemSummary, RegistryItem } from "../../../packages/registry/types"

const REGISTRY_DIR = resolve(process.cwd(), "../../packages/registry")
const DIST_DIR = resolve(process.cwd(), "../../dist")

function readJSON<T>(path: string): T {
  return JSON.parse(readFileSync(path, "utf-8"))
}

function resolvePath(...segments: string[]): string {
  const distPath = join(DIST_DIR, ...segments)
  if (existsSync(distPath)) return distPath
  return join(REGISTRY_DIR, ...segments)
}

// Re-export types from canonical source
export type { RegistryRoot, RegistryItemSummary, RegistryItem }

export function getRootRegistry(): RegistryRoot {
  return readJSON<RegistryRoot>(resolvePath("registry.json"))
}

export function getComponentNames(): string[] {
  const dir = resolvePath("components")
  if (!existsSync(dir)) return []
  return readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
}

export function getComponent(name: string): RegistryItem {
  return readJSON<RegistryItem>(resolvePath("components", name, "registry.json"))
}

export function getAllComponents(): RegistryItem[] {
  return getComponentNames().map((name) => getComponent(name))
}

export function getBlockNames(): string[] {
  const dir = resolvePath("blocks")
  if (!existsSync(dir)) return []
  return readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
}

export function getBlock(name: string): RegistryItem {
  return readJSON<RegistryItem>(resolvePath("blocks", name, "registry.json"))
}

export function getAllBlocks(): RegistryItem[] {
  return getBlockNames().map((name) => getBlock(name))
}

export function getThemeNames(): string[] {
  const dir = resolvePath("themes")
  if (!existsSync(dir)) return []
  return readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.replace(".json", ""))
}

export function getTheme(name: string) {
  return readJSON<Record<string, unknown>>(resolvePath("themes", `${name}.json`))
}
