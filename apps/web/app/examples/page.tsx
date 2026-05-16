import Link from "next/link"
import type { Metadata } from "next"
import { getAllExamples } from "@/lib/examples"

export const metadata: Metadata = {
  title: "Examples — Perry UI",
  description: "Runnable Perry apps demonstrating Perry UI components in action.",
}

export default function ExamplesPage() {
  const examples = getAllExamples()

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="text-3xl font-bold">Examples</h1>
      <p className="text-lg text-muted-foreground mt-2 mb-8">
        Runnable Perry apps demonstrating Perry UI components in action.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {examples.map((example) => (
          <Link
            key={example.id}
            href={example.href}
            className="group rounded-lg border p-6 hover:bg-accent/50 transition-colors"
          >
            <div className="mb-4">
              <h2 className="text-xl font-semibold group-hover:text-primary transition-colors">
                {example.title}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">{example.description}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="text-xs bg-muted px-2 py-1 rounded">{example.component}</span>
              {example.tags.map((tag) => (
                <span key={tag} className="text-xs bg-muted px-2 py-1 rounded">
                  {tag}
                </span>
              ))}
            </div>
            <div className="mt-4 text-sm text-muted-foreground">
              <p className="mb-2">
                <strong>Run this example:</strong>
              </p>
              <pre className="bg-muted p-2 rounded text-xs overflow-x-auto">
                <code>cd {example.name} && bun install && bun run dev</code>
              </pre>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
