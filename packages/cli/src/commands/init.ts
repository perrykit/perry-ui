import { existsSync, readFileSync, writeFileSync, mkdirSync } from "fs"
import { join, dirname, resolve } from "path"
import { fileURLToPath } from "url"
import { logger } from "../core/logger"
import { confirm, select } from "../core/prompts"
import { detectProject } from "../core/project-detect"
import { DEFAULT_CONFIG, type PerryUIConfig } from "../schemas/config"

// Resolve core source directory — reads from @perrykit/core workspace package
const __dirname = dirname(fileURLToPath(import.meta.url))
const CORE_SRC_DIR = resolve(__dirname, "../../../core/src")

const CORE_FILES = [
  "tokens.ts",
  "theme.ts",
  "variants.ts",
  "platform.ts",
  "compose.ts",
  "accessibility.ts",
  "compat.ts",
] as const

function readCoreFile(filename: string): string {
  const filePath = join(CORE_SRC_DIR, filename)
  if (!existsSync(filePath)) {
    logger.warn(`Core file not found at ${filePath} — falling back to embedded template`)
    return CORE_FALLBACKS[filename] ?? `// ${filename} — source not found`
  }
  return readFileSync(filePath, "utf-8")
}

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

  // Write core helper files — read from workspace @perrykit/core
  for (const filename of CORE_FILES) {
    const filePath = join(cwd, config.paths.lib, filename)
    if (!existsSync(filePath) || options.yes) {
      mkdirSync(join(cwd, config.paths.lib), { recursive: true })
      writeFileSync(filePath, readCoreFile(filename), "utf-8")
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

// ── Fallback templates (only used when core workspace is unavailable) ──

const CORE_FALLBACKS: Record<string, string> = {
  "tokens.ts": `export type Color = { r: number; g: number; b: number; a: number }
export type ColorTokens = {
  background: Color; foreground: Color; card: Color; cardForeground: Color
  popover: Color; popoverForeground: Color; primary: Color; primaryForeground: Color
  secondary: Color; secondaryForeground: Color; muted: Color; mutedForeground: Color
  accent: Color; accentForeground: Color; destructive: Color; destructiveForeground: Color
  border: Color; input: Color; ring: Color
}
export type RadiusTokens = { none: number; sm: number; md: number; lg: number; xl: number; full: number }
export type SpacingTokens = Record<"0"|"1"|"2"|"3"|"4"|"5"|"6"|"8"|"10"|"12", number>
export type TypographyTokens = { fontFamily: string; xs: number; sm: number; base: number; lg: number; xl: number; xxl: number }
export type BorderTokens = { thin: number; medium: number }
export type ShadowValue = { x: number; y: number; blur: number; opacity: number }
export type ShadowTokens = { none: ShadowValue|null; sm: ShadowValue; md: ShadowValue }
export type DurationTokens = { fast: number; normal: number; slow: number }
export type ThemeTokens = { color: ColorTokens; radius: RadiusTokens; spacing: SpacingTokens; typography: TypographyTokens; border: BorderTokens; shadow: ShadowTokens; duration: DurationTokens }
`,
  "theme.ts": `import type { Color, ThemeTokens } from "./tokens"
let _theme: ThemeTokens | null = null
export function useTheme(): ThemeTokens { return _theme! }
export function setTheme(t: ThemeTokens): void { _theme = t }
export function hexToColor(hex: string): Color {
  const h = hex.replace("#","")
  return { r: parseInt(h.substring(0,2),16)/255, g: parseInt(h.substring(2,4),16)/255, b: parseInt(h.substring(4,6),16)/255, a: h.length===8?parseInt(h.substring(6,8),16)/255:1 }
}
export function rgb(r:number,g:number,b:number,a=1):Color{ return{r:r/255,g:g/255,b:b/255,a} }
`,
}
