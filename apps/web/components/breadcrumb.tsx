import Link from "next/link"
import { cn } from "@/lib/utils"

export interface BreadcrumbItem {
  label: string
  href: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
      {items.map((item, index) => (
        <div key={item.href} className="flex items-center gap-2">
          {index > 0 && <span className="text-muted-foreground/50">/</span>}
          <Link
            href={item.href}
            className={cn(
              "hover:text-foreground transition-colors",
              index === items.length - 1 && "text-foreground font-medium"
            )}
          >
            {item.label}
          </Link>
        </div>
      ))}
    </div>
  )
}
