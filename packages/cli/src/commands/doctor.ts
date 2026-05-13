import { existsSync } from "fs"
import { join } from "path"
import { logger } from "../core/logger"
import { findConfig, detectProject } from "../core/project-detect"

export async function doctor(cwd: string, options: { registry?: string } = {}) {
  logger.heading("Perry UI Doctor")
  let warnings = 0
  let errors = 0

  // 1. Perry installed
  try {
    const proc = Bun.spawn(["perry", "--version"], { stdout: "pipe", stderr: "pipe" })
    await proc.exited
    if (proc.exitCode === 0) {
      logger.success("perry found")
    } else {
      warnings++
      logger.warn("perry not found in PATH")
    }
  } catch {
    warnings++
    logger.warn("perry not found in PATH (install from https://perryts.com)")
  }

  // 2. Project config
  const config = findConfig(cwd)
  if (config) {
    logger.success("perry-ui.json found")
  } else {
    errors++
    logger.error("perry-ui.json not found (run `perry-ui init`)")
  }

  // 3. Registry reachable
  const registryUrl = options.registry ?? config?.registry ?? "https://perry-ui.dev/r/registry.json"
  if (registryUrl.startsWith("http")) {
    try {
      const res = await fetch(registryUrl, { method: "HEAD" })
      if (res.ok) {
        logger.success(`registry reachable: ${registryUrl}`)
      } else {
        errors++
        logger.error(`registry returned ${res.status}: ${registryUrl}`)
      }
    } catch (e) {
      warnings++
      logger.warn(`registry not reachable: ${(e as Error).message}`)
    }
  } else {
    const absPath = join(cwd, registryUrl)
    if (existsSync(absPath)) {
      logger.success(`local registry found: ${registryUrl}`)
    } else {
      errors++
      logger.error(`local registry not found: ${registryUrl}`)
    }
  }

  // 4. Required directories
  if (config) {
    const dirs = [
      { path: config.paths.components, label: "components" },
      { path: config.paths.ui, label: "ui components" },
      { path: config.paths.lib, label: "lib/perry-ui" },
    ]

    for (const dir of dirs) {
      const fullPath = join(cwd, dir.path)
      if (existsSync(fullPath)) {
        logger.success(`${dir.label} directory exists`)
      } else {
        warnings++
        logger.warn(`${dir.label} directory missing: ${dir.path}`)
      }
    }

    // 5. Core helpers
    const coreFiles = ["tokens.ts", "theme.ts", "variants.ts", "platform.ts", "compose.ts", "compat.ts"]
    const libDir = join(cwd, config.paths.lib)
    const missingCore = coreFiles.filter((f) => !existsSync(join(libDir, f)))

    if (missingCore.length === 0) {
      logger.success("core helpers present")
    } else {
      warnings++
      logger.warn(`core helpers missing: ${missingCore.join(", ")}`)
      logger.dim(`  Run \`perry-ui init\` to install core helpers`)
    }

    // 6. tsconfig path aliases
    const project = detectProject(cwd)
    if (project.hasTsconfig) {
      try {
        const tsconfig = JSON.parse(
          await Bun.file(join(cwd, "tsconfig.json")).text()
        )
        const paths = tsconfig.compilerOptions?.paths ?? {}
        const expectedAliases = [
          [`${config.aliases.components}/*`, `${config.paths.components}/*`],
          [`${config.aliases.lib}/*`, `${config.paths.lib}/*`],
        ]

        for (const [alias, target] of expectedAliases) {
          if (paths[alias]) {
            logger.success(`tsconfig alias "${alias}" configured`)
          } else {
            warnings++
            logger.warn(`tsconfig alias "${alias}" not configured`)
            logger.dim(`  Add to tsconfig.json paths: "${alias}": ["${target}"]`)
          }
        }
      } catch {
        warnings++
        logger.warn("Could not read tsconfig.json")
      }
    }
  }

  // Summary
  logger.newline()
  logger.heading("Summary:")
  if (errors === 0 && warnings === 0) {
    logger.success("All checks passed!")
  } else {
    if (errors > 0) logger.error(`${errors} error(s) found`)
    if (warnings > 0) logger.warn(`${warnings} warning(s) found`)
  }
}
