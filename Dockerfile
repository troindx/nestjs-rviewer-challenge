FROM node:latest AS builder

LABEL MAINTENER="Juan Vilar"
WORKDIR "/app"
COPY . .
RUN npm ci
RUN npm run build
RUN npm prune --production

FROM node:latest AS production
WORKDIR "/app"
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
CMD [ "sh", "-c", "npm run start:prod"]

EXPOSE 3000/tcp
