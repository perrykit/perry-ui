import { existsSync, readFileSync } from "fs"
import { join } from "path"
import type { PerryUIConfig } from "../schemas/config"
import { PerryUIConfigSchema } from "../schemas/config"
import { logger } from "./logger"

export function findConfig(cwd: string): PerryUIConfig | null {
  const configPath = join(cwd, "perry-ui.json")
  if (!existsSync(configPath)) return null

  try {
    const raw = JSON.parse(readFileSync(configPath, "utf-8"))
    return PerryUIConfigSchema.parse(raw)
  } catch (e) {
    logger.error(`Invalid perry-ui.json: ${(e as Error).message}`)
    return null
  }
}

export function requireConfig(cwd: string): PerryUIConfig {
  const config = findConfig(cwd)
  if (!config) {
    logger.error("No perry-ui.json found. Run `perry-ui init` first.")
    process.exit(1)
  }
  return config
}

export function detectProject(cwd: string): {
  hasPackageJson: boolean
  hasTsconfig: boolean
  isPerryProject: boolean
} {
  return {
    hasPackageJson: existsSync(join(cwd, "package.json")),
    hasTsconfig: existsSync(join(cwd, "tsconfig.json")),
    isPerryProject: existsSync(join(cwd, "package.json")) &&
      (() => {
        try {
          const pkg = JSON.parse(readFileSync(join(cwd, "package.json"), "utf-8"))
          return !!(pkg.dependencies?.["perry"] || pkg.devDependencies?.["perry"])
        } catch { return false }
      })(),
  }
}
