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
FROM caddy:2-alpine

COPY --from=builder /app/dist /srv/perry-ui
COPY Caddyfile /etc/caddy/Caddyfile

EXPOSE 80
