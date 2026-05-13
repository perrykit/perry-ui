import { writeFileSync } from "fs"
import { join } from "path"
import { logger } from "../core/logger"
import { requireConfig } from "../core/project-detect"
import { fetchRegistry } from "../core/registry-client"

export async function addTheme(
  cwd: string,
  themeName: string,
  options: { registry?: string } = {}
) {
  const config = requireConfig(cwd)
  const registryUrl = options.registry ?? config.registry

  const registry = await fetchRegistry(registryUrl)

  // Find theme in registry
  const themeItem = registry.items.find(
    (i) => i.type === "theme" && i.name === themeName
  )

  if (!themeItem) {
    const availableThemes = registry.items
      .filter((i) => i.type === "theme")
      .map((i) => i.name)

    logger.error(`Theme "${themeName}" not found.`)
    logger.dim(`Available themes: ${availableThemes.join(", ")}`)
    process.exit(1)
  }

  // Fetch theme data
  let themeData: Record<string, unknown>
  const themeUrl = themeItem.url

  if (registryUrl.startsWith("/") || registryUrl.startsWith("./")) {
    const absPath = join(registryUrl, "..", themeUrl.replace(/^\//, ""))
    themeData = JSON.parse(await Bun.file(absPath).text())
  } else {
    const baseUrl = registry.registryBaseUrl.replace(/\/$/, "")
    const res = await fetch(`${baseUrl}${themeUrl}`)
    if (!res.ok) {
      logger.error(`Failed to fetch theme: ${res.status}`)
      process.exit(1)
    }
    themeData = await res.json() as Record<string, unknown>
  }

  // Write theme to lib/theme.ts (or a theme file)
  const themeFilePath = join(cwd, config.paths.lib, "theme.json")
  writeFileSync(themeFilePath, JSON.stringify(themeData, null, 2), "utf-8")
  logger.success(`Theme "${themeName}" saved to ${config.paths.lib}/theme.json`)

  // Update config
  config.theme = themeName
  const configPath = join(cwd, "perry-ui.json")
  writeFileSync(configPath, JSON.stringify(config, null, 2), "utf-8")
  logger.success(`Updated perry-ui.json (theme: ${themeName})`)

  logger.newline()
  logger.info(`Theme "${themeName}" is now active.`)
}
