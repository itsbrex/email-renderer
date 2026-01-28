FROM mcr.microsoft.com/playwright:v1.58.0-noble

WORKDIR /app

RUN npm install -g bun

COPY package.json bun.lock ./
COPY packages/types/package.json ./packages/types/
COPY packages/analyser/package.json ./packages/analyser/
COPY packages/clients/package.json ./packages/clients/
COPY apps/renderer/package.json ./apps/renderer/

RUN bun install

COPY packages/types ./packages/types
COPY packages/analyser ./packages/analyser
COPY packages/clients ./packages/clients
COPY apps/renderer ./apps/renderer

WORKDIR /app/apps/renderer

RUN bun run build

ENV PORT=3001
ENV NODE_ENV=production

EXPOSE 3001

CMD ["node", "dist/index.js"]
