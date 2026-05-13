import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t py-8">
      <div className="mx-auto max-w-7xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <p>MIT License. Perry UI is a community project.</p>
        <nav className="flex gap-6">
          <Link href="/docs/installation" className="hover:text-foreground transition-colors">Docs</Link>
          <Link href="/components" className="hover:text-foreground transition-colors">Components</Link>
          <Link href="/blocks" className="hover:text-foreground transition-colors">Blocks</Link>
        </nav>
      </div>
    </footer>
  )
}
