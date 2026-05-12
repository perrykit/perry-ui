FROM oven/bun:1 AS builder
WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .
RUN bun run build:registry

FROM caddy:2-alpine

COPY --from=builder /app/dist /srv/perry-ui
COPY Caddyfile /etc/caddy/Caddyfile

EXPOSE 80 443
