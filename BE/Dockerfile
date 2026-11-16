# ใช้ Node 22 (ต้องการ node:sqlite ซึ่งมีใน Node 22.5+ และ stable ใน 22.13+)
FROM node:22-alpine

WORKDIR /app

# ติดตั้ง dependencies ทั้งหมด (รวม tsx ที่อยู่ใน devDependencies)
COPY package*.json ./
RUN npm ci

# คัดลอกโค้ด
COPY tsconfig.json ./
COPY src/ ./src/

EXPOSE 3000

# รันผ่าน tsx (ไม่ใช้ --watch เพื่อให้เหมาะกับ container)
CMD ["npx", "tsx", "src/app.ts"]
