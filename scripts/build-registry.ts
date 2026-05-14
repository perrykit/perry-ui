/**
 * Registry Builder
 *
 * Validates registry, inlines source file content, and emits
 * static registry JSON files to dist/.
 */

import { readdirSync, readFileSync, writeFileSync, existsSync, mkdirSync, copyFileSync } from "fs"
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

// ── Read root registry ─────────────────────────────────────────────────

const rootRegistry = JSON.parse(readFileSync(join(REGISTRY_DIR, "registry.json"), "utf-8"))
const items: Array<Record<string, unknown>> = []

// ── Process Themes ─────────────────────────────────────────────────────

const themesDir = join(REGISTRY_DIR, "themes")
if (existsSync(themesDir)) {
  const themeFiles = readdirSync(themesDir).filter((f) => f.endsWith(".json"))
  console.log(`Themes: ${themeFiles.length}`)

  for (const file of themeFiles) {
    const themeData = JSON.parse(readFileSync(join(themesDir, file), "utf-8"))
    const themeName = themeData.name || file.replace(".json", "")

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

    const item = JSON.parse(readFileSync(regPath, "utf-8"))

    // Inline source file content
    if (item.files && Array.isArray(item.files)) {
      for (const file of item.files) {
        if (file.sourcePath) {
          const sourceFullPath = join(componentsDir, dir, file.sourcePath)
          if (existsSync(sourceFullPath)) {
            file.content = readFileSync(sourceFullPath, "utf-8")
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
      categories: ["components", ...(item.categories || [])],
      dependencies: item.dependencies || [],
      files: (item.files || []).map((f: { target: string }) => f.target),
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

    const item = JSON.parse(readFileSync(regPath, "utf-8"))

    // Inline source file content
    if (item.files && Array.isArray(item.files)) {
      for (const file of item.files) {
        if (file.sourcePath) {
          const sourceFullPath = join(blocksDir, dir, file.sourcePath)
          if (existsSync(sourceFullPath)) {
            file.content = readFileSync(sourceFullPath, "utf-8")
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
      files: (item.files || []).map((f: { target: string }) => f.target),
      url: `/r/blocks/${dir}/registry.json`,
    })

    console.log(`  ${item.name}`)
  }
}

// ── Write updated root registry ────────────────────────────────────────

rootRegistry.items = items
writeFileSync(join(DIST_DIR, "registry.json"), JSON.stringify(rootRegistry, null, 2))

// Also write back to source so dev:web works without a prior build
writeFileSync(join(REGISTRY_DIR, "registry.json"), JSON.stringify(rootRegistry, null, 2))

// ── Mirror dist/ into dist/r/ for URL paths (/r/registry.json, etc.) ───
import { cpSync } from "fs"
const rDir = join(DIST_DIR, "r")
mkdirSync(rDir, { recursive: true })
cpSync(join(DIST_DIR, "registry.json"), join(rDir, "registry.json"))
cpSync(join(DIST_DIR, "components"), join(rDir, "components"), { recursive: true })
cpSync(join(DIST_DIR, "blocks"), join(rDir, "blocks"), { recursive: true })
cpSync(join(DIST_DIR, "themes"), join(rDir, "themes"), { recursive: true })

console.log(`\nRegistry built: ${items.length} items → dist/ + packages/registry/`)
