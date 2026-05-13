import { z } from "zod"

export const PerryUIConfigSchema = z.object({
  $schema: z.string().optional(),
  style: z.string().default("default"),
  theme: z.string().default("zinc"),
  registry: z.string().default("https://perry-ui.dev/r/registry.json"),
  paths: z.object({
    components: z.string().default("src/components"),
    ui: z.string().default("src/components/ui"),
    blocks: z.string().default("src/components/blocks"),
    lib: z.string().default("src/lib/perry-ui"),
  }),
  aliases: z.object({
    components: z.string().default("@/components"),
    ui: z.string().default("@/components/ui"),
    lib: z.string().default("@/lib/perry-ui"),
  }),
  runtime: z.object({
    mode: z.enum(["source-copy", "hybrid"]).default("source-copy"),
  }),
  preferences: z.object({
    overwrite: z.enum(["prompt", "never", "always"]).default("prompt"),
  }).optional(),
})

export type PerryUIConfig = z.infer<typeof PerryUIConfigSchema>

export const DEFAULT_CONFIG: PerryUIConfig = {
  style: "default",
  theme: "zinc",
  registry: "https://perry-ui.dev/r/registry.json",
  paths: {
    components: "src/components",
    ui: "src/components/ui",
    blocks: "src/components/blocks",
    lib: "src/lib/perry-ui",
  },
  aliases: {
    components: "@/components",
    ui: "@/components/ui",
    lib: "@/lib/perry-ui",
  },
  runtime: {
    mode: "source-copy",
  },
  preferences: {
    overwrite: "prompt",
  },
}
