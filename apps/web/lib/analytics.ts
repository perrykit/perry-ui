/**
 * Perry UI Analytics
 *
 * Privacy-focused analytics using Plausible.
 * Tracks component views, CLI downloads, and doc engagement.
 */

// Plausible script loader
export function initAnalytics(domain: string = "perry-ui.com") {
  if (typeof window === "undefined") return

  const script = document.createElement("script")
  script.async = true
  script.defer = true
  script.dataset.domain = domain
  script.src = "https://plausible.io/js/script.js"

  document.head.appendChild(script)
}

/**
 * Track component page view
 */
export function trackComponentView(component: string) {
  if (typeof window === "undefined" || !(window as any).plausible) return

  ;(window as any).plausible("componentView", {
    props: { component }
  })
}

/**
 * Track block page view
 */
export function trackBlockView(block: string) {
  if (typeof window === "undefined" || !(window as any).plausible) return

  ;(window as any).plausible("blockView", {
    props: { block }
  })
}

/**
 * Track doc page view
 */
export function trackDocPage(doc: string) {
  if (typeof window === "undefined" || !(window as any).plausible) return

  ;(window as any).plausible("docView", {
    props: { doc }
  })
}

/**
 * Track CLI download/copy command
 */
export function trackCliDownload() {
  if (typeof window === "undefined" || !(window as any).plausible) return

  ;(window as any).plausible("cliDownload")
}

/**
 * Track search query
 */
export function trackSearch(query: string, results: number) {
  if (typeof window === "undefined" || !(window as any).plausible) return

  ;(window as any).plausible("search", {
    props: {
      query: query.substring(0, 50), // Limit length
      results
    }
  })
}

/**
 * Track outbound link click
 */
export function trackOutboundLink(url: string, label: string) {
  if (typeof window === "undefined" || !(window as any).plausible) return

  ;(window as any).plausible("outboundLink", {
    props: {
      url: url.substring(0, 100),
      label
    }
  })
}
