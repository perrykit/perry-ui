import { createHighlighter, type Highlighter } from "shiki"

let highlighterPromise: Promise<Highlighter> | null = null

function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ["github-dark", "github-light"],
      langs: ["typescript", "tsx", "bash", "json"],
    })
  }
  return highlighterPromise
}

export async function highlightCode(code: string, language: string = "typescript") {
  const highlighter = await getHighlighter()

  const lang = highlighter.getLoadedLanguages().includes(language) ? language : "typescript"

  return highlighter.codeToHtml(code, {
    lang,
    themes: {
      dark: "github-dark",
      light: "github-light",
    },
  })
}
