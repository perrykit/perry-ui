import { highlightCode } from "@/lib/highlight"
import { CodeBlockCopyButton } from "@/components/code-block-copy-button"
import React from "react"

interface CodeElementProps {
  className?: string
  children?: React.ReactNode
}

function extractLanguage(className?: string): string {
  if (!className) return "typescript"
  const match = className.match(/language-(\w+)/)
  return match ? match[1] : "typescript"
}

function extractTextContent(children: React.ReactNode): string {
  if (typeof children === "string") return children
  if (typeof children === "number") return String(children)
  if (Array.isArray(children)) return children.map(extractTextContent).join("")
  if (React.isValidElement(children)) {
    const props = children.props as { children?: React.ReactNode }
    if (props.children) return extractTextContent(props.children)
  }
  return ""
}

async function Pre({ children, ...props }: React.ComponentProps<"pre">) {
  const codeElement = React.Children.toArray(children).find(
    (child): child is React.ReactElement<CodeElementProps> => {
      if (!React.isValidElement(child)) return false
      return child.type === "code"
    }
  )

  if (!codeElement) {
    return <pre {...props}>{children}</pre>
  }

  const codeProps = codeElement.props as CodeElementProps
  const language = extractLanguage(codeProps.className)
  const rawCode = extractTextContent(codeProps.children)
  const highlightedHtml = await highlightCode(rawCode, language)

  return (
    <div className="group relative rounded-lg border bg-muted/50 my-4">
      <div className="flex items-center justify-between border-b px-4 py-2">
        <span className="text-xs text-muted-foreground font-mono">{language}</span>
        <CodeBlockCopyButton code={rawCode} />
      </div>
      <div
        className="overflow-x-auto p-4 text-sm [&_pre]:!bg-transparent [&_pre]:!p-0 [&_pre]:!m-0 [&_code]:!bg-transparent"
        dangerouslySetInnerHTML={{ __html: highlightedHtml }}
      />
    </div>
  )
}

function Table({ children, ...props }: React.ComponentProps<"table">) {
  return (
    <div className="overflow-x-auto rounded-lg border my-4 not-prose">
      <table className="w-full text-sm" {...props}>
        {children}
      </table>
    </div>
  )
}

function Thead({ children, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead {...props}>
      <tr className="border-b bg-muted/50">
        {children}
      </tr>
    </thead>
  )
}

function Th({ children, ...props }: React.ComponentProps<"th">) {
  return (
    <th className="px-4 py-2.5 text-left font-medium" {...props}>
      {children}
    </th>
  )
}

function Td({ children, ...props }: React.ComponentProps<"td">) {
  return (
    <td className="px-4 py-2.5 border-b last:border-0" {...props}>
      {children}
    </td>
  )
}

export const mdxComponents = {
  pre: Pre,
  table: Table,
  thead: Thead,
  th: Th,
  td: Td,
}
