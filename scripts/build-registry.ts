/**
 * Registry Builder
 *
 * Validates registry, inlines source file content, and emits
 * static registry JSON files to dist/.
 */

import { readdirSync, readFileSync, writeFileSync, existsSync, mkdirSync, copyFileSync, cpSync } from "fs"
import { join, resolve } from "path"

const ROOT = resolve(__dirname, "..")
const REGISTRY_DIR = join(ROOT, "packages", "registry")
const DIST_DIR = join(ROOT, "dist")

console.log("Perry UI Registry Builder\n")

// ── Ensure dist exists ─────────────────────────────────────────────────

mkdirSync(DIST_DIR, { recursive: true })
mkdirSync(join(DIST_DIR, "components"), { recursive: true })
mkdirSync(join(DIST_DIR, "blocks"), { recursive: true })
mkdirSync(join(DIST_DIR, "themes"), { recursive: true })
mkdirSync(join(DIST_DIR, "r"), { recursive: true })

// ── Helpers ────────────────────────────────────────────────────────────

function readJSON<T>(filePath: string): T {
  try {
    return JSON.parse(readFileSync(filePath, "utf-8"))
  } catch (err) {
    console.error(`  ERROR: Failed to parse ${filePath}: ${err instanceof Error ? err.message : err}`)
    throw err
  }
}

// ── Read root registry ─────────────────────────────────────────────────

const rootRegistry = readJSON<{ items?: unknown[] } & Record<string, unknown>>(join(REGISTRY_DIR, "registry.json"))
const items: Array<Record<string, unknown>> = []

// ── Process Themes ─────────────────────────────────────────────────────

const themesDir = join(REGISTRY_DIR, "themes")
if (existsSync(themesDir)) {
  const themeFiles = readdirSync(themesDir).filter((f) => f.endsWith(".json"))
  console.log(`Themes: ${themeFiles.length}`)

  for (const file of themeFiles) {
    const themeData = readJSON<Record<string, unknown>>(join(themesDir, file))
    const themeName = (themeData.name as string) || file.replace(".json", "")

    // Copy theme to dist
    copyFileSync(join(themesDir, file), join(DIST_DIR, "themes", file))

    // Add to registry items
    items.push({
      name: themeName,
      type: "theme",
      title: themeData.title || themeName,
      description: themeData.description || "",
      categories: ["themes"],
      dependencies: [],
      files: [`themes/${file}`],
      url: `/r/themes/${file}`,
    })

    console.log(`  ${themeName}`)
  }
}

// ── Process Components ─────────────────────────────────────────────────

const componentsDir = join(REGISTRY_DIR, "components")
if (existsSync(componentsDir)) {
  const componentDirs = readdirSync(componentsDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)

  console.log(`\nComponents: ${componentDirs.length}`)

  for (const dir of componentDirs) {
    const regPath = join(componentsDir, dir, "registry.json")
    if (!existsSync(regPath)) continue

    let item: Record<string, unknown>
    try {
      item = readJSON<Record<string, unknown>>(regPath)
    } catch {
      console.warn(`  SKIP: ${dir} (invalid registry.json)`)
      continue
    }

    // Inline source file content
    const files = item.files as Array<Record<string, unknown>> | undefined
    if (files && Array.isArray(files)) {
      for (const file of files) {
        if (file.sourcePath) {
          const sourceFullPath = join(componentsDir, dir, file.sourcePath as string)
          if (existsSync(sourceFullPath)) {
            file.content = readFileSync(sourceFullPath, "utf-8")
          } else {
            console.warn(`  WARN: Missing source file for ${dir}: ${file.sourcePath}`)
          }
        }
      }
    }

    // Write to dist
    const componentDir = join(DIST_DIR, "components", dir)
    mkdirSync(componentDir, { recursive: true })
    writeFileSync(join(componentDir, "registry.json"), JSON.stringify(item, null, 2))

    // Add summary to root items
    items.push({
      name: item.name,
      type: item.type,
      title: item.title,
      description: item.description,
      categories: ["components", ...((item.categories as string[]) || [])],
      dependencies: item.dependencies || [],
      files: (files || []).map((f: Record<string, unknown>) => f.target),
      url: `/r/components/${dir}/registry.json`,
    })

    console.log(`  ${item.name}`)
  }
}

// ── Process Blocks ─────────────────────────────────────────────────────

const blocksDir = join(REGISTRY_DIR, "blocks")
if (existsSync(blocksDir)) {
  const blockDirs = readdirSync(blocksDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)

  console.log(`\nBlocks: ${blockDirs.length}`)

  for (const dir of blockDirs) {
    const regPath = join(blocksDir, dir, "registry.json")
    if (!existsSync(regPath)) continue

    let item: Record<string, unknown>
    try {
      item = readJSON<Record<string, unknown>>(regPath)
    } catch {
      console.warn(`  SKIP: ${dir} (invalid registry.json)`)
      continue
    }

    // Inline source file content
    const files = item.files as Array<Record<string, unknown>> | undefined
    if (files && Array.isArray(files)) {
      for (const file of files) {
        if (file.sourcePath) {
          const sourceFullPath = join(blocksDir, dir, file.sourcePath as string)
          if (existsSync(sourceFullPath)) {
            file.content = readFileSync(sourceFullPath, "utf-8")
          } else {
            console.warn(`  WARN: Missing source file for ${dir}: ${file.sourcePath}`)
          }
        }
      }
    }

    // Write to dist
    const blockDistDir = join(DIST_DIR, "blocks", dir)
    mkdirSync(blockDistDir, { recursive: true })
    writeFileSync(join(blockDistDir, "registry.json"), JSON.stringify(item, null, 2))

    items.push({
      name: item.name,
      type: item.type,
      title: item.title,
      description: item.description,
      categories: ["blocks"],
      dependencies: item.registryDependencies || [],
      files: (files || []).map((f: Record<string, unknown>) => f.target),
      url: `/r/blocks/${dir}/registry.json`,
    })

    console.log(`  ${item.name}`)
  }
}

// ── Write updated root registry ────────────────────────────────────────

rootRegistry.items = items
writeFileSync(join(DIST_DIR, "registry.json"), JSON.stringify(rootRegistry, null, 2))

// Backup source registry before overwriting (for dev:web compat)
const sourceRegistryPath = join(REGISTRY_DIR, "registry.json")
const backupPath = join(REGISTRY_DIR, "registry.json.bak")
copyFileSync(sourceRegistryPath, backupPath)
writeFileSync(sourceRegistryPath, JSON.stringify(rootRegistry, null, 2))

// ── Mirror dist/ into dist/r/ for URL paths (/r/registry.json, etc.) ───

const rDir = join(DIST_DIR, "r")
mkdirSync(rDir, { recursive: true })
cpSync(join(DIST_DIR, "registry.json"), join(rDir, "registry.json"))
cpSync(join(DIST_DIR, "components"), join(rDir, "components"), { recursive: true })
cpSync(join(DIST_DIR, "blocks"), join(rDir, "blocks"), { recursive: true })
cpSync(join(DIST_DIR, "themes"), join(rDir, "themes"), { recursive: true })

console.log(`\nRegistry built: ${items.length} items → dist/ + packages/registry/`)
