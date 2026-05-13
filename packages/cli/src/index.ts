#!/usr/bin/env bun
/**
 * Perry UI CLI
 *
 * shadcn-style component registry for Perry native TypeScript apps.
 *
 * Usage:
 *   perry-ui init
 *   perry-ui add button card input
 *   perry-ui list
 *   perry-ui search dialog
 *   perry-ui diff button
 *   perry-ui doctor
 *   perry-ui update
 *   perry-ui add-theme slate
 */

import { resolve } from "path"
import { logger } from "./core/logger"

const VERSION = "0.1.0"

function parseArgs(argv: string[]): {
  command: string
  positional: string[]
  flags: Record<string, string | boolean>
} {
  const args = argv.slice(2)
  const positional: string[] = []
  const flags: Record<string, string | boolean> = {}

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    if (arg === "--help" || arg === "-h") {
      flags.help = true
    } else if (arg === "--version" || arg === "-v") {
      flags.version = true
    } else if (arg === "--yes" || arg === "-y") {
      flags.yes = true
    } else if (arg === "--overwrite") {
      flags.overwrite = true
    } else if (arg === "--dry-run") {
      flags.dryRun = true
    } else if (arg === "--installed") {
      flags.installed = true
    } else if (arg === "--verbose") {
      flags.verbose = true
    } else if (arg === "--registry" && i + 1 < args.length) {
      flags.registry = args[++i]
    } else if (arg === "--cwd" && i + 1 < args.length) {
      flags.cwd = args[++i]
    } else if (arg === "--type" && i + 1 < args.length) {
      flags.type = args[++i]
    } else if (arg.startsWith("--")) {
      // Unknown flag, skip
    } else {
      positional.push(arg)
    }
  }

  const command = positional[0] || ""
  return { command, positional: positional.slice(1), flags }
}

function printHelp() {
  console.log(`
${"\x1b[1m"}Perry UI CLI${"\x1b[0m"} v${VERSION}

${"\x1b[1m"}Usage:${"\x1b[0m"}
  perry-ui <command> [options]

${"\x1b[1m"}Commands:${"\x1b[0m"}
  init                  Initialize Perry UI in your project
  add <items...>        Add components, blocks, or themes
  list                  List available registry items
  search <query>        Search registry items
  diff <item>           Compare local file with registry version
  doctor                Check project setup and dependencies
  update [item]         Check for available updates
  add-theme <theme>     Switch theme

${"\x1b[1m"}Options:${"\x1b[0m"}
  --yes, -y             Accept defaults and skip prompts
  --overwrite           Overwrite existing files without prompting
  --dry-run             Preview changes without writing files
  --registry <url>      Use custom registry URL or path
  --cwd <path>          Run in a different directory
  --type <type>         Filter by type (component, block, theme)
  --installed           Show only installed items
  --help, -h            Show this help
  --version, -v         Show version
`)
}

async function main() {
  const { command, positional, flags } = parseArgs(process.argv)

  if (flags.version) {
    console.log(`perry-ui v${VERSION}`)
    return
  }

  if (flags.help || !command) {
    printHelp()
    return
  }

  const cwd = typeof flags.cwd === "string" ? resolve(flags.cwd) : process.cwd()

  try {
    switch (command) {
      case "init": {
        const { init } = await import("./commands/init")
        await init(cwd, {
          yes: !!flags.yes,
          registry: typeof flags.registry === "string" ? flags.registry : undefined,
        })
        break
      }

      case "add": {
        // Support: perry-ui add button card input
        // Also: perry-ui add block settings-window
        const items = positional.filter((p) => !p.startsWith("-"))
        const { add } = await import("./commands/add")
        await add(cwd, items, {
          overwrite: !!flags.overwrite,
          dryRun: !!flags.dryRun,
          yes: !!flags.yes,
          registry: typeof flags.registry === "string" ? flags.registry : undefined,
          cwd: typeof flags.cwd === "string" ? flags.cwd : undefined,
        })
        break
      }

      case "list": {
        const { list } = await import("./commands/list")
        await list(cwd, {
          type: typeof flags.type === "string" ? flags.type : undefined,
          installed: !!flags.installed,
          registry: typeof flags.registry === "string" ? flags.registry : undefined,
        })
        break
      }

      case "search": {
        const { search } = await import("./commands/search")
        await search(cwd, positional[0] ?? "", {
          registry: typeof flags.registry === "string" ? flags.registry : undefined,
        })
        break
      }

      case "diff": {
        const { diff } = await import("./commands/diff")
        await diff(cwd, positional[0] ?? "", {
          registry: typeof flags.registry === "string" ? flags.registry : undefined,
        })
        break
      }

      case "doctor": {
        const { doctor } = await import("./commands/doctor")
        await doctor(cwd, {
          registry: typeof flags.registry === "string" ? flags.registry : undefined,
        })
        break
      }

      case "update": {
        const { update } = await import("./commands/update")
        await update(cwd, positional[0], {
          registry: typeof flags.registry === "string" ? flags.registry : undefined,
          yes: !!flags.yes,
        })
        break
      }

      case "add-theme": {
        const { addTheme } = await import("./commands/add-theme")
        await addTheme(cwd, positional[0] ?? "", {
          registry: typeof flags.registry === "string" ? flags.registry : undefined,
        })
        break
      }

      default:
        logger.error(`Unknown command: ${command}`)
        console.log(`Run \`perry-ui --help\` for usage.`)
        process.exit(1)
    }
  } catch (e) {
    logger.error(`Command failed: ${(e as Error).message}`)
    if (flags.verbose) {
      console.error(e)
    }
    process.exit(1)
  }
}

main()
