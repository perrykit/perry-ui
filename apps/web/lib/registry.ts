import { readdirSync, existsSync } from "fs"
import { join } from "path"
import { readJSON, resolvePath } from "@/lib/registry-utils"
import type { RegistryRoot, RegistryItemSummary, RegistryItem } from "../../../packages/registry/types"

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
