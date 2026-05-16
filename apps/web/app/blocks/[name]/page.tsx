import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { getBlockNames, getBlock } from "@/lib/registry"
import { InstallCommand } from "@/components/install-command"
import { PropsTable } from "@/components/props-table"
import { PlatformNotes } from "@/components/platform-notes"
import { CodeBlock } from "@/components/code-block"
import Link from "next/link"

export function generateStaticParams() {
  return getBlockNames().map((name) => ({ name }))
}

export async function generateMetadata({ params }: { params: Promise<{ name: string }> }): Promise<Metadata> {
  const { name } = await params
  try {
    const block = getBlock(name)
    return {
      title: `${block.title || block.name} — Perry UI`,
      description: block.description || `${block.name} block for Perry UI`,
    }
  } catch {
    return { title: "Block — Perry UI" }
  }
}

export default async function BlockPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params
  let block
  try {
    block = getBlock(name)
  } catch {
    notFound()
  }

  const sourceFile = block.files?.[0]?.content

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="max-w-3xl">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Link href="/blocks" className="hover:text-foreground">Blocks</Link>
          <span>/</span>
          <span className="text-foreground">{block.title}</span>
        </div>

        <h1 className="text-3xl font-bold">{block.title}</h1>
        <p className="text-lg text-muted-foreground mt-2">{block.description}</p>

        <div className="mt-6">
          <InstallCommand items={name} />
        </div>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Overview</h2>
          <p className="text-muted-foreground">{block.docs.overview}</p>
        </section>

        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Usage</h2>
          <CodeBlock code={block.docs.usage} language="typescript" />
        </section>

        {block.examples && block.examples.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-semibold mb-4">Examples</h2>
            <div className="space-y-4">
              {block.examples.map((ex) => (
                <div key={ex.name}>
                  <p className="text-sm font-medium mb-2">{ex.title}</p>
                  <CodeBlock code={ex.code} language="typescript" />
                </div>
              ))}
            </div>
          </section>
        )}

        {block.props && block.props.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-semibold mb-4">Props</h2>
            <PropsTable props={block.props} />
          </section>
        )}

        {sourceFile && (
          <section className="mt-10">
            <h2 className="text-xl font-semibold mb-4">Source Code</h2>
            <CodeBlock code={sourceFile} language="typescript" />
          </section>
        )}

        {block.docs.platformNotes && (
          <section className="mt-10">
            <h2 className="text-xl font-semibold mb-4">Platform Notes</h2>
            <PlatformNotes notes={block.docs.platformNotes} />
          </section>
        )}

        {block.registryDependencies && block.registryDependencies.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-semibold mb-2">Component Dependencies</h2>
            <div className="flex flex-wrap gap-2">
              {block.registryDependencies.map((dep) => (
                <Link key={dep} href={`/components/${dep}`}>
                  <span className="rounded-md border px-3 py-1 text-xs font-mono hover:bg-accent/50">
                    {dep}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
