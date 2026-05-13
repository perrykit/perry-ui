import { logger } from "../core/logger"
import { requireConfig } from "../core/project-detect"
import { fetchRegistry, fetchItem } from "../core/registry-client"
import { resolveItems } from "../core/dependency-resolver"
import { writeFiles } from "../core/file-writer"
import type { PerryUIConfig } from "../schemas/config"

export async function add(
  cwd: string,
  itemNames: string[],
  options: {
    overwrite?: boolean
    dryRun?: boolean
    yes?: boolean
    registry?: string
    cwd?: string
  } = {}
) {
  if (itemNames.length === 0) {
    logger.error("No items specified. Usage: perry-ui add <item...>")
    process.exit(1)
  }

  const targetCwd = options.cwd ?? cwd
  const config = requireConfig(targetCwd)
  const registryUrl = options.registry ?? config.registry

  logger.heading(`Installing ${itemNames.length} item(s)...`)

  // Fetch registry to validate item names
  await fetchRegistry(registryUrl)

  // Resolve all items with dependencies (topological order)
  const resolved = await resolveItems(itemNames, registryUrl)

  logger.newline()
  logger.info(`Resolved ${resolved.length} item(s) (including dependencies):`)
  for (const item of resolved) {
    const deps = item.registryDependencies.length > 0
      ? ` (deps: ${item.registryDependencies.join(", ")})`
      : ""
    logger.step(`${item.name} [${item.type}]${deps}`)
  }
  logger.newline()

  // Collect all files to write
  const filesToWrite: Array<{ target: string; content: string; overwrite?: string }> = []

  for (const item of resolved) {
    for (const file of item.files) {
      const content = file.content ?? ""
      if (!content && !file.sourcePath) {
        logger.warn(`No content for ${file.target} in ${item.name}`)
        continue
      }
      filesToWrite.push({
        target: file.target,
        content,
        overwrite: file.overwrite,
      })
    }
  }

  // Write all files
  const results = await writeFiles(filesToWrite, targetCwd, {
    overwrite: options.overwrite,
    dryRun: options.dryRun,
    yes: options.yes,
  })

  // Print summary
  const created = results.filter((r) => r.status === "created").length
  const overwritten = results.filter((r) => r.status === "overwritten").length
  const skipped = results.filter((r) => r.status === "skipped").length

  logger.newline()
  logger.heading("Summary:")
  if (created > 0) logger.success(`${created} file(s) created`)
  if (overwritten > 0) logger.step(`${overwritten} file(s) overwritten`)
  if (skipped > 0) logger.warn(`${skipped} file(s) skipped`)

  // Print usage for each requested item
  logger.newline()
  logger.heading("Usage:")
  for (const name of itemNames) {
    const item = resolved.find((r) => r.name === name)
    if (item) {
      const title = item.title
      logger.dim(`  import { ${title} } from "${config.aliases.ui}/${name}"`)
    }
  }

  logger.newline()
  logger.dim("  Run `perry-ui doctor` to verify your setup.")
}
