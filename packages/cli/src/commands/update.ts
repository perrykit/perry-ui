import { logger } from "../core/logger"
import { requireConfig } from "../core/project-detect"
import { fetchRegistry, fetchItem } from "../core/registry-client"
import { readFile } from "../core/file-writer"
import { confirm } from "../core/prompts"
import { diff } from "./diff"

export async function update(
  cwd: string,
  itemName?: string,
  options: { registry?: string; yes?: boolean } = {}
) {
  const config = requireConfig(cwd)
  const registryUrl = options.registry ?? config.registry

  const registry = await fetchRegistry(registryUrl)

  if (itemName) {
    // Update specific item
    await updateSingleItem(cwd, itemName, registryUrl, options)
  } else {
    // Check all installed items for updates
    const installed: string[] = []

    for (const item of registry.items) {
      const hasInstalled = item.files.some((f) => {
        const content = readFile(cwd, f)
        return content !== null
      })
      if (hasInstalled) installed.push(item.name)
    }

    if (installed.length === 0) {
      logger.warn("No installed items found.")
      return
    }

    logger.info(`Checking ${installed.length} installed item(s) for updates...`)
    logger.newline()

    for (const name of installed) {
      await updateSingleItem(cwd, name, registryUrl, options)
    }
  }
}

async function updateSingleItem(
  cwd: string,
  name: string,
  registryUrl: string,
  options: { yes?: boolean } = {}
) {
  try {
    const item = await fetchItem(registryUrl, name)
    let hasChanges = false

    for (const file of item.files) {
      const local = readFile(cwd, file.target)
      if (local === null) continue
      if (file.content && local !== file.content) {
        hasChanges = true
        break
      }
    }

    if (!hasChanges) {
      logger.success(`${name}: up to date`)
      return
    }

    logger.warn(`${name}: update available`)

    if (!options.yes) {
      const shouldUpdate = await confirm(`  Show diff for ${name}?`, false)
      if (shouldUpdate) {
        await diff(cwd, name, { registry: registryUrl })
      }
    }

    logger.dim(`  Run \`perry-ui add ${name} --overwrite\` to update`)
  } catch {
    logger.warn(`${name}: could not check for updates`)
  }
}
