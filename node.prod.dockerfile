FROM node:18-alpine AS base

FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json yarn.lock .yarnrc.yml ./
RUN corepack enable && yarn set version stable
RUN yarn --immutable

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

ARG NEXT_PUBLIC_SWYNCA_TZ
ARG NEXT_PUBLIC_SWYNCA_LOCALE
ARG NEXT_PUBLIC_SWYNCA_CURRENCY

ENV NEXT_PUBLIC_SWYNCA_TZ ${NEXT_PUBLIC_SWYNCA_TZ}
ENV NEXT_PUBLIC_SWYNCA_LOCALE ${NEXT_PUBLIC_SWYNCA_LOCALE}
ENV NEXT_PUBLIC_SWYNCA_CURRENCY ${NEXT_PUBLIC_SWYNCA_CURRENCY}

RUN yarn prisma generate
RUN yarn build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

USER nextjs

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
