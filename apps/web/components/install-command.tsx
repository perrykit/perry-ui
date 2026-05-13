"use client"

import { Check, Copy } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

export function InstallCommand({ items }: { items: string | string[] }) {
  const [copied, setCopied] = useState(false)
  const cmd = Array.isArray(items) ? `bunx perry-ui add ${items.join(" ")}` : `bunx perry-ui add ${items}`

  const handleCopy = () => {
    navigator.clipboard.writeText(cmd)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="group relative flex items-center gap-3 rounded-lg border bg-muted/50 px-4 py-3">
      <code className="flex-1 text-sm font-mono">{cmd}</code>
      <button
        onClick={handleCopy}
        className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:text-foreground transition-colors"
      >
        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      </button>
    </div>
  )
}
