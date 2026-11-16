# bu-web-technology-week-9

Mini chat + Portfolio สำหรับวิชา Web Technology สัปดาห์ที่ 9: AI workflow
Build ด้วย **React + TypeScript + Vite** (FE), **Express + TypeScript + SQLite + Gemini** (BE) และ **Three.js** (ตัวแสดงผล 3D)

## ภาพรวมฟีเจอร์

- **หน้าหลัก / แนะนำกลุ่ม** — แนะนำกลุ่ม CTRL+V และทีมงาน
- **หน้าสมาชิก** — ทำเนียบสมาชิก, ทักษะ, ผลงาน และเปิดแฟ้มผลงานแบบ Modal
- **หน้า CHAT AI** — แชทกับบอทที่เชื่อม Gemini API, มี Quick Prompt, แก้ไข/ลบข้อความ, ล้างประวัติ, polling รับข้อความใหม่ทุก 2 วินาที
- **แสดงผลงาน AI** — การ์ดผลงานรูปภาพ พร้อม Lightbox ขยายดู
- **โมเดล 3D แบบโต้ตอบ** — ผลงานประเภท `3d` จะเปิดตัวแสดงผล Three.js ที่โหลดไฟล์ `.glb/.gltf` จริง หมุน/ซูมได้ 360°, เล่นอนิเมชัน และ **นำเข้าไฟล์โมเดลจากเครื่องได้เลย** (ดูรายละเอียด [FE README](FE/README.md#โมดูลแสดงผล-3d-threejs--gltfloader))

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
│   │   ├── mockup/
│   │   └── models/Fox.glb
│   └── src/
│       ├── App.tsx
│       ├── api.ts
│       ├── types.ts
│       ├── data/members.ts
│       ├── pages/
│       └── components/
│
│
└── docker-compose.yml
```

## เริ่มใช้งาน

1. Fork โปรเจกต์ไปไว้ในบัญชี GitLab ของตัวเอง (ปุ่ม **Fork** ที่หน้า https://gitlab.com/aiyaruch1320/bu-web-technology-week-9) แล้วตั้ง Visibility เป็น **Public**
2. Clone จาก fork ของตัวเอง (คัดลอกลิงก์ HTTPS จากปุ่ม **Code**)

```bash
git clone <ลิงก์ HTTPS ของ fork ตัวเอง>
cd bu-web-technology-week-9
```

3. ติดตั้ง

```bash
node -v
cd BE && npm install
cd ../FE && npm install
cd ..
```

4. สร้างไฟล์ `BE/.env` โดยคัดลอกจาก `BE/.env.example` แล้วแก้บรรทัด `LLM_API_KEY`
   (ไฟล์ `.env` ถูก git ignore ไว้แล้ว ห้าม commit key)

5. รัน (ใช้ 2 terminal)

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

เปิด http://localhost:5173

> หมายเหตุ: หน้า **สมาชิก** และการดู **โมเดล 3D** ใช้ข้อมูลฝั่ง FE จึงทำงานได้แม้ยังไม่รัน BE ส่วนหน้า **CHAT AI** ต้องรัน BE ด้วย

## คำสั่งที่ใช้บ่อย

| ที่ | คำสั่ง | ทำอะไร |
| --- | --- | --- |
| BE | `npm run dev` | รัน BE (restart เองเมื่อแก้ไฟล์) |
| BE | `npm run check` | ตรวจโค้ดด้วย TypeScript (ไม่รันโปรแกรม) |
| BE | `npm run seed` | seed ข้อมูลลง SQLite |
| FE | `npm run dev` | รัน Vite dev server |
| FE | `npm run typecheck` | ตรวจ TypeScript ฝั่ง FE |
| FE | `npm run build` | build production (ผลงาน 3D ถูกแยกเป็น chunk ต่างหาก) |

ตอนรัน BE จะเห็น `ExperimentalWarning` จาก `node:sqlite` ซึ่งเป็นเรื่องปกติ

## รันด้วย Docker (ทางเลือก)

สร้าง `BE/.env` ก่อน แล้ว:

```bash
docker compose up --build
```

เข้าได้ที่ http://localhost (หรือ http://localhost:5173) — compose จะ mount `FE/public` ด้วย จึงแก้/เพิ่มไฟล์โมเดล 3D แล้วเห็นผลทันทีโดยไม่ต้อง rebuild image

## เพิ่มโมเดล 3D ของตัวเอง

1. วางไฟล์ `.glb` (แนะนำ เพราะเป็นไฟล์เดียวจบ รวม texture ไว้ด้วย) ไว้ที่ `FE/public/models/`
2. เพิ่ม/แก้ผลงานใน `FE/src/data/members.ts` โดยใส่:

```ts
{
  id: 'art-09',
  category: '3d',
  title: 'My Model',
  modelUrl: '/models/my-model.glb',
  model3dType: 'cyber-cube'
}
```

หรือกดปุ่ม **นำเข้าโมเดล** ใน Lightbox เพื่อเลือกไฟล์จากเครื่องแบบชั่วคราวได้เลย

**เครดิตโมเดลตัวอย่าง:** `Fox.glb` จาก [Khronos glTF Sample Assets](https://github.com/KhronosGroup/glTF-Sample-Assets/tree/main/Models/Fox) — model © PixelMannen (CC0), rigging & animation © tomkranis (CC BY 4.0), glTF conversion © AsoboStudio & scurest (CC BY 4.0)
