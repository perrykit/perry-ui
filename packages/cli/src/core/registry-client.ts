import { readFileSync, existsSync } from "fs"
import { join, resolve } from "path"
import type { RegistryRoot, RegistryItem } from "../schemas/registry"
import { RegistryRootSchema, RegistryItemSchema } from "../schemas/registry"
import { logger } from "./logger"

let cachedRoot: RegistryRoot | null = null
const itemCache = new Map<string, RegistryItem>()

export async function fetchRegistry(registryUrl: string): Promise<RegistryRoot> {
  if (cachedRoot) return cachedRoot

  let raw: string

  if (registryUrl.startsWith("/") || registryUrl.startsWith("./") || registryUrl.startsWith("..")) {
    // Local file path
    const absPath = resolve(registryUrl)
    if (!existsSync(absPath)) {
      logger.error(`Registry file not found: ${absPath}`)
      process.exit(1)
    }
    raw = readFileSync(absPath, "utf-8")
  } else if (registryUrl.startsWith("http://") || registryUrl.startsWith("https://")) {
    // Remote URL
    try {
      const res = await fetch(registryUrl)
      if (!res.ok) {
        logger.error(`Failed to fetch registry: ${res.status} ${res.statusText}`)
        process.exit(1)
      }
      raw = await res.text()
    } catch (e) {
      logger.error(`Failed to fetch registry: ${(e as Error).message}`)
      process.exit(1)
    }
  } else {
    logger.error(`Invalid registry URL: ${registryUrl}`)
    process.exit(1)
  }

  try {
    const parsed = JSON.parse(raw)
    cachedRoot = RegistryRootSchema.parse(parsed)
    return cachedRoot
  } catch (e) {
    logger.error(`Invalid registry JSON: ${(e as Error).message}`)
    process.exit(1)
  }
}

export async function fetchItem(
  registryUrl: string,
  itemName: string
): Promise<RegistryItem> {
  if (itemCache.has(itemName)) return itemCache.get(itemName)!

  const root = await fetchRegistry(registryUrl)
  const summary = root.items.find((i) => i.name === itemName)

  if (!summary) {
    // Suggest nearest matches
    const names = root.items.map((i) => i.name)
    const suggestions = names.filter((n) =>
      n.includes(itemName) || levenshtein(n, itemName) <= 3
    ).slice(0, 5)

    logger.error(`Item "${itemName}" not found in registry.`)
    if (suggestions.length > 0) {
      logger.dim(`Did you mean: ${suggestions.join(", ")}?`)
    }
    process.exit(1)
  }

  // Build item URL
  let itemUrl: string
  if (registryUrl.startsWith("/") || registryUrl.startsWith("./")) {
    // Local: derive path from registry directory
    // Strip the /r/ prefix from URL since local files don't have that structure
    const registryDir = resolve(registryUrl, "..")
    const relativePath = summary.url
      .replace(/^\/r\//, "")   // strip /r/ prefix
      .replace(/^\//, "")      // strip leading /
    itemUrl = join(registryDir, relativePath)
    if (!itemUrl.endsWith(".json")) itemUrl += "/registry.json"
  } else {
    const baseUrl = root.registryBaseUrl.replace(/\/$/, "")
    itemUrl = `${baseUrl}${summary.url}`
    if (!itemUrl.endsWith(".json")) itemUrl += "/registry.json"
  }

  let raw: string
  if (itemUrl.startsWith("/") || itemUrl.startsWith("./")) {
    if (!existsSync(itemUrl)) {
      logger.error(`Item file not found: ${itemUrl}`)
      process.exit(1)
    }
    raw = readFileSync(itemUrl, "utf-8")
  } else {
    try {
      const res = await fetch(itemUrl)
      if (!res.ok) {
        logger.error(`Failed to fetch item "${itemName}": ${res.status}`)
        process.exit(1)
      }
      raw = await res.text()
    } catch (e) {
      logger.error(`Failed to fetch item "${itemName}": ${(e as Error).message}`)
      process.exit(1)
    }
  }

  try {
    const parsed = JSON.parse(raw)
    const item = RegistryItemSchema.parse(parsed)
    itemCache.set(itemName, item)
    return item
  } catch (e) {
    logger.error(`Invalid registry item "${itemName}": ${(e as Error).message}`)
    process.exit(1)
  }
}

function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0) as number[])
  for (let i = 0; i <= m; i++) dp[i][0] = i
  for (let j = 0; j <= n; j++) dp[0][j] = j
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      )
    }
  }
  return dp[m][n]
}
