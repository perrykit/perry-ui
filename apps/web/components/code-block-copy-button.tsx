"use client"

import { Check, Copy } from "lucide-react"
import { useState } from "react"

export function CodeBlockCopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:text-foreground transition-colors"
    >
      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  )
}
