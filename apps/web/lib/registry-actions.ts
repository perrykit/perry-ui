"use server"

import { readJSON, resolvePath } from "@/lib/registry-utils"
import type { RegistryRoot, RegistryItem } from "../../../packages/registry/types"

// Cache the registry in module scope to avoid re-reading from disk on every call
let cachedRegistry: RegistryRoot | null = null
let cacheTime = 0
const CACHE_TTL = 60_000 // 1 minute

function getRegistry(): RegistryRoot {
  const now = Date.now()
  if (cachedRegistry && now - cacheTime < CACHE_TTL) return cachedRegistry
  cachedRegistry = readJSON<RegistryRoot>(resolvePath("registry.json"))
  cacheTime = now
  return cachedRegistry
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
  const registry = getRegistry()

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
