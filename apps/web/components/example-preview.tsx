import { CodeBlock } from "@/components/code-block"

interface ExamplePreviewProps {
  name: string
  title: string
  description: string
  code: string
}

export async function ExamplePreview({ title, description, code }: ExamplePreviewProps) {
  return (
    <div className="mt-6 border rounded-lg overflow-hidden">
      <div className="border-b px-4 py-2 bg-muted/30">
        <p className="text-sm font-medium">{title}</p>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="p-4 bg-background max-h-[400px] overflow-auto">
        <CodeBlock code={code} language="typescript" />
      </div>
    </div>
  )
}
