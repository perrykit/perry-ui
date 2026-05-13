import { DocsSidebar } from "@/components/docs-sidebar"

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-7xl px-6 py-10 flex gap-10">
      <DocsSidebar currentPath="" />
      <div className="min-w-0 flex-1 prose prose-zinc dark:prose-invert max-w-none">
        {children}
      </div>
    </div>
  )
}
