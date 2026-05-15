import { DocsSidebar } from "@/components/docs-sidebar"
import { MobileDocsNav } from "@/components/mobile-docs-nav"
import { Breadcrumb } from "@/components/breadcrumb"
import { usePathname } from "next/navigation"

export function DocsLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 flex gap-10">
      <DocsSidebar currentPath={pathname} />
      <div className="min-w-0 flex-1">
        <MobileDocsNav currentPath={pathname} />
        <div className="prose prose-zinc dark:prose-invert max-w-none">
          {children}
        </div>
      </div>
    </div>
  )
}
