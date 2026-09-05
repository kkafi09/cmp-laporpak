# Build Stage
FROM node:20-alpine AS builder

WORKDIR /app
RUN npm install -g pnpm@9

# Copy root workspace configs & lockfile
COPY .npmrc pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY packages/shared/package.json ./packages/shared/
COPY apps/web/package.json ./apps/web/

# Install all workspace dependencies
RUN pnpm install --frozen-lockfile

# Copy shared library source & compile
COPY packages/shared ./packages/shared
RUN pnpm --filter @laporpak/shared build

# Copy web frontend source & compile
COPY apps/web ./apps/web
RUN pnpm --filter @laporpak/web build

# Production Stage with Nginx
FROM nginx:alpine

COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/apps/web/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
