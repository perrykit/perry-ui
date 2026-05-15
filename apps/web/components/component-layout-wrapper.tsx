import { Breadcrumb } from "@/components/breadcrumb"

interface ComponentLayoutProps {
  title: string
  description: string
  breadcrumbs: { label: string; href: string }[]
  children: React.ReactNode
}

export function ComponentLayoutWrapper({ title, description, breadcrumbs, children }: ComponentLayoutProps) {
  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="max-w-3xl">
        <Breadcrumb items={breadcrumbs} />
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="text-lg text-muted-foreground mt-2">{description}</p>
        {children}
      </div>
    </div>
  )
}
