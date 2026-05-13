import { existsSync, mkdirSync, writeFileSync, readFileSync } from "fs"
import { dirname, join } from "path"
import { logger } from "./logger"
import { confirm } from "./prompts"

export type FileWriteResult = "created" | "skipped" | "overwritten" | "conflict"

export interface WriteResult {
  path: string
  status: FileWriteResult
}

export async function writeFiles(
  files: Array<{ target: string; content: string; overwrite?: string }>,
  cwd: string,
  options: { overwrite?: boolean; dryRun?: boolean; yes?: boolean } = {}
): Promise<WriteResult[]> {
  const results: WriteResult[] = []

  for (const file of files) {
    const fullPath = join(cwd, file.target)
    const exists = existsSync(fullPath)

    if (options.dryRun) {
      results.push({
        path: file.target,
        status: exists ? "skipped" : "created",
      })
      logger.dim(`  Would ${exists ? "overwrite" : "create"}: ${file.target}`)
      continue
    }

    if (exists && !options.overwrite) {
      // Check overwrite preference
      const pref = file.overwrite ?? "prompt"
      if (pref === "never") {
        logger.warn(`  Skipped (exists): ${file.target}`)
        results.push({ path: file.target, status: "skipped" })
        continue
      }
      if (pref === "prompt" && !options.yes) {
        const shouldOverwrite = await confirm(
          `  Overwrite ${file.target}?`,
          false
        )
        if (!shouldOverwrite) {
          logger.dim(`  Skipped: ${file.target}`)
          results.push({ path: file.target, status: "skipped" })
          continue
        }
      }
    }

    // Create parent directories
    mkdirSync(dirname(fullPath), { recursive: true })

    // Write file
    writeFileSync(fullPath, file.content, "utf-8")

    const status: FileWriteResult = exists ? "overwritten" : "created"
    results.push({ path: file.target, status })

    if (status === "created") {
      logger.success(`Created: ${file.target}`)
    } else {
      logger.step(`Updated: ${file.target}`)
    }
  }

  return results
}

export function fileExists(cwd: string, relativePath: string): boolean {
  return existsSync(join(cwd, relativePath))
}

export function readFile(cwd: string, relativePath: string): string | null {
  const fullPath = join(cwd, relativePath)
  if (!existsSync(fullPath)) return null
  return readFileSync(fullPath, "utf-8")
}
