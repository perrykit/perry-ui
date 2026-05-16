import { highlightCode } from "@/lib/highlight"
import { CodeBlockCopyButton } from "@/components/code-block-copy-button"
import { cn } from "@/lib/utils"

export async function CodeBlock({ code, language = "bash", className }: { code: string; language?: string; className?: string }) {
  const html = await highlightCode(code, language)

  return (
    <div className={cn("group relative rounded-lg border bg-muted/50", className)}>
      <div className="flex items-center justify-between border-b px-4 py-2">
        <span className="text-xs text-muted-foreground font-mono">{language}</span>
        <CodeBlockCopyButton code={code} />
      </div>
      <div
        className="overflow-x-auto p-4 text-sm [&_pre]:!bg-transparent [&_pre]:!p-0 [&_pre]:!m-0 [&_code]:!bg-transparent"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  )
}
