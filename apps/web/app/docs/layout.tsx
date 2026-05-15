import { DocsLayoutWrapper } from "@/components/docs-layout-wrapper"

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return <DocsLayoutWrapper>{children}</DocsLayoutWrapper>
}
