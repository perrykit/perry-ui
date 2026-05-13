import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CodeBlock } from "@/components/code-block"
import { getRootRegistry, getComponentNames, getBlockNames } from "@/lib/registry"

const features = [
  { title: "Native-first", description: "Built around perry/ui. Real platform widgets, not web emulation." },
  { title: "Copy-paste ownership", description: "Source files live in your project. You own the code." },
  { title: "Beautiful defaults", description: "Minimal, modern design inspired by shadcn/ui and Linear." },
  { title: "Token-driven themes", description: "Design tokens with multiple built-in themes. Easy to customize." },
  { title: "Platform-aware", description: "Components adapt to macOS, iOS, Android, Linux, Windows, and Web." },
  { title: "Agent-ready", description: "Rich metadata so AI coding agents generate correct Perry UI screens." },
]

const platforms = [
  { name: "macOS", backend: "AppKit" },
  { name: "Linux", backend: "GTK4" },
  { name: "Windows", backend: "Win32" },
  { name: "iOS/iPadOS", backend: "UIKit" },
  { name: "Android", backend: "Views" },
  { name: "Web", backend: "DOM" },
]

export default function HomePage() {
  const registry = getRootRegistry()
  const components = getComponentNames()
  const blocks = getBlockNames()

  return (
    <div>
      {/* Hero */}
      <section className="border-b">
        <div className="mx-auto max-w-7xl px-6 py-24 md:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="secondary" className="mb-4">v{registry.version}</Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Beautiful native UI for Perry.
            </h1>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              Copy-paste components for building native TypeScript apps.
              Open code. Native widgets. Cross-platform by default.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg">
                <Link href="/docs/installation">Get Started</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/components">Browse Components</Link>
              </Button>
            </div>
            <div className="mt-10">
              <CodeBlock
                code={`bunx perry-ui init\nbunx perry-ui add button card input dialog`}
                className="max-w-md mx-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why Perry UI */}
      <section className="border-b">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <h2 className="text-2xl font-bold text-center mb-10">Why Perry UI?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <Card key={f.title}>
                <CardHeader>
                  <CardTitle className="text-base">{f.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{f.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Matrix */}
      <section className="border-b">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <h2 className="text-2xl font-bold text-center mb-10">Platform Support</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 max-w-3xl mx-auto">
            {platforms.map((p) => (
              <div key={p.name} className="rounded-lg border p-4 text-center">
                <p className="font-medium text-sm">{p.name}</p>
                <p className="text-xs text-muted-foreground mt-1">{p.backend}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Registry */}
      <section className="border-b">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Install components, not dependencies.</h2>
            <p className="text-muted-foreground mb-8">
              The registry contains {components.length} components, {blocks.length} blocks, and 5 themes.
              Every file is yours.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {components.slice(0, 10).map((name) => (
                <Link key={name} href={`/components/${name}`}>
                  <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                    {name}
                  </Badge>
                </Link>
              ))}
              <Link href="/components">
                <Badge variant="outline" className="cursor-pointer">+{components.length - 10} more</Badge>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section>
        <div className="mx-auto max-w-7xl px-6 py-20 text-center">
          <h2 className="text-2xl font-bold mb-4">Start building beautiful Perry apps.</h2>
          <CodeBlock code="bunx perry-ui init" className="max-w-xs mx-auto mb-6" />
          <Button asChild>
            <Link href="/docs/installation">Get Started</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
