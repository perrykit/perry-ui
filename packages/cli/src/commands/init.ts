import { existsSync, writeFileSync, mkdirSync } from "fs"
import { join, resolve } from "path"
import { logger } from "../core/logger"
import { confirm, select } from "../core/prompts"
import { detectProject } from "../core/project-detect"
import { DEFAULT_CONFIG, type PerryUIConfig } from "../schemas/config"
import { CORE_SOURCES } from "../core/core-sources"

export async function init(cwd: string, options: { yes?: boolean; registry?: string } = {}) {
  const configPath = join(cwd, "perry-ui.json")

  // Check existing config
  if (existsSync(configPath)) {
    if (!options.yes) {
      const shouldContinue = await confirm("perry-ui.json already exists. Reset?", false)
      if (!shouldContinue) {
        logger.info("Aborted.")
        return
      }
    }
  }

  const project = detectProject(cwd)
  logger.info(`Project detection:`)
  logger.step(`package.json: ${project.hasPackageJson ? "found" : "not found"}`)
  logger.step(`tsconfig.json: ${project.hasTsconfig ? "found" : "not found"}`)
  logger.step(`Perry project: ${project.isPerryProject ? "yes" : "not detected"}`)
  logger.newline()

  // Gather configuration
  const theme = options.yes ? "zinc" : await select(
    "Select a theme:",
    ["zinc", "slate", "neutral", "graphite", "midnight"],
    0
  )

  const registryUrl = options.registry ?? DEFAULT_CONFIG.registry

  const config: PerryUIConfig = {
    ...DEFAULT_CONFIG,
    theme,
    registry: registryUrl,
  }

  // Write config
  writeFileSync(configPath, JSON.stringify(config, null, 2), "utf-8")
  logger.success("Created perry-ui.json")

  // Create directories
  const dirs = [
    config.paths.components,
    config.paths.ui,
    config.paths.blocks,
    config.paths.lib,
  ]

  for (const dir of dirs) {
    const fullPath = join(cwd, dir)
    if (!existsSync(fullPath)) {
      mkdirSync(fullPath, { recursive: true })
      logger.success(`Created ${dir}/`)
    }
  }

  // Write core helper files from embedded sources
  for (const [filename, content] of Object.entries(CORE_SOURCES)) {
    const filePath = join(cwd, config.paths.lib, filename)
    if (!existsSync(filePath) || options.yes) {
      mkdirSync(join(cwd, config.paths.lib), { recursive: true })
      writeFileSync(filePath, content, "utf-8")
      logger.success(`Created ${config.paths.lib}/${filename}`)
    } else {
      logger.dim(`  Exists: ${config.paths.lib}/${filename}`)
    }
  }

  // Write .gitkeep in ui directory
  const gitkeep = join(cwd, config.paths.ui, ".gitkeep")
  if (!existsSync(gitkeep)) {
    writeFileSync(gitkeep, "", "utf-8")
  }

  // Print next steps
  logger.newline()
  logger.heading("Next steps:")
  logger.step("Add components:")
  logger.dim("  bunx perry-ui add button card input")
  logger.step("Add blocks:")
  logger.dim("  bunx perry-ui add block settings-window")
  logger.step("Run doctor to check setup:")
  logger.dim("  bunx perry-ui doctor")
}
