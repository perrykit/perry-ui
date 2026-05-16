import Link from "next/link"
import type { Metadata } from "next"
import { getAllComponents } from "@/lib/registry"

export const metadata: Metadata = {
  title: "Components — Perry UI",
  description: "Browse all Perry UI components: buttons, inputs, cards, dialogs, and more. Copy-paste native TypeScript components.",
}

const CATEGORIES: Record<string, { label: string; components: string[] }> = {
  foundation: {
    label: "Foundation",
    components: ["button", "text", "heading", "separator", "skeleton"],
  },
  layout: {
    label: "Layout",
    components: ["card", "tabs"],
  },
  form: {
    label: "Form",
    components: ["input", "textarea", "label", "checkbox", "radio", "select", "switch"],
  },
  feedback: {
    label: "Feedback",
    components: ["alert", "badge", "progress", "toast", "tooltip", "avatar"],
  },
  overlay: {
    label: "Overlay",
    components: ["dialog", "sheet"],
  },
}

export default function ComponentsPage() {
  const components = getAllComponents()
  const categorized = new Set(Object.values(CATEGORIES).flatMap((c) => c.components))
  const uncategorized = components.filter((c) => !categorized.has(c.name))

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="text-3xl font-bold">Components</h1>
      <p className="text-lg text-muted-foreground mt-2 mb-8">
        {components.length} copy-paste components for Perry native apps.
      </p>

      {Object.entries(CATEGORIES).map(([key, category]) => {
        const items = components.filter((c) => category.components.includes(c.name))
        if (items.length === 0) return null
        return (
          <section key={key} className="mb-10">
            <h2 className="text-xl font-semibold mb-4">{category.label}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((comp) => (
                <ComponentCard key={comp.name} comp={comp} />
              ))}
            </div>
          </section>
        )
      })}

      {uncategorized.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Other</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {uncategorized.map((comp) => (
              <ComponentCard key={comp.name} comp={comp} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

function ComponentCard({ comp }: { comp: { name: string; title: string; description: string; variants?: { name: string; values: string[] }[] } }) {
  return (
    <Link
      href={`/components/${comp.name}`}
      className="rounded-lg border p-5 hover:bg-accent/50 transition-colors"
    >
      <h3 className="font-semibold">{comp.title}</h3>
      <p className="text-sm text-muted-foreground mt-1">{comp.description}</p>
      {comp.variants && comp.variants.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {comp.variants.map((v) => (
            <span key={v.name} className="text-xs bg-muted px-2 py-0.5 rounded">
              {v.values.length} {v.name}s
            </span>
          ))}
        </div>
      )}
    </Link>
  )
}
