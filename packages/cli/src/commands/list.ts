import { logger } from "../core/logger"
import { fetchRegistry } from "../core/registry-client"
import { findConfig } from "../core/project-detect"
import { existsSync } from "fs"
import { join } from "path"

export async function list(
  cwd: string,
  options: { type?: string; installed?: boolean; registry?: string } = {}
) {
  const config = findConfig(cwd)
  const registryUrl = options.registry ?? config?.registry ?? "https://registry.perry-ui.com/r/registry.json"

  const registry = await fetchRegistry(registryUrl)

  let items = registry.items

  // Filter by type
  if (options.type) {
    items = items.filter((i) => i.type === options.type)
  }

  // Filter to installed only
  if (options.installed && config) {
    items = items.filter((i) => {
      // Check if any of the item's target files exist
      return i.files.some((f) => existsSync(join(cwd, f)))
    })
  }

  // Group by type
  const groups = new Map<string, typeof items>()
  for (const item of items) {
    const group = groups.get(item.type) || []
    group.push(item)
    groups.set(item.type, group)
  }

  logger.heading("Perry UI Registry")

  const typeOrder: Array<{ type: string; label: string }> = [
    { type: "component", label: "Components" },
    { type: "block", label: "Blocks" },
    { type: "theme", label: "Themes" },
    { type: "utility", label: "Utilities" },
    { type: "template", label: "Templates" },
  ]

  for (const { type, label } of typeOrder) {
    const group = groups.get(type)
    if (!group || group.length === 0) continue

    logger.bold(`  ${label} (${group.length})`)
    for (const item of group) {
      const installed = options.installed ? "" : (config && item.files.some((f) => existsSync(join(cwd, f))) ? " [installed]" : "")
      logger.dim(`    ${item.name.padEnd(20)} ${item.description}${installed}`)
    }
    logger.newline()
  }

  logger.dim(`  Total: ${items.length} items`)
}
