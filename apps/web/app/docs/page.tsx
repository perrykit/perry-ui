import Link from "next/link"

const docsPages = [
  { href: "/docs/tutorial", title: "Tutorial", description: "Build your first Perry UI app in 10 minutes." },
  { href: "/docs/installation", title: "Installation", description: "Set up Perry UI in your project." },
  { href: "/docs/getting-started", title: "Getting Started", description: "Your first Perry UI app." },
  { href: "/docs/cli", title: "CLI Reference", description: "All CLI commands and options." },
  { href: "/docs/registry", title: "Registry", description: "How the component registry works." },
  { href: "/docs/theming", title: "Theming", description: "Customize the look and feel." },
  { href: "/docs/tokens", title: "Tokens", description: "Design token system reference." },
  { href: "/docs/variants", title: "Variants", description: "Variant resolver and component variants." },
  { href: "/docs/accessibility", title: "Accessibility", description: "Accessibility strategy and notes." },
  { href: "/docs/platforms", title: "Platforms", description: "Platform behavior and support matrix." },
  { href: "/docs/contributing", title: "Contributing", description: "How to contribute components and blocks." },
]

export default function DocsPage() {
  return (
    <div>
      <h1>Welcome to Perry UI Documentation</h1>
      <p className="text-lg text-muted-foreground mt-2 mb-8">
        Everything you need to build beautiful native apps with Perry UI.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 not-prose">
        {docsPages.map((page) => (
          <Link
            key={page.href}
            href={page.href}
            className="rounded-lg border p-4 hover:bg-accent/50 transition-colors"
          >
            <h3 className="font-medium text-sm">{page.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{page.description}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
