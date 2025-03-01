FROM node:23-alpine AS base

FROM base AS builder
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk update
RUN apk add --no-cache libc6-compat
# 启用 corepack 并激活 pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate
# Set working directory
WORKDIR /app
# 使用 yarn 全局安装 turbo
RUN yarn global add turbo
COPY . .
RUN turbo prune @app/graphql --docker

# Add lockfile and package.json's of isolated subworkspace
FROM base AS installer
RUN apk update
RUN apk add --no-cache libc6-compat
# 启用 corepack 并激活 pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

# First install dependencies (as they change less often)
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml .
RUN pnpm install

# Build the project and its dependencies
COPY --from=builder /app/out/full/ .
RUN pnpm turbo build

FROM base AS runner
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 divi
RUN adduser --system --uid 1001 divi
USER divi
COPY --from=installer /app .

EXPOSE 4000
CMD ["node", "apps/graphql/dist/index.js"]
