"use client"

import { DocsSidebar } from "@/components/docs-sidebar"
import { MobileDocsNav } from "@/components/mobile-docs-nav"
import { usePathname } from "next/navigation"

export function DocsLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Don't show sidebar on the docs index page (it already shows all links)
  const isDocsIndex = pathname === "/docs"

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      {isDocsIndex ? (
        // Docs index page - no sidebar, full width content
        <div className="max-w-5xl mx-auto">
          <MobileDocsNav currentPath={pathname} />
          <div className="prose prose-zinc dark:prose-invert max-w-none">
            {children}
          </div>
        </div>
      ) : (
        // Individual doc pages - with sidebar navigation
        <div className="flex gap-10">
          <DocsSidebar currentPath={pathname} />
          <div className="min-w-0 flex-1">
            <MobileDocsNav currentPath={pathname} />
            <div className="prose prose-zinc dark:prose-invert max-w-none">
              {children}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
