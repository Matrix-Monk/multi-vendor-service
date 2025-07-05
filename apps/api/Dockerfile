FROM node:22-alpine

WORKDIR /app

COPY pnpm-workspace.yaml ./
COPY package.json ./

COPY apps/api/package.json ./apps/api/
COPY packages/db/package.json ./packages/db/
COPY packages/typescript-config/package.json ./packages/typescript-config/

COPY packages/db ./packages/db
COPY packages/typescript-config ./packages/typescript-config

RUN npm install -g pnpm

RUN pnpm install

COPY . .

RUN pnpm run build

WORKDIR /app/apps/api

CMD ["pnpm", "run", "dev"]   