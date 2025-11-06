FROM node:20-alpine AS builder
WORKDIR /app
# copy shared tsconfig from root
COPY tsconfig.base.json ./tsconfig.base.json
# copy package json for this service
COPY packages/order-service/package.json ./packages/order-service/package.json
RUN npm install --prefix ./packages/order-service
# copy service source
COPY packages/order-service ./packages/order-service
WORKDIR /app/packages/order-service
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/packages/order-service/dist ./dist
COPY --from=builder /app/packages/order-service/package.json ./package.json
RUN npm install --production --prefix .
EXPOSE 3000
CMD ["node", "dist/main.js"]
