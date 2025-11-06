FROM node:20-alpine AS builder
WORKDIR /app
# copy shared tsconfig from root
COPY tsconfig.base.json ./tsconfig.base.json

# copy config and service files
COPY config ./config

# copy package json for this service
COPY packages/gateway/package.json ./packages/gateway/package.json
RUN npm install --prefix ./packages/gateway

# copy service source
COPY packages/gateway ./packages/gateway

WORKDIR /app/packages/gateway
RUN npm run build

# ---- runner ----
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# copy built artifacts
COPY --from=builder /app/packages/gateway/dist ./dist
COPY --from=builder /app/packages/gateway/package.json ./package.json

# copy config (this was missing!)
COPY --from=builder /app/config ./config

RUN npm install --production --prefix .
EXPOSE 3000
CMD ["node", "dist/main.js"]
