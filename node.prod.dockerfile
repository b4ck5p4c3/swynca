FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* .yarnrc.yml package-lock.json* pnpm-lock.yaml* ./
RUN yarn config set network-timeout 1200000 \
    && corepack enable \
    && yarn set version stable \
    && yarn config set --home enableTelemetry 0
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

ARG NEXTAUTH_URL
ARG LOGTO_ISSUER
ARG LOGTO_M2M_ENDPOINT
ARG NEXT_PUBLIC_SWYNCA_TZ
ARG NEXT_PUBLIC_SWYNCA_LOCALE
ARG NEXT_PUBLIC_SWYNCA_CURRENCY
ARG NEXT_TELEMETRY_DISABLED

ENV NEXTAUTH_URL ${NEXTAUTH_URL}
ENV LOGTO_ISSUER ${LOGTO_ISSUER}
ENV LOGTO_M2M_ENDPOINT ${LOGTO_M2M_ENDPOINT}
ENV NEXT_PUBLIC_SWYNCA_TZ ${NEXT_PUBLIC_SWYNCA_TZ}
ENV NEXT_PUBLIC_SWYNCA_LOCALE ${NEXT_PUBLIC_SWYNCA_LOCALE}
ENV NEXT_PUBLIC_SWYNCA_CURRENCY ${NEXT_PUBLIC_SWYNCA_CURRENCY}
ENV NEXT_TELEMETRY_DISABLED ${NEXT_TELEMETRY_DISABLED}

RUN yarn prisma generate
RUN yarn build

# If using npm comment out above and use below instead
# RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
# Uncomment the following line in case you want to disable telemetry during runtime.
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

USER nextjs

# COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
