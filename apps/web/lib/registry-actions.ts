"use server"

import { readFileSync, existsSync } from "fs"
import { join, resolve } from "path"
import type { RegistryRoot, RegistryItem } from "../../../packages/registry/types"

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

// Server action to get root registry for client components
export async function getRootRegistryAction(): Promise<RegistryRoot> {
  return readJSON<RegistryRoot>(resolvePath("registry.json"))
}

// Server action to get a specific component for client components
export async function getComponentAction(name: string): Promise<RegistryItem | null> {
  try {
    return readJSON<RegistryItem>(resolvePath("components", name, "registry.json"))
  } catch {
    return null
  }
}

// Server action to search registry items for the search bar
export async function searchRegistryAction(query: string) {
  const registry = readJSON<RegistryRoot>(resolvePath("registry.json"))

  if (!query.trim()) return []

  const q = query.toLowerCase()
  return registry.items.filter((item) => {
    const matchName = item.name.toLowerCase().includes(q)
    const matchTitle = item.title?.toLowerCase().includes(q)
    const matchDesc = item.description?.toLowerCase().includes(q)
    const matchType = item.type?.toLowerCase().includes(q)

    return matchName || matchTitle || matchDesc || matchType
  }).slice(0, 8)
}
