FROM oven/bun:1 AS builder
WORKDIR /app

# Copy workspace root files for bun install
COPY package.json bun.lock ./
COPY packages/core/package.json packages/core/
COPY packages/registry/package.json packages/registry/

RUN bun install

COPY packages/core/ packages/core/
COPY packages/registry/ packages/registry/
COPY scripts/ scripts/

RUN bun run build:registry

# ── Production ──────────────────────────────────────────────────────
FROM oven/bun:1 AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

COPY --from=builder /app/dist ./dist
COPY --chmod=755 <<'EOF' /app/serve.ts
const port = parseInt(process.env.PORT || "3000")
const distDir = new URL("./dist/", import.meta.url).pathname

Bun.serve({
  port,
  async fetch(req) {
    const url = new URL(req.url)
    let path = url.pathname

    // Default to /r/ prefix for registry access
    if (path === "/") path = "/r/registry.json"

    // Try exact path, then with /r/ prefix
    let filePath = `${distDir}${path}`
    let file = Bun.file(filePath)
    if (!(await file.exists())) {
      filePath = `${distDir}/r${path}`
      file = Bun.file(filePath)
    }

    if (await file.exists()) {
      return new Response(file, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, OPTIONS",
          "Content-Type": "application/json",
        },
      })
    }

    return new Response("Not Found", { status: 404 })
  },
})

console.log(`Registry serving on :${port}`)
EOF

EXPOSE 3000
CMD ["bun", "run", "/app/serve.ts"]
