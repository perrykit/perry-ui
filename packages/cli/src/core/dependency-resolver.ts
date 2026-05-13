import type { RegistryItem } from "../schemas/registry"
import { fetchItem } from "./registry-client"
import { logger } from "./logger"

/**
 * Recursively resolve registry items and their transitive dependencies.
 * Returns items in topological order (dependencies first).
 */
export async function resolveItems(
  names: string[],
  registryUrl: string
): Promise<RegistryItem[]> {
  const visited = new Set<string>()
  const ordered: RegistryItem[] = []

  async function visit(name: string) {
    if (visited.has(name)) return
    visited.add(name)

    const item = await fetchItem(registryUrl, name)

    // Resolve registry dependencies first (depth-first)
    for (const dep of item.registryDependencies) {
      await visit(dep)
    }

    ordered.push(item)
  }

  for (const name of names) {
    await visit(name)
  }

  return ordered
}

/**
 * Detect circular dependencies in resolved items.
 */
export function detectCircularDeps(items: RegistryItem[]): string[] | null {
  const graph = new Map<string, string[]>()
  for (const item of items) {
    graph.set(item.name, item.registryDependencies)
  }

  const visiting = new Set<string>()
  const visited = new Set<string>()
  const cycle: string[] = []

  function dfs(name: string): boolean {
    if (visited.has(name)) return false
    if (visiting.has(name)) return true // cycle detected

    visiting.add(name)
    const deps = graph.get(name) || []
    for (const dep of deps) {
      if (dfs(dep)) {
        cycle.push(name)
        return true
      }
    }
    visiting.delete(name)
    visited.add(name)
    return false
  }

  for (const item of items) {
    if (dfs(item.name)) {
      return cycle.length > 0 ? cycle : null
    }
  }

  return null
}
