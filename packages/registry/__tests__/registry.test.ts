import { describe, expect, it } from "bun:test"
import { readdirSync, readFileSync, existsSync } from "fs"
import { join } from "path"

const REGISTRY_DIR = join(__dirname, "..")
const COMPONENTS_DIR = join(REGISTRY_DIR, "components")
const THEMES_DIR = join(REGISTRY_DIR, "themes")
const BLOCKS_DIR = join(REGISTRY_DIR, "blocks")

// ── Registry Root ──────────────────────────────────────────────────────

describe("Registry root", () => {
  it("has valid root registry.json", () => {
    const root = JSON.parse(readFileSync(join(REGISTRY_DIR, "registry.json"), "utf-8"))
    expect(root.name).toBe("perry-ui")
    expect(root.version).toBeDefined()
    expect(root.homepage).toBeDefined()
    expect(root.registryBaseUrl).toBeDefined()
  })
})

// ── Component Registry Items ───────────────────────────────────────────

const componentDirs = readdirSync(COMPONENTS_DIR, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)

describe("Component registry items", () => {
  it(`has expected component count (>= 20)`, () => {
    expect(componentDirs.length).toBeGreaterThanOrEqual(20)
  })

  for (const dir of componentDirs) {
    describe(`Component: ${dir}`, () => {
      let data: any

      it("has valid registry.json", () => {
        const path = join(COMPONENTS_DIR, dir, "registry.json")
        expect(existsSync(path)).toBe(true)
        data = JSON.parse(readFileSync(path, "utf-8"))
      })

      it("has required fields", () => {
        expect(data.name).toBe(dir)
        expect(data.schemaVersion).toBe("1.0")
        expect(data.title).toBeDefined()
        expect(data.type).toBe("component")
        expect(data.description).toBeDefined()
        expect(data.license).toBe("MIT")
      })

      it("has compatiblePerry metadata", () => {
        expect(data.compatiblePerry).toBeDefined()
        expect(data.compatiblePerry.minVersion).toBeDefined()
        expect(Array.isArray(data.compatiblePerry.testedVersions)).toBe(true)
      })

      it("has files array with source path", () => {
        expect(Array.isArray(data.files)).toBe(true)
        expect(data.files.length).toBeGreaterThan(0)
        for (const file of data.files) {
          expect(file.sourcePath).toBeDefined()
          expect(file.target).toBeDefined()
          expect(existsSync(join(COMPONENTS_DIR, dir, file.sourcePath))).toBe(true)
        }
      })

      it("has docs section", () => {
        expect(data.docs).toBeDefined()
        expect(data.docs.overview).toBeDefined()
        expect(data.docs.usage).toBeDefined()
      })

      it("has props array", () => {
        expect(Array.isArray(data.props)).toBe(true)
      })

      it("has examples", () => {
        expect(Array.isArray(data.examples)).toBe(true)
        expect(data.examples.length).toBeGreaterThan(0)
      })

      it("has agent metadata", () => {
        expect(data.agent).toBeDefined()
        expect(data.agent.summary).toBeDefined()
        expect(Array.isArray(data.agent.useWhen)).toBe(true)
        expect(data.agent.useWhen.length).toBeGreaterThan(0)
        expect(Array.isArray(data.agent.requiredImports)).toBe(true)
        expect(Array.isArray(data.agent.commonCombinations)).toBe(true)
        expect(Array.isArray(data.agent.layoutHints)).toBe(true)
        expect(Array.isArray(data.agent.accessibilityChecklist)).toBe(true)
      })

      it("has registryDependencies", () => {
        expect(Array.isArray(data.registryDependencies)).toBe(true)
      })

      it("source file exists and is non-empty", () => {
        const srcPath = join(COMPONENTS_DIR, dir, "files", `${dir}.ts`)
        expect(existsSync(srcPath)).toBe(true)
        const content = readFileSync(srcPath, "utf-8")
        expect(content.length).toBeGreaterThan(50)
      })
    })
  }
})

// ── Theme Files ────────────────────────────────────────────────────────

const themeFiles = readdirSync(THEMES_DIR).filter((f) => f.endsWith(".json"))

describe("Theme files", () => {
  it(`has expected theme count (>= 5)`, () => {
    expect(themeFiles.length).toBeGreaterThanOrEqual(5)
  })

  const requiredColors = [
    "background", "foreground", "card", "cardForeground",
    "popover", "popoverForeground", "primary", "primaryForeground",
    "secondary", "secondaryForeground", "muted", "mutedForeground",
    "accent", "accentForeground", "destructive", "destructiveForeground",
    "border", "input", "ring",
  ]

  for (const file of themeFiles) {
    describe(`Theme: ${file}`, () => {
      let data: any

      it("has valid JSON", () => {
        data = JSON.parse(readFileSync(join(THEMES_DIR, file), "utf-8"))
      })

      it("has required fields", () => {
        expect(data.name).toBeDefined()
        expect(data.title).toBeDefined()
        expect(data.description).toBeDefined()
      })

      it("has all required color tokens", () => {
        for (const color of requiredColors) {
          expect(data.color[color]).toBeDefined()
          expect(data.color[color].r).toBeGreaterThanOrEqual(0)
          expect(data.color[color].r).toBeLessThanOrEqual(1)
          expect(data.color[color].g).toBeGreaterThanOrEqual(0)
          expect(data.color[color].g).toBeLessThanOrEqual(1)
          expect(data.color[color].b).toBeGreaterThanOrEqual(0)
          expect(data.color[color].b).toBeLessThanOrEqual(1)
          expect(data.color[color].a).toBeGreaterThanOrEqual(0)
          expect(data.color[color].a).toBeLessThanOrEqual(1)
        }
      })

      it("has radius tokens", () => {
        expect(data.radius).toBeDefined()
        expect(data.radius.none).toBe(0)
        expect(data.radius.full).toBe(9999)
      })

      it("has spacing tokens", () => {
        expect(data.spacing).toBeDefined()
        expect(data.spacing["0"]).toBe(0)
      })

      it("has typography tokens", () => {
        expect(data.typography).toBeDefined()
        expect(data.typography.base).toBeGreaterThan(0)
      })
    })
  }
})

// ── Block Registry Items ───────────────────────────────────────────────

describe("Block registry items", () => {
  const blockDirs = readdirSync(BLOCKS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)

  it("has at least one block", () => {
    expect(blockDirs.length).toBeGreaterThanOrEqual(1)
  })

  for (const dir of blockDirs) {
    describe(`Block: ${dir}`, () => {
      let data: any

      it("has valid registry.json", () => {
        const path = join(BLOCKS_DIR, dir, "registry.json")
        data = JSON.parse(readFileSync(path, "utf-8"))
      })

      it("has type 'block'", () => {
        expect(data.type).toBe("block")
      })

      it("has registryDependencies", () => {
        expect(Array.isArray(data.registryDependencies)).toBe(true)
        expect(data.registryDependencies.length).toBeGreaterThan(0)
      })

      it("has agent metadata", () => {
        expect(data.agent).toBeDefined()
        expect(data.agent.summary).toBeDefined()
      })
    })
  }
})

// ── Cross-cutting checks ───────────────────────────────────────────────

describe("Cross-cutting registry checks", () => {
  it("all registryDependencies reference existing components", () => {
    for (const dir of componentDirs) {
      const data = JSON.parse(
        readFileSync(join(COMPONENTS_DIR, dir, "registry.json"), "utf-8")
      )
      for (const dep of data.registryDependencies ?? []) {
        expect(componentDirs).toContain(dep)
      }
    }
  })

  it("no duplicate component names", () => {
    const names = componentDirs
    expect(new Set(names).size).toBe(names.length)
  })

  it("all source files export the component function", () => {
    for (const dir of componentDirs) {
      const srcPath = join(COMPONENTS_DIR, dir, "files", `${dir}.ts`)
      const content = readFileSync(srcPath, "utf-8")
      // Check for PascalCase export function matching the component name
      const pascalName = dir
        .split("-")
        .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
        .join("")
      expect(content).toContain(`export function ${pascalName}`)
    }
  })
})
