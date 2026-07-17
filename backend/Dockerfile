# Stage de build (também usado pelo seed)
FROM node:22-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY tsconfig.json ./
COPY src ./src
COPY scripts ./scripts

RUN npm run build

# Desenvolvimento com hot reload (tsx watch)
FROM node:22-alpine AS development
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY tsconfig.json ./
COPY src ./src
COPY scripts ./scripts

EXPOSE 3333

CMD ["npm", "run", "dev"]

# Imagem de produção
FROM node:22-alpine AS production
WORKDIR /app

ENV NODE_ENV=production

COPY package.json package-lock.json ./
RUN npm install --omit=dev

COPY --from=build /app/dist ./dist

EXPOSE 3333

CMD ["node", "dist/main.js"]
