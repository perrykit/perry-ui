/**
 * Perry UI Registry Types
 *
 * TypeScript types for registry items. Used by CLI, website, and build scripts.
 */

export type RegistryItemType = "component" | "block" | "theme" | "utility" | "template"

export type RegistryRoot = {
  name: string
  version: string
  homepage: string
  registryBaseUrl: string
  compatiblePerry: {
    minVersion: string
    testedVersions: string[]
    notes?: string
  }
  items: RegistryItemSummary[]
}

export type RegistryItemSummary = {
  name: string
  type: RegistryItemType
  title: string
  description: string
  categories: string[]
  dependencies: string[]
  files: string[]
  url: string
}

export type RegistryItem = {
  schemaVersion: "1.0"
  name: string
  title: string
  type: RegistryItemType
  description: string
  author?: string
  license: string
  compatiblePerry: {
    minVersion: string
    testedVersions: string[]
  }
  dependencies: string[]
  registryDependencies: string[]
  files: RegistryFile[]
  docs: {
    overview: string
    usage: string
    accessibility?: string
    platformNotes?: PlatformNotes
  }
  props?: ComponentProp[]
  variants?: ComponentVariant[]
  examples: RegistryExample[]
  agent: AgentMetadata
}

export type RegistryFile = {
  path: string
  target: string
  type: "component" | "utility" | "theme" | "example" | "docs"
  content?: string
  sourcePath?: string
  overwrite?: "prompt" | "always" | "never"
}

export type PlatformNotes = {
  macos?: string
  ios?: string
  android?: string
  linux?: string
  windows?: string
  web?: string
}

export type ComponentProp = {
  name: string
  type: string
  required: boolean
  default?: string
  description: string
}

export type ComponentVariant = {
  name: string
  values: string[]
  defaultValue?: string
  description?: string
}

export type RegistryExample = {
  name: string
  title: string
  description?: string
  code: string
}

export type AgentMetadata = {
  summary: string
  useWhen: string[]
  doNotUseWhen?: string[]
  requiredImports: string[]
  commonCombinations: string[]
  layoutHints: string[]
  accessibilityChecklist: string[]
}
