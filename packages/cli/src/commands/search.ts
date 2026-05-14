import { logger } from "../core/logger"
import { fetchRegistry } from "../core/registry-client"
import { findConfig } from "../core/project-detect"

export async function search(
  cwd: string,
  query: string,
  options: { registry?: string } = {}
) {
  if (!query) {
    logger.error("No query specified. Usage: perry-ui search <query>")
    process.exit(1)
  }

  const config = findConfig(cwd)
  const registryUrl = options.registry ?? config?.registry ?? "https://registry.perry-ui.com/r/registry.json"

  const registry = await fetchRegistry(registryUrl)
  const q = query.toLowerCase()

  const matches = registry.items.filter((item) => {
    const searchable = [
      item.name,
      item.title,
      item.description,
      ...item.categories,
    ]
      .join(" ")
      .toLowerCase()
    return (
      searchable.includes(q) ||
      levenshtein(item.name.toLowerCase(), q) <= 3
    )
  })

  if (matches.length === 0) {
    logger.warn(`No items found matching "${query}"`)
    return
  }

  logger.heading(`Search results for "${query}"`)
  for (const item of matches) {
    logger.step(`${item.name} [${item.type}] — ${item.description}`)
  }
  logger.newline()
  logger.dim(`  ${matches.length} result(s)`)
}

function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0) as number[])
  for (let i = 0; i <= m; i++) dp[i][0] = i
  for (let j = 0; j <= n; j++) dp[0][j] = j
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = Math.min(dp[i-1][j]+1, dp[i][j-1]+1, dp[i-1][j-1]+(a[i-1]===b[j-1]?0:1))
  return dp[m][n]
}
