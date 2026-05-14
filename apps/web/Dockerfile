FROM oven/bun:1 AS builder
WORKDIR /app

# Copy workspace root files for bun install
COPY package.json bun.lock ./
COPY packages/core/package.json packages/core/
COPY packages/registry/package.json packages/registry/
COPY packages/cli/package.json packages/cli/
COPY apps/web/package.json apps/web/

RUN bun install

# Copy source
COPY scripts/ scripts/
COPY packages/core/ packages/core/
COPY packages/registry/ packages/registry/
COPY packages/cli/ packages/cli/
COPY apps/web/ apps/web/

# Build the registry data the web app imports
RUN bun run build:registry

# Build Next.js
WORKDIR /app/apps/web
RUN bun run build

# ── Production ──────────────────────────────────────────────────────
FROM oven/bun:1 AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

RUN groupadd --system --gid 1001 nodejs && \
    useradd --system --uid 1001 --gid nodejs nextjs

# Copy standalone output
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static

USER nextjs
EXPOSE 3000

CMD ["bun", "apps/web/server.js"]
