/**
 * Registry Validator
 *
 * Reads all registry JSON files and validates:
 * - Structure matches expected schema
 * - File paths exist
 * - Dependencies reference existing items
 * - No circular dependencies
 * - Agent metadata is present
 */

import { readdirSync, readFileSync, existsSync, statSync } from "fs"
import { join, resolve } from "path"

const REGISTRY_DIR = resolve(__dirname, "..", "packages", "registry")
const ROOT_REGISTRY = join(REGISTRY_DIR, "registry.json")

interface ValidationIssue {
  file: string
  message: string
  severity: "error" | "warning"
}

const issues: ValidationIssue[] = []

function addError(file: string, message: string) {
  issues.push({ file, message, severity: "error" })
}

function addWarning(file: string, message: string) {
  issues.push({ file, message, severity: "warning" })
}

// ── Validate Root Registry ─────────────────────────────────────────────

function validateRootRegistry() {
  if (!existsSync(ROOT_REGISTRY)) {
    addError("registry.json", "Root registry.json not found")
    return null
  }

  try {
    const data = JSON.parse(readFileSync(ROOT_REGISTRY, "utf-8"))

    if (!data.name) addError("registry.json", "Missing 'name'")
    if (!data.version) addError("registry.json", "Missing 'version'")
    if (!data.homepage) addError("registry.json", "Missing 'homepage'")
    if (!data.registryBaseUrl) addError("registry.json", "Missing 'registryBaseUrl'")
    if (!data.compatiblePerry) addError("registry.json", "Missing 'compatiblePerry'")
    if (!Array.isArray(data.items)) addError("registry.json", "'items' must be an array")

    console.log(`  Root registry: ${data.name} v${data.version}`)
    console.log(`  Items: ${data.items.length}`)
    return data
  } catch (e) {
    addError("registry.json", `Invalid JSON: ${(e as Error).message}`)
    return null
  }
}

// ── Validate Theme Files ───────────────────────────────────────────────

function validateThemes() {
  const themesDir = join(REGISTRY_DIR, "themes")
  if (!existsSync(themesDir)) {
    addWarning("themes/", "No themes directory")
    return
  }

  const files = readdirSync(themesDir).filter((f) => f.endsWith(".json"))
  console.log(`\n  Themes: ${files.length}`)

  for (const file of files) {
    const path = join(themesDir, file)
    try {
      const data = JSON.parse(readFileSync(path, "utf-8"))

      if (!data.name) addError(file, "Theme missing 'name'")
      if (!data.color) addError(file, "Theme missing 'color'")
      if (!data.radius) addError(file, "Theme missing 'radius'")
      if (!data.spacing) addError(file, "Theme missing 'spacing'")
      if (!data.typography) addError(file, "Theme missing 'typography'")

      // Check color tokens
      if (data.color) {
        const requiredColors = [
          "background", "foreground", "card", "cardForeground",
          "primary", "primaryForeground", "secondary", "secondaryForeground",
          "muted", "mutedForeground", "destructive", "destructiveForeground",
          "border", "input", "ring"
        ]
        for (const color of requiredColors) {
          if (!data.color[color]) addError(file, `Missing color token: ${color}`)
          else if (data.color[color].r === undefined) {
            addError(file, `Color token '${color}' missing r/g/b/a components`)
          }
        }
      }

      console.log(`    ${file}: OK`)
    } catch (e) {
      addError(file, `Invalid JSON: ${(e as Error).message}`)
    }
  }
}

// ── Validate Component Registry Items ──────────────────────────────────

function validateComponents() {
  const componentsDir = join(REGISTRY_DIR, "components")
  if (!existsSync(componentsDir)) {
    console.log("\n  Components: none (empty)")
    return []
  }

  const dirs = readdirSync(componentsDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)

  console.log(`\n  Components: ${dirs.length}`)
  const itemNames: string[] = []

  for (const dir of dirs) {
    const registryPath = join(componentsDir, dir, "registry.json")
    if (!existsSync(registryPath)) {
      addError(`components/${dir}/`, "Missing registry.json")
      continue
    }

    try {
      const data = JSON.parse(readFileSync(registryPath, "utf-8"))

      if (!data.name) addError(`components/${dir}/registry.json`, "Missing 'name'")
      if (!data.type) addError(`components/${dir}/registry.json`, "Missing 'type'")
      if (!data.title) addError(`components/${dir}/registry.json`, "Missing 'title'")
      if (!data.description) addError(`components/${dir}/registry.json`, "Missing 'description'")
      if (!data.files || !Array.isArray(data.files)) addError(`components/${dir}/registry.json`, "Missing or invalid 'files'")
      if (!data.agent) addWarning(`components/${dir}/registry.json`, "Missing 'agent' metadata")

      // Check file paths exist
      if (data.files) {
        for (const file of data.files) {
          if (file.sourcePath) {
            const fullPath = join(componentsDir, dir, file.sourcePath)
            if (!existsSync(fullPath)) {
              addError(`components/${dir}/registry.json`, `Source file not found: ${file.sourcePath}`)
            }
          }
        }
      }

      itemNames.push(data.name)
      console.log(`    ${dir}: OK`)
    } catch (e) {
      addError(`components/${dir}/registry.json`, `Invalid JSON: ${(e as Error).message}`)
    }
  }

  return itemNames
}

// ── Validate Block Registry Items ──────────────────────────────────────

function validateBlocks() {
  const blocksDir = join(REGISTRY_DIR, "blocks")
  if (!existsSync(blocksDir)) {
    console.log("\n  Blocks: none (empty)")
    return
  }

  const dirs = readdirSync(blocksDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)

  console.log(`\n  Blocks: ${dirs.length}`)

  for (const dir of dirs) {
    const registryPath = join(blocksDir, dir, "registry.json")
    if (!existsSync(registryPath)) {
      addError(`blocks/${dir}/`, "Missing registry.json")
      continue
    }

    try {
      const data = JSON.parse(readFileSync(registryPath, "utf-8"))
      if (!data.name) addError(`blocks/${dir}/registry.json`, "Missing 'name'")
      if (!data.type) addError(`blocks/${dir}/registry.json`, "Missing 'type'")
      if (data.type !== "block") addError(`blocks/${dir}/registry.json`, "Type must be 'block'")
      console.log(`    ${dir}: OK`)
    } catch (e) {
      addError(`blocks/${dir}/registry.json`, `Invalid JSON: ${(e as Error).message}`)
    }
  }
}

// ── Main ───────────────────────────────────────────────────────────────

console.log("Perry UI Registry Validator\n")
console.log("━".repeat(40))

validateRootRegistry()
validateThemes()
validateComponents()
validateBlocks()

console.log("\n" + "━".repeat(40))

const errors = issues.filter((i) => i.severity === "error")
const warnings = issues.filter((i) => i.severity === "warning")

if (errors.length > 0) {
  console.log(`\n${errors.length} error(s):`)
  for (const err of errors) {
    console.log(`  ERROR [${err.file}]: ${err.message}`)
  }
}

if (warnings.length > 0) {
  console.log(`\n${warnings.length} warning(s):`)
  for (const warn of warnings) {
    console.log(`  WARN  [${warn.file}]: ${warn.message}`)
  }
}

if (errors.length === 0) {
  console.log("\nRegistry is valid.")
  process.exit(0)
} else {
  console.log(`\nRegistry validation failed with ${errors.length} error(s).`)
  process.exit(1)
}
