import Link from "next/link"
import { getAllBlocks } from "@/lib/registry"

export default function BlocksPage() {
  const blocks = getAllBlocks()

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="text-3xl font-bold">Blocks</h1>
      <p className="text-lg text-muted-foreground mt-2 mb-8">
        Pre-built screen compositions using multiple components.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {blocks.map((block) => (
          <Link
            key={block.name}
            href={`/blocks/${block.name}`}
            className="rounded-lg border p-5 hover:bg-accent/50 transition-colors"
          >
            <h2 className="font-semibold">{block.title}</h2>
            <p className="text-sm text-muted-foreground mt-1">{block.description}</p>
            {block.registryDependencies && block.registryDependencies.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {block.registryDependencies.map((dep) => (
                  <span key={dep} className="text-xs bg-muted px-2 py-0.5 rounded">{dep}</span>
                ))}
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  )
}
