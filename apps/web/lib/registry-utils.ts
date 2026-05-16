import { readFileSync, existsSync } from "fs"
import { join, resolve } from "path"

export const REGISTRY_DIR = resolve(process.cwd(), "../../packages/registry")
export const DIST_DIR = resolve(process.cwd(), "../../dist")

export function readJSON<T>(path: string): T {
  return JSON.parse(readFileSync(path, "utf-8"))
}

export function resolvePath(...segments: string[]): string {
  const distPath = join(DIST_DIR, ...segments)
  if (existsSync(distPath)) return distPath
  return join(REGISTRY_DIR, ...segments)
}
