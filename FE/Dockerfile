# ---- Build stage ----
FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json vite.config.ts index.html ./
COPY public/ ./public/
COPY src/ ./src/

# Build ให้ FE ชี้ไปที่ BE ผ่าน /messages (nginx จะ proxy ต่อ)
RUN npm run build

# ---- Serve stage ----
FROM nginx:alpine

# คัดลอก static files ที่ build แล้ว
COPY --from=build /app/dist /usr/share/nginx/html

# nginx config: serve static + proxy /messages → be:3000
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
