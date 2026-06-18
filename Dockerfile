FROM --platform=linux/amd64 node:24-slim AS builder

WORKDIR /usr/src/app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM --platform=linux/amd64 node:24-slim AS production

WORKDIR /usr/src/app

ENV NODE_ENV=production

RUN groupadd -r nodejs && useradd -r -g nodejs -s /bin/false nodejs

COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=builder --chown=nodejs:nodejs /usr/src/app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /usr/src/app/src/assets ./src/assets
COPY --from=builder --chown=nodejs:nodejs /usr/src/app/drizzle.config.ts ./
COPY --from=builder --chown=nodejs:nodejs /usr/src/app/src/db/migrations ./src/db/migrations
COPY --from=builder --chown=nodejs:nodejs /usr/src/app/src/db/schema.ts ./src/db/schema.ts

USER nodejs

CMD ["node", "dist/main.js"]
