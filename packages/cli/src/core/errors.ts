/**
 * Perry UI Error Handling
 *
 * Provides structured error types with actionable suggestions.
 */

export class PerryUIError extends Error {
  constructor(
    message: string,
    public code: string,
    public suggestions: string[] = []
  ) {
    super(message)
    this.name = "PerryUIError"
  }

  format(): string {
    let output = `\n${"❌"} ${this.message}\n`
    output += `   Code: ${this.code}\n`

    if (this.suggestions.length > 0) {
      output += `\n${"💡"} Suggestions:\n`
      for (const suggestion of this.suggestions) {
        output += `   • ${suggestion}\n`
      }
    }

    return output
  }
}

export class RegistryFetchError extends PerryUIError {
  constructor(url: string, cause?: Error) {
    super(
      `Failed to fetch registry from ${url}`,
      "REGISTRY_FETCH_ERROR",
      [
        "Check your internet connection",
        "Verify the registry URL is correct",
        `Try: perry-ui add <component> --registry https://registry.perry-ui.com/r`,
        "Use --registry flag for a custom registry",
        cause ? `Cause: ${cause.message}` : undefined
      ].filter(Boolean) as string[]
    )
  }
}

export class ComponentNotFoundError extends PerryUIError {
  constructor(name: string, available: string[]) {
    super(
      `Component "${name}" not found in registry`,
      "COMPONENT_NOT_FOUND",
      [
        `Available components: ${available.slice(0, 10).join(", ")}${available.length > 10 ? "..." : ""}`,
        "Run: perry-ui list --type component",
        "Run: perry-ui search <query> to find components",
        "Check for typos in the component name"
      ]
    )
  }
}

export class ProjectNotFoundError extends PerryUIError {
  constructor(cwd: string) {
    super(
      `Not a Perry UI project (missing perryui.config.json)`,
      "PROJECT_NOT_FOUND",
      [
        `Current directory: ${cwd}`,
        "Run: perry-ui init to initialize",
        "Or navigate to your project root",
        "Use --cwd flag to specify project directory"
      ]
    )
  }
}

export class FileWriteError extends PerryUIError {
  constructor(path: string, cause?: Error) {
    super(
      `Failed to write file: ${path}`,
      "FILE_WRITE_ERROR",
      [
        "Check file permissions",
        "Ensure directory exists",
        "Try: perry-ui add <component> --dry-run to preview",
        cause ? `Cause: ${cause.message}` : undefined
      ].filter(Boolean) as string[]
    )
  }
}

export class ValidationError extends PerryUIError {
  constructor(item: string, errors: string[]) {
    super(
      `Validation failed for ${item}`,
      "VALIDATION_ERROR",
      [
        ...errors.slice(0, 5),
        "Run: perry-ui doctor to check project health",
        "Report issues at: https://github.com/perrykit/perry-ui/issues"
      ]
    )
  }
}

export class DependencyError extends PerryUIError {
  constructor(item: string, missing: string[]) {
    super(
      `Missing dependencies for ${item}`,
      "DEPENDENCY_ERROR",
      [
        `Missing: ${missing.join(", ")}`,
        "Run: perry-ui add " + missing.join(" "),
        "Dependencies will be installed automatically",
        "Or add components individually"
      ]
    )
  }
}

/**
 * Format error for user display
 */
export function formatError(error: unknown): string {
  if (error instanceof PerryUIError) {
    return error.format()
  }

  if (error instanceof Error) {
    return `\n${"❌"} ${error.message}\n`
  }

  return `\n${"❌"} An unknown error occurred\n`
}
