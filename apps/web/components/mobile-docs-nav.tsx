"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

const docsNav = [
  { href: "/docs/installation", label: "Installation" },
  { href: "/docs/getting-started", label: "Getting Started" },
  { href: "/docs/cli", label: "CLI Reference" },
  { href: "/docs/registry", label: "Registry" },
  { href: "/docs/theming", label: "Theming" },
  { href: "/docs/tokens", label: "Tokens" },
  { href: "/docs/variants", label: "Variants" },
  { href: "/docs/accessibility", label: "Accessibility" },
  { href: "/docs/platforms", label: "Platforms" },
  { href: "/docs/contributing", label: "Contributing" },
]

export function MobileDocsNav({ currentPath }: { currentPath: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="lg:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-sm font-medium mb-4 text-foreground hover:text-foreground/80 transition-colors"
      >
        {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        {open ? "Close" : "Documentation"}
      </button>

      {open && (
        <nav className="space-y-1 pb-4">
          {docsNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                "block rounded-md px-3 py-2 text-sm transition-colors",
                currentPath === item.href
                  ? "bg-accent text-accent-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </div>
  )
}
