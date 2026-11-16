# bu-web-technology-week-9

Mini chat + Portfolio สำหรับวิชา Web Technology สัปดาห์ที่ 9: AI workflow
สร้างด้วย **React + TypeScript + Vite** (FE), **Express + TypeScript + SQLite + Gemini** (BE) และ **Three.js** (ตัวแสดงผล 3D)

## ภาพรวมฟีเจอร์

- **หน้าหลัก** — Landing page โทนพาสเทลตาม design ที่กำหนด: แฟ้มเอกสาร Hero, ส่วน TEAM PROJECT, MEMBERS (การ์ดห้อยสายคล้อง พลิกดูทักษะได้), CONTACT และ navbar ด้านบน
- **หน้าสมาชิก** — ทำเนียบสมาชิก, ทักษะ, ผลงาน และเปิดแฟ้มผลงานแบบ Modal
- **หน้า CHAT AI** — แชทกับบอทที่เชื่อม Gemini API, Quick Prompt, แก้ไข/ลบข้อความ, ล้างประวัติ และ polling รับข้อความใหม่ทุก 2 วินาที — navbar ของหน้านี้เหลือเฉพาะโลโก้ `Linux`
- **แสดงผลงาน AI** — การ์ดผลงานรูปภาพ พร้อม Lightbox ขยายดู
- **โมเดล 3D แบบโต้ตอบ** — ผลงานประเภท `3d` เปิดตัวแสดงผล Three.js ที่โหลดไฟล์ `.glb` จริง หมุน/ซูมได้ 360°, เล่นอนิเมชัน, สลับ Wireframe และรีเซ็ตมุมมอง

## โครงสร้างโปรเจกต์

```
bu-web-technology-week-9/
├── BE/
│   ├── src/
│   │   ├── app.ts
│   │   ├── llm.ts
│   │   ├── reply.ts
│   │   ├── db.ts
│   │   └── seed.ts
│   └── .env.example
├── FE/
│   ├── public/
│   │   ├── profiles/
│   │   ├── mockup/             # ภาพผลงาน (รวม retro-torus.png, ผลงาน*.jpg ฯลฯ)
│   │   └── models/Fox.glb      # โมเดล 3D ตัวอย่าง
│   └── src/
│       ├── App.tsx             # routing ตาม pathname
│       ├── api.ts
│       ├── types.ts
│       ├── data/members.ts     # ข้อมูลสมาชิก + ผลงาน (field modelUrl อยู่ตรงนี้)
│       ├── pages/
│       │   ├── chat.tsx
│       │   └── MembersPage.tsx
│       ├── components/
│       │   ├── HomeLanding.tsx  # หน้า Home ตาม design
│       │   ├── SiteNavbar.tsx   # navbar ใช้ร่วมกัน (Home / Chat)
│       │   ├── ThreeView.tsx    # viewer Three.js
│       │   └── ...
│       └── homeLanding.css      # CSS ของ design (scope เฉพาะหน้า Home/navbar)
└── docker-compose.yml
```

## เริ่มใช้งาน

1. Fork โปรเจกต์ไปไว้ในบัญชี GitLab ของตัวเอง แล้วตั้ง Visibility เป็น **Public**
2. Clone จาก fork ของตัวเอง

```bash
git clone <ลิงก์ HTTPS ของ fork ตัวเอง>
cd bu-web-technology-week-9
```

3. ติดตั้ง (ต้องใช้ Node 22.13 ขึ้นไป เพราะใช้ `node:sqlite`)

```bash
cd BE && npm install
cd ../FE && npm install
cd ..
```

4. สร้าง `BE/.env` โดยคัดลอกจาก `BE/.env.example` แล้วใส่ `LLM_API_KEY` (ห้าม commit key)

5. รัน (2 terminal)

**Terminal 1 — Backend** (http://localhost:3000):

```bash
cd BE
npm run dev
```

**Terminal 2 — Frontend** (http://localhost:5173):

```bash
cd FE
npm run dev
```

หมายเหตุ: หน้า Home, หน้าสมาชิก และโมเดล 3D ใช้ข้อมูลฝั่ง FE จึงเปิดได้โดยไม่รัน BE — เฉพาะหน้า CHAT AI ที่ต้องรัน BE

## คำสั่งที่ใช้บ่อย

| ที่ | คำสั่ง | ทำอะไร |
| --- | --- | --- |
| BE | `npm run dev` | รัน BE (restart เองเมื่อแก้ไฟล์) |
| BE | `npm run check` | ตรวจ TypeScript |
| BE | `npm run seed` | seed ข้อมูลลง SQLite |
| FE | `npm run dev` | รัน Vite dev server |
| FE | `npm run typecheck` | ตรวจ TypeScript ฝั่ง FE |
| FE | `npm run build` | build production |

## รันด้วย Docker

สร้าง `BE/.env` ก่อน แล้ว:

```bash
docker compose up --build
```

เข้าได้ที่ http://localhost หรือ http://localhost:5173

ข้อควรระวัง: `docker-compose.yml` mount เฉพาะ `FE/src`, `FE/public`, `FE/index.html` และ `FE/vite.config.ts` — **ไม่ได้ mount `package.json`** ดังนั้นถ้าเพิ่ม dependency ใหม่ (เช่น `three`) ต้อง `docker compose build fe` ใหม่ และถ้าเพิ่มไฟล์ใหม่ลง `public/` หลัง Vite start ต้อง restart container FE ด้วย

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
