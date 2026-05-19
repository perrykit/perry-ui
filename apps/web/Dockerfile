FROM oven/bun:1-alpine AS builder
WORKDIR /app

# Copy workspace root files for bun install
COPY package.json bun.lock ./
COPY packages/core/package.json packages/core/
COPY packages/registry/package.json packages/registry/
COPY apps/web/package.json apps/web/

# --ignore-scripts avoids postinstall overhead (next, shiki, etc.)
# CLI package excluded — not needed for web build
RUN bun install --ignore-scripts

# Copy source
COPY scripts/ scripts/
COPY packages/core/ packages/core/
COPY packages/registry/ packages/registry/
COPY apps/web/ apps/web/

# Build the registry data the web app imports
RUN bun run build:registry

# Build Next.js
WORKDIR /app/apps/web
RUN bun run build

# ── Production ──────────────────────────────────────────────────────
FROM oven/bun:1-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

RUN addgroup -S -g 1001 nodejs && \
    adduser -S -D -u 1001 -G nodejs nextjs

# Copy standalone output
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static

USER nextjs
EXPOSE 3000

CMD ["bun", "apps/web/server.js"]
