"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface MobileNavLinksProps {
  onClose?: () => void
}

const navSections = [
  {
    title: "Guides",
    links: [
      { href: "/docs/installation", label: "Installation" },
      { href: "/docs/getting-started", label: "Getting Started" },
      { href: "/docs/cli", label: "CLI Reference" },
      { href: "/docs/theming", label: "Theming" },
    ],
  },
  {
    title: "Components",
    links: [
      { href: "/components", label: "All Components" },
      { href: "/components/button", label: "Button" },
      { href: "/components/input", label: "Input" },
      { href: "/components/card", label: "Card" },
    ],
  },
  {
    title: "Examples",
    links: [
      { href: "/examples", label: "All Examples" },
      { href: "/examples/counter", label: "Counter App" },
      { href: "/examples/todo-app", label: "Todo App" },
    ],
  },
]

export function MobileNavLinks({ onClose }: MobileNavLinksProps) {
  const pathname = usePathname()

  return (
    <div className="space-y-6">
      {navSections.map((section) => (
        <div key={section.title}>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            {section.title}
          </h3>
          <div className="space-y-1">
            {section.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className={cn(
                  "block px-3 py-2 rounded-md text-sm transition-colors",
                  "hover:bg-accent hover:text-accent-foreground",
                  pathname === link.href
                    ? "bg-accent text-accent-foreground font-medium"
                    : "text-muted-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
