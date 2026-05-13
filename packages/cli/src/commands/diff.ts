import { existsSync } from "fs"
import { join } from "path"
import { logger } from "../core/logger"
import { requireConfig } from "../core/project-detect"
import { fetchItem } from "../core/registry-client"
import { readFile } from "../core/file-writer"

export async function diff(
  cwd: string,
  itemName: string,
  options: { registry?: string } = {}
) {
  const config = requireConfig(cwd)
  const registryUrl = options.registry ?? config.registry

  // Fetch the latest registry version
  const item = await fetchItem(registryUrl, itemName)

  for (const file of item.files) {
    const localContent = readFile(cwd, file.target)
    if (localContent === null) {
      logger.warn(`Local file not found: ${file.target}`)
      continue
    }

    const remoteContent = file.content ?? ""
    if (!remoteContent) {
      logger.warn(`No remote content for: ${file.target}`)
      continue
    }

    if (localContent === remoteContent) {
      logger.success(`${file.target}: up to date`)
      continue
    }

    // Show diff
    logger.heading(`Diff for ${file.target}`)
    const localLines = localContent.split("\n")
    const remoteLines = remoteContent.split("\n")

    // Simple line-by-line diff
    const maxLen = Math.max(localLines.length, remoteLines.length)
    let changes = 0

    for (let i = 0; i < maxLen; i++) {
      const local = localLines[i]
      const remote = remoteLines[i]

      if (local === remote) continue

      const lineNum = (i + 1).toString().padStart(4, " ")
      changes++

      if (local === undefined) {
        logger.dim(`${lineNum} + ${remote}`)
      } else if (remote === undefined) {
        logger.dim(`${lineNum} - ${local}`)
      } else {
        logger.dim(`${lineNum} - ${local}`)
        logger.dim(`${lineNum} + ${remote}`)
      }
    }

    if (changes === 0) {
      logger.success(`${file.target}: no differences`)
    } else {
      logger.newline()
      logger.dim(`  ${changes} line(s) changed`)
      logger.dim(`  Run with --overwrite to update, or manually merge.`)
    }
  }
}
