import { z } from "zod"
import type {
  RegistryRoot as RegistryRootType,
  RegistryItem as RegistryItemType,
  RegistryFile as RegistryFileType,
} from "../../../registry/types"

// Zod validation schemas for parsing fetched registry data at runtime.
// TypeScript types are imported from the canonical registry/types.ts.

export const RegistryFileSchema = z.object({
  path: z.string(),
  target: z.string(),
  type: z.enum(["component", "utility", "theme", "example", "docs"]),
  content: z.string().optional(),
  sourcePath: z.string().optional(),
  overwrite: z.enum(["prompt", "always", "never"]).optional(),
})

export const ComponentPropSchema = z.object({
  name: z.string(),
  type: z.string(),
  required: z.boolean(),
  default: z.string().optional(),
  description: z.string(),
})

export const ComponentVariantSchema = z.object({
  name: z.string(),
  values: z.array(z.string()),
  defaultValue: z.string().optional(),
  description: z.string().optional(),
})

export const RegistryExampleSchema = z.object({
  name: z.string(),
  title: z.string(),
  description: z.string().optional(),
  code: z.string(),
})

export const AgentMetadataSchema = z.object({
  summary: z.string(),
  useWhen: z.array(z.string()),
  doNotUseWhen: z.array(z.string()).optional(),
  requiredImports: z.array(z.string()),
  commonCombinations: z.array(z.string()),
  layoutHints: z.array(z.string()),
  accessibilityChecklist: z.array(z.string()),
})

export const RegistryItemSchema = z.object({
  schemaVersion: z.literal("1.0"),
  name: z.string(),
  title: z.string(),
  type: z.enum(["component", "block", "theme", "utility", "template"]),
  description: z.string(),
  author: z.string().optional(),
  license: z.string(),
  compatiblePerry: z.object({
    minVersion: z.string(),
    testedVersions: z.array(z.string()),
  }),
  dependencies: z.array(z.string()),
  registryDependencies: z.array(z.string()),
  files: z.array(RegistryFileSchema),
  docs: z.object({
    overview: z.string(),
    usage: z.string(),
    accessibility: z.string().optional(),
    platformNotes: z.record(z.string(), z.string()).optional(),
  }),
  props: z.array(ComponentPropSchema).optional(),
  variants: z.array(ComponentVariantSchema).optional(),
  examples: z.array(RegistryExampleSchema),
  agent: AgentMetadataSchema,
})

export const RegistryItemSummarySchema = z.object({
  name: z.string(),
  type: z.enum(["component", "block", "theme", "utility", "template"]),
  title: z.string(),
  description: z.string(),
  categories: z.array(z.string()),
  dependencies: z.array(z.string()),
  files: z.array(z.string()),
  url: z.string(),
})

export const RegistryRootSchema = z.object({
  name: z.string(),
  version: z.string(),
  homepage: z.string(),
  registryBaseUrl: z.string(),
  compatiblePerry: z.object({
    minVersion: z.string(),
    testedVersions: z.array(z.string()),
    notes: z.string().optional(),
  }),
  items: z.array(RegistryItemSummarySchema),
})

// Re-export canonical types — single source of truth from registry/types.ts
export type RegistryRoot = RegistryRootType
export type RegistryItem = RegistryItemType
export type RegistryFile = RegistryFileType
