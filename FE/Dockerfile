# ---- Build stage ----
FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json vite.config.ts index.html ./
COPY public/ ./public/
COPY src/ ./src/

ARG VITE_BE_URL
ENV VITE_BE_URL=$VITE_BE_URL

# Vite ฝัง VITE_BE_URL ลง bundle ตอน build
RUN npm run build

# ---- Serve stage ----
FROM nginx:alpine

# คัดลอก static files ที่ build แล้ว
COPY --from=build /app/dist /usr/share/nginx/html

# เก็บ public ไว้อีกชุดเพื่อให้ mount ทับได้ → เพิ่มรูปใหม่แล้วเห็นทันทีโดยไม่ rebuild
COPY --from=build /app/public /usr/share/nginx/public

# nginx config: serve static (public ก่อน, fallback dist) + proxy /messages → be:3000
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
