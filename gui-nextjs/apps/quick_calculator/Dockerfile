# syntax=docker/dockerfile:1.7

FROM node:20-alpine AS base
ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
ENV TURBO_TELEMETRY_DISABLED=1
ENV NEXT_TELEMETRY_DISABLED=1
RUN corepack enable && corepack prepare pnpm@10.28.0 --activate

FROM base AS deps
WORKDIR /app

# Copy workspace manifests first for better layer caching.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./

# Copy app package manifests explicitly so pnpm can resolve workspace links.
COPY apps/desktop/package.json apps/desktop/package.json
COPY apps/quick_calculator/package.json apps/quick_calculator/package.json
COPY apps/web/package.json apps/web/package.json

# Copy package manifests explicitly so pnpm can resolve workspace:* dependencies.
COPY packages/database/package.json packages/database/package.json
COPY packages/eslint-config/package.json packages/eslint-config/package.json
COPY packages/typescript-config/package.json packages/typescript-config/package.json
COPY packages/ui/package.json packages/ui/package.json

RUN pnpm install --no-frozen-lockfile

FROM base AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Re-link workspace dependencies against the full copied source tree.
RUN pnpm install --no-frozen-lockfile

RUN pnpm turbo run build --filter=quick_calculator...

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3002
ENV HOSTNAME=0.0.0.0

RUN addgroup -S nextjs && adduser -S nextjs -G nextjs

COPY --from=build /app/package.json ./package.json
COPY --from=build /app/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/apps/quick_calculator ./apps/quick_calculator
COPY --from=build /app/packages ./packages

USER nextjs
EXPOSE 3002

CMD ["pnpm", "--filter", "quick_calculator", "exec", "next", "start", "-H", "0.0.0.0", "-p", "3002"]
