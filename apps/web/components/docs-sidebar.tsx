import Link from "next/link"
import { cn } from "@/lib/utils"

const docsNav = [
  { href: "/docs/installation", label: "Installation" },
  { href: "/docs/getting-started", label: "Getting Started" },
  { href: "/docs/cli", label: "CLI" },
  { href: "/docs/registry", label: "Registry" },
  { href: "/docs/theming", label: "Theming" },
  { href: "/docs/tokens", label: "Tokens" },
  { href: "/docs/variants", label: "Variants" },
  { href: "/docs/accessibility", label: "Accessibility" },
  { href: "/docs/platforms", label: "Platforms" },
  { href: "/docs/contributing", label: "Contributing" },
]

export function DocsSidebar({ currentPath }: { currentPath: string }) {
  return (
    <aside className="hidden lg:block w-64 shrink-0">
      <nav className="sticky top-20 space-y-1">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Documentation</p>
        {docsNav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "block rounded-md px-3 py-1.5 text-sm transition-colors",
              currentPath === item.href
                ? "bg-accent text-accent-foreground font-medium"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
            )}
          >
            {item.label}
          </Link>
        ))}

        <p className="mt-6 mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Components</p>
        <Link
          href="/components"
          className="block rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
        >
          Browse all
        </Link>

        <p className="mt-6 mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Blocks</p>
        <Link
          href="/blocks"
          className="block rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
        >
          Browse all
        </Link>
      </nav>
    </aside>
  )
}
