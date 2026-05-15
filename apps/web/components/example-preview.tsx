"use client"

import { useState } from "react"
import { CodeBlock } from "@/components/code-block"

interface ExamplePreviewProps {
  name: string
  title: string
  description: string
  code: string
}

export function ExamplePreview({ name, title, description, code }: ExamplePreviewProps) {
  const [view, setView] = useState<"preview" | "code">("code")

  return (
    <div className="mt-6 border rounded-lg overflow-hidden">
      <div className="border-b px-4 py-2 flex items-center justify-between bg-muted/30">
        <div>
          <p className="text-sm font-medium">{title}</p>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setView("preview")}
            className={`text-xs px-3 py-1 rounded transition-colors ${
              view === "preview"
                ? "bg-background text-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-background/50"
            }`}
          >
            Preview
          </button>
          <button
            onClick={() => setView("code")}
            className={`text-xs px-3 py-1 rounded transition-colors ${
              view === "code"
                ? "bg-background text-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-background/50"
            }`}
          >
            Code
          </button>
        </div>
      </div>
      {view === "preview" ? (
        <div className="p-6 bg-background min-h-[200px] flex items-center justify-center">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">
              This example requires a Perry runtime to render.
            </p>
            <p className="text-xs text-muted-foreground">
              Full preview support coming in Phase 3.
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              View the code tab to see the implementation.
            </p>
          </div>
        </div>
      ) : (
        <div className="p-4 bg-background max-h-[400px] overflow-auto">
          <CodeBlock code={code} language="typescript" />
        </div>
      )}
    </div>
  )
}
