1. Fork โปรเจกต์ไปไว้ใน Github ของตัวเอง แล้วตั้ง 
2. Clone จาก fork ของตัวเอง

git clone 
cd Main-Chat-AI

3. สร้าง `BE/.env` copy code จาก `BE/.env.example` และใส่ `LLM_API_KEY`

4. docker-compose build — ติดตั้ง dependency ทั้ง FE และ BE ใน Dockerfile อัตโนมัติ (`RUN npm ci` ของ BE และ `RUN npm install` ของ FE) โดยไม่ต้อง `npm install` บนโฮสต์


หน้า Home, หน้าสมาชิก และโมเดล 3D ใช้ข้อมูลฝั่ง FE จึงเปิดได้ไม่ต้องรัน BE — เฉพาะหน้า CHAT AI ที่ต้องรัน BE

| BE | `npm run dev` | รัน BE (restart เองเมื่อแก้ไฟล์) |
| BE | `npm run check` | ตรวจ TypeScript |
| BE | `npm run seed` | seed ข้อมูลลง PostgreSQL |
| FE | `npm run dev` | รัน Vite dev server |
| FE | `npm run typecheck` | ตรวจ TypeScript ฝั่ง FE |
| FE | `npm run build` | build production |

ระวัง: `docker-compose.yml` mount เฉพาะ `FE/src`, `FE/public`, `FE/index.html` และ `FE/vite.config.ts` — **ไม่ได้ mount `package.json`** ดังนั้นถ้าเพิ่ม dependency ใหม่ (เช่น `three`) ต้อง `docker compose build fe` ใหม่ และถ้าเพิ่มไฟล์ใหม่ลง `public/` หลัง Vite start ต้อง restart container FE ด้วย

สร้าง `BE/.env` ก่อน แล้ว:

```bash
docker compose up --build
```

เข้าได้ที่ http://localhost หรือ http://localhost:5173

ข้อควรระวัง: `docker-compose.yml` mount เฉพาะ `FE/src`, `FE/public`, `FE/index.html` และ `FE/vite.config.ts` — **ไม่ได้ mount `package.json`** ดังนั้นถ้าเพิ่ม dependency ใหม่ (เช่น `three`) ต้อง `docker compose build fe` ใหม่

**เพิ่มรูป/asset ใหม่ลง `FE/public/` → เว็บเห็นทันที ไม่ต้อง restart หรือ rebuild:**

- **Dev** (`docker compose up -d fe` หรือ `cd FE && npm run dev`): plugin `livePublicAssets` ใน `vite.config.ts` เสิร์ฟไฟล์จาก `public/` แบบอ่านจากดิสก์ทุก request และ sync ไฟล์เข้า `dist/` ให้อัตโนมัติ
- **Production** (`docker compose --profile prod up -d fe-prod`): nginx เสิร์ฟ `/usr/share/nginx/public` ที่ mount จาก `./FE/public` ก่อน แล้วค่อย fallback ไป `dist/` → ไม่ต้อง `docker compose build fe-prod` ใหม่เมื่อเพิ่มรูป
- ยังใช้ path แบบ root เหมือนเดิม เช่น `/profiles/profile-A.jpg` (ห้ามใช้ path แบบเครื่อง)

## เพิ่มโมเดล 3D

1. วางไฟล์ `.glb` ไว้ที่ `FE/public/models/`
2. เพิ่ม/แก้ผลงานใน `FE/src/data/members.ts`:

```ts
{
  id: 'art-09',
  category: '3d',
  title: 'My Model',
  modelUrl: '/models/my-model.glb',
  model3dType: 'cyber-cube'
}
```

**เครดิตโมเดลตัวอย่าง:** `Fox.glb` จาก [Khronos glTF Sample Assets](https://github.com/KhronosGroup/glTF-Sample-Assets/tree/main/Models/Fox) — model © PixelMannen (CC0), rigging & animation © tomkranis (CC BY 4.0), glTF conversion © AsoboStudio & scurest (CC BY 4.0)

## รันบน Vercel และ Render

### Vercel — ใช้งานเต็มฟีเจอร์ (CHAT AI ต้องมี BE บน Vercel)
- เชื่อม GitHub เข้ากับ [Vercel](https://vercel.com/dashboard) → Import Project — Vercel build ทั้งสอง services จาก `vercel.json`:
  - **`fe`** (root `FE/`, runtime container, entrypoint `Dockerfile`) — nginx แสดง Home / MEMBERS / CHAT PAGE (static จาก `FE/dist`)
  - **`be`** (root `BE/`, runtime container, entrypoint `Dockerfile`) — Express API + SQLite (พอร์ท 3000)
- `/messages` และ `/status` ถูก rewrite ไปยัง service `be` โดยอัตโนมัติ — Home / MEMBERS / CHAT PAGE ทำงานปกติ และหน้า CHAT AI จะเชื่อมกับ BE ได้เลย
- ตั้งค่า env ใน Vercel Dashboard: `LLM_API_KEY` (ตาม `BE/.env.example` เพื่อใช้หน้า CHAT AI), `LLM_MODEL` (optional)

### Render — รันทั้ง BE และ FE
- นำ `render.yaml` (อยู่ที่ repo root) มาใช้ผ่าน Dashboard: **Web Service** `be` (Node runtime, `cd BE && npm start` — Express + node:sqlite พอร์ท 3000) และ **Static Site** `fe` (build `cd FE && npm run build` → serve ที่ `FE/dist`)
- บน Static Site เปิด **SPA Fallback** ใน Dashboard ของ Render เพื่อให้ /chat, /members ทำงาน
