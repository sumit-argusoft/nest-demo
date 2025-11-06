FROM node:20-alpine AS builder
WORKDIR /app
# copy shared tsconfig from root
COPY tsconfig.base.json ./tsconfig.base.json
# copy package json for this service
COPY packages/user-service/package.json ./packages/user-service/package.json
RUN npm install --prefix ./packages/user-service
# copy service source
COPY packages/user-service ./packages/user-service
WORKDIR /app/packages/user-service
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/packages/user-service/dist ./dist
COPY --from=builder /app/packages/user-service/package.json ./package.json
RUN npm install --production --prefix .
EXPOSE 3000
CMD ["node", "dist/main.js"]
