import { notFound } from "next/navigation"
import { getComponentNames, getComponent } from "@/lib/registry"
import { getExamplesByComponent } from "@/lib/examples"
import { InstallCommand } from "@/components/install-command"
import { PropsTable } from "@/components/props-table"
import { PlatformNotes } from "@/components/platform-notes"
import { CodeBlock } from "@/components/code-block"
import { ComponentPreview } from "@/components/component-preview"
import Link from "next/link"

export function generateStaticParams() {
  return getComponentNames().map((name) => ({ name }))
}

export default async function ComponentPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params
  let component
  try {
    component = getComponent(name)
  } catch {
    notFound()
  }

  const sourceFile = component.files?.[0]?.content

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="max-w-3xl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Link href="/components" className="hover:text-foreground">Components</Link>
          <span>/</span>
          <span className="text-foreground">{component.title}</span>
        </div>

        <h1 className="text-3xl font-bold">{component.title}</h1>
        <p className="text-lg text-muted-foreground mt-2">{component.description}</p>

        {/* Install */}
        <div className="mt-6">
          <InstallCommand items={name} />
        </div>

        {/* Preview */}
        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Preview</h2>
          <ComponentPreview name={name} title={component.title} />
          <p className="text-sm text-muted-foreground mt-4">
            Perry UI components are designed for native apps. See the examples section for runnable apps demonstrating these components.
          </p>
        </section>

        {/* Usage */}
        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">Usage</h2>
          <CodeBlock code={component.docs.usage} language="typescript" />
        </section>

        {/* Variants */}
        {component.variants && component.variants.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-semibold mb-4">Variants</h2>
            <div className="space-y-4">
              {component.variants.map((v) => (
                <div key={v.name}>
                  <p className="text-sm font-medium mb-2 capitalize">{v.name}</p>
                  <div className="flex flex-wrap gap-2">
                    {v.values.map((val) => (
                      <span
                        key={val}
                        className="rounded-md border px-3 py-1 text-xs font-mono"
                      >
                        {val}{v.defaultValue === val ? " (default)" : ""}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Examples */}
        {component.examples && component.examples.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-semibold mb-4">Examples</h2>
            <div className="space-y-4">
              {component.examples.map((ex) => (
                <div key={ex.name}>
                  <p className="text-sm font-medium mb-2">{ex.title}</p>
                  <CodeBlock code={ex.code} language="typescript" />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Related Examples */}
        {(() => {
          const relatedExamples = getExamplesByComponent(name)
          return relatedExamples.length > 0 ? (
            <section className="mt-10">
              <h2 className="text-xl font-semibold mb-4">Related Examples</h2>
              <p className="text-sm text-muted-foreground mb-4">
                See this component in action with these runnable examples:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {relatedExamples.map((ex) => (
                  <Link
                    key={ex.id}
                    href={ex.href}
                    className="group rounded-lg border p-4 hover:bg-accent/50 transition-colors"
                  >
                    <h3 className="text-sm font-semibold group-hover:text-primary transition-colors">
                      {ex.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">{ex.description}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {ex.tags.map((tag) => (
                        <span key={tag} className="text-xs bg-muted px-2 py-0.5 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ) : null
        })()}

        {/* Props */}
        {component.props && component.props.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-semibold mb-4">Props</h2>
            <PropsTable props={component.props} />
          </section>
        )}

        {/* Source */}
        {sourceFile && (
          <section className="mt-10">
            <h2 className="text-xl font-semibold mb-4">Source Code</h2>
            <CodeBlock code={sourceFile} language="typescript" />
          </section>
        )}

        {/* Accessibility */}
        {component.docs.accessibility && (
          <section className="mt-10">
            <h2 className="text-xl font-semibold mb-2">Accessibility</h2>
            <p className="text-sm text-muted-foreground">{component.docs.accessibility}</p>
          </section>
        )}

        {/* Platform Notes */}
        {component.docs.platformNotes && (
          <section className="mt-10">
            <h2 className="text-xl font-semibold mb-4">Platform Notes</h2>
            <PlatformNotes notes={component.docs.platformNotes} />
          </section>
        )}

        {/* Dependencies */}
        {component.registryDependencies && component.registryDependencies.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-semibold mb-2">Dependencies</h2>
            <div className="flex flex-wrap gap-2">
              {component.registryDependencies.map((dep) => (
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
