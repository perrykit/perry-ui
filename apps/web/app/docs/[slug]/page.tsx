import { readFileSync, readdirSync } from "fs"
import { join } from "path"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { MDXRemote } from "next-mdx-remote/rsc"

const CONTENT_DIR = join(process.cwd(), "content/docs")

export function generateStaticParams() {
  try {
    return readdirSync(CONTENT_DIR)
      .filter((f) => f.endsWith(".mdx"))
      .map((f) => ({ slug: f.replace(".mdx", "") }))
  } catch {
    return []
  }
}

function getDocContent(slug: string) {
  try {
    return readFileSync(join(CONTENT_DIR, `${slug}.mdx`), "utf-8")
  } catch {
    return null
  }
}

const DOC_TITLES: Record<string, string> = {
  "getting-started": "Getting Started",
  installation: "Installation",
  tutorial: "Tutorial",
  cli: "CLI Reference",
  registry: "Registry",
  theming: "Theming",
  tokens: "Design Tokens",
  variants: "Variants",
  accessibility: "Accessibility",
  platforms: "Platforms",
  contributing: "Contributing",
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const title = DOC_TITLES[slug] || slug
  return {
    title: `${title} — Perry UI Docs`,
    description: `Perry UI documentation: ${title.toLowerCase()}`,
  }
}

export default function DocPage({ params }: { params: Promise<{ slug: string }> }) {
  // For static generation with Next.js 15
  return <DocPageInner params={params} />
}

async function DocPageInner({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const source = getDocContent(slug)
  if (!source) notFound()

  return (
    <div className="prose prose-zinc dark:prose-invert max-w-none">
      <MDXRemote source={source} />
    </div>
  )
}
