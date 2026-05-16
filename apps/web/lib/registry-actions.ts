"use server"

import { readJSON, resolvePath } from "@/lib/registry-utils"
import type { RegistryRoot, RegistryItem } from "../../../packages/registry/types"

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
