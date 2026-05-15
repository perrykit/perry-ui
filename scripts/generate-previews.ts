/**
 * Screenshot Generation Script
 *
 * This script uses Puppeteer to capture screenshots of all Perry UI components.
 * Screenshots are saved as WebP images for optimal web performance.
 *
 * Usage: bun run scripts/generate-previews.ts
 */

import puppeteer from "puppeteer"
import { existsSync, mkdirSync } from "fs"
import { join } from "path"

const COMPONENTS = [
  "alert",
  "avatar",
  "badge",
  "button",
  "card",
  "checkbox",
  "dialog",
  "input",
  "label",
  "select",
  "separator",
  "slider",
  "switch",
  "table",
  "tabs",
  "textarea",
  "tooltip",
  "vstack",
  "hstack",
]

const OUTPUT_DIR = join(process.cwd(), "apps/web/public/images/previews")
const BASE_URL = "http://localhost:3005"
const SCREENSHOT_WIDTH = 1200
const SCREENSHOT_HEIGHT = 800
const MAX_RETRIES = 3

interface ScreenshotResult {
  component: string
  success: boolean
  path?: string
  error?: string
  duration: number
}

/**
 * Ensure output directory exists
 */
function ensureOutputDir() {
  if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true })
    console.log(`Created output directory: ${OUTPUT_DIR}`)
  }
}

/**
 * Start dev server if not already running
 */
async function startDevServer() {
  console.log("Checking if dev server is running...")

  try {
    const response = await fetch(`${BASE_URL}/api/health`, {
      signal: AbortSignal.timeout(1000),
    })
    if (response.ok) {
      console.log("✓ Dev server already running")
      return
    }
  } catch {
    // Server not running, start it
  }

  console.log("Starting dev server...")
  const serverProcess = Bun.spawn(["bun", "run", "dev:web"], {
    cwd: join(process.cwd(), "apps/web"),
    stdout: "inherit",
    stderr: "inherit",
  })

  // Wait for server to be ready
  let retries = 0
  while (retries < MAX_RETRIES) {
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      const response = await fetch(BASE_URL, {
        signal: AbortSignal.timeout(1000),
      })
      if (response.ok) {
        console.log("✓ Dev server started")
        return serverProcess
      }
    } catch {
      retries++
      console.log(`Waiting for server... (${retries}/${MAX_RETRIES})`)
    }
  }

  throw new Error("Failed to start dev server")
}

/**
 * Capture screenshot for a single component
 */
async function captureComponentScreenshot(
  browser: puppeteer.Browser,
  componentName: string
): Promise<ScreenshotResult> {
  const startTime = Date.now()
  const page = await browser.newPage()
  const result: ScreenshotResult = {
    component: componentName,
    success: false,
    duration: 0,
  }

  try {
    // Set viewport
    await page.setViewport({
      width: SCREENSHOT_WIDTH,
      height: SCREENSHOT_HEIGHT,
      deviceScaleFactor: 2, // Retina quality
    })

    // Navigate to component page
    const url = `${BASE_URL}/components/${componentName}`
    console.log(`  Navigating to ${url}`)

    await page.goto(url, {
      waitUntil: "networkidle0",
      timeout: 30000,
    })

    // Wait for component to hydrate
    await page.waitForSelector('[data-component-preview]', { timeout: 10000 })

    // Wait a bit more for any animations
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Find the component demo section
    const demoElement = await page.$('[data-component-demo]')

    if (!demoElement) {
      throw new Error("Component demo element not found")
    }

    // Capture screenshot
    const outputPath = join(OUTPUT_DIR, `${componentName}.webp`)
    await demoElement.screenshot({
      path: outputPath,
      type: "webp",
      quality: 85,
    })

    result.success = true
    result.path = outputPath
    result.duration = Date.now() - startTime

    console.log(`  ✓ Screenshot saved: ${outputPath}`)
  } catch (error) {
    result.error = error instanceof Error ? error.message : String(error)
    result.duration = Date.now() - startTime
    console.error(`  ✗ Failed: ${result.error}`)
  } finally {
    await page.close()
  }

  return result
}

/**
 * Generate placeholder SVG
 */
function generatePlaceholder() {
  const svgPath = join(OUTPUT_DIR, "placeholder.svg")
  const svgContent = `
<svg width="1200" height="800" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="800" fill="#f4f4f5"/>
  <text x="600" y="400" font-family="system-ui, sans-serif" font-size="24" fill="#71717a" text-anchor="middle">
    Preview Coming Soon
  </text>
  <text x="600" y="440" font-family="system-ui, sans-serif" font-size="16" fill="#a1a1aa" text-anchor="middle">
    Component preview will be added in the next update
  </text>
</svg>
`

  Bun.write(svgPath, svgContent.trim())
  console.log(`✓ Placeholder created: ${svgPath}`)
}

/**
 * Generate manifest JSON
 */
function generateManifest(results: ScreenshotResult[]) {
  const manifest = {
    generated: new Date().toISOString(),
    components: results.map((r) => ({
      name: r.component,
      success: r.success,
      path: r.success ? `/images/previews/${r.component}.webp` : null,
      error: r.error,
      duration: r.duration,
    })),
    summary: {
      total: results.length,
      successful: results.filter((r) => r.success).length,
      failed: results.filter((r) => !r.success).length,
      totalDuration: results.reduce((sum, r) => sum + r.duration, 0),
    },
  }

  const manifestPath = join(OUTPUT_DIR, "manifest.json")
  Bun.write(manifestPath, JSON.stringify(manifest, null, 2))
  console.log(`\n✓ Manifest created: ${manifestPath}`)
  console.log(
    `  Summary: ${manifest.summary.successful}/${manifest.summary.total} successful`
  )
}

/**
 * Main function
 */
async function main() {
  console.log("🎨 Perry UI Screenshot Generator")
  console.log("=" .repeat(50))

  try {
    // Setup
    ensureOutputDir()
    await startDevServer()

    // Launch browser
    console.log("\nLaunching browser...")
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    })

    // Capture screenshots
    console.log("\nCapturing screenshots...")
    const results: ScreenshotResult[] = []

    for (const component of COMPONENTS) {
      console.log(`\n[${COMPONENTS.indexOf(component) + 1}/${COMPONENTS.length}] ${component}`)
      const result = await captureComponentScreenshot(browser, component)
      results.push(result)

      // Small delay between screenshots
      await new Promise((resolve) => setTimeout(resolve, 500))
    }

    // Cleanup
    await browser.close()
    console.log("\n✓ Browser closed")

    // Generate placeholder and manifest
    generatePlaceholder()
    generateManifest(results)

    // Keep dev server running or stop it
    console.log("\n" + "=".repeat(50))
    console.log("✓ Screenshot generation complete!")
    console.log(`\nTo stop the dev server, press Ctrl+C`)

    // Keep process alive
    await new Promise(() => {})
  } catch (error) {
    console.error("\n✗ Error:", error)
    process.exit(1)
  }
}

// Run
main()
