# FE — Mini Chat (React + TypeScript + Vite)

Frontend ของ mini chat วิชา Web Technology สัปดาห์ที่ 9 (พัฒนาต่อยอดจากโครง React Basics สัปดาห์ที่ 5) เขียนด้วย React **TypeScript** ให้สอดคล้องกับ BE และ**เชื่อมกับ BE จริงแล้ว** ด้วย 2 กลไกหลัก:

1. **REST API** — ส่ง/อ่าน/ล้างข้อความผ่าน `fetch` ไปที่ Express Chat API
2. **Polling** — `setInterval` ถาม `GET /messages` ทุก 2 วินาที เพื่อรับข้อความใหม่แบบเกือบ real-time (วิธีง่ายสุดก่อนจะไปเรียน WebSocket)

## รัน (ต้องรัน BE ด้วย → ใช้ 2 terminal)

**Terminal 1 — BE** (โฟลเดอร์ `../BE` เทียบจาก FE, http://localhost:3000):

```bash
cd ../BE
npm install
npm run dev
```

**Terminal 2 — FE** (http://localhost:5173):

```bash
npm install
npm run dev
```

ทดสอบความ real-time: เปิด browser 2 หน้า แล้วส่งข้อความในหน้านึง — อีกหน้าจะได้ข้อความใหม่ภายใน ~2 วินาทีจาก polling

## โครงสร้าง — โครงเดียวกับ React Basics

```
FE/
├── vite.config.ts              ← proxy /messages, /status → localhost:3000 (แก้ CORS ตอน dev)
├── tsconfig.json               ← React + TS (strict เหมือนฝั่ง BE)
├── index.html
├── public/
│   ├── profiles/               ← avatar สมาชิก
│   ├── mockup/                 ← ภาพตัวอย่างผลงาน
│   └── models/Fox.glb          ← โมเดล 3D ตัวอย่าง
└── src/
    ├── main.tsx                ← จุดเริ่ม render (StrictMode)
    ├── types.ts                ← interface Message / Artwork / Member
    ├── App.tsx                 ← routing ตาม pathname + modals
    ├── api.ts                  ← fetch ทั้งหมดไว้ที่เดียว (GET / POST / DELETE /messages)
    ├── index.css
    ├── data/members.ts         ← ข้อมูลสมาชิก + ผลงาน (field modelUrl อยู่ตรงนี้)
    ├── pages/
    │   ├── chat.tsx            ← หน้า CHAT AI
    │   └── MembersPage.tsx     ← ทำเนียบสมาชิก + ผลงาน
    └── components/
        ├── ChatLog.tsx         ← map + key + empty state + auto-scroll Effect
        ├── MessageBubble.tsx   ← bubble + artwork gallery + แก้ไข/ลบข้อความ
        ├── Composer.tsx        ← controlled input + preventDefault + disabled
        ├── ArtworkCard.tsx     ← การ์ดผลงาน
        ├── MemberModal.tsx     ← แฟ้มผลงานของสมาชิก
        ├── ImageModal.tsx      ← Lightbox + สลับ 3D/2D (lazy-load ThreeView)
        └── ThreeView.tsx       ← viewer Three.js (GLTFLoader + OrbitControls)
```

```bash
npm run typecheck
npm run build
```

| ใน React Basics (สัปดาห์ 5) | ใน FE นี้ (integration) |
| --- | --- |
| mock reply สุ่มประโยคใน React | `POST /messages` → บอทตอบจาก `getReply` ฝั่ง BE |
| `useState` messages เริ่มจาก array ว่าง/seed | Effect โหลดจาก `GET /messages` ตอน mount |
| ข้อความใหม่มีแค่ในเครื่องเรา | **Polling** ทุก 2 วิ → เห็นข้อความจากทุกเครื่อง |
| ปุ่ม Clear history เคลียร์ state | `DELETE /messages` แล้วค่อยเคลียร์ state |
| shape `{ id, role, text }` | **ไม่เปลี่ยน** — BE ส่ง shape เดิมมาให้พอดี |

## จุดเรียนรู้ใหม่ของไฟล์นี้ (เทียบกับสัปดาห์ 5)

- **`api.ts`** — รวมทุก `fetch` ไว้ไฟล์เดียว ผูกกับ endpoint ของ BE ตรง ๆ (ถ้า BE เพิ่ม endpoint ใหม่ แก่นเดียวที่ต้องแตะคือไฟล์นี้) + `types.ts` ใช้ interface `Message` ชุดเดียวกับ BE — แก้ shape ที่ BE แล้ว TS ฝั่ง FE จะฟ้องทันที
- **Polling Effect ใน `App.tsx`** — `refresh()` ตอน mount + `setInterval` + `clearInterval` ใน cleanup (เขียน cleanup ไม่ครบ = timer ค้างและโดน request ยัดถล่ม)
- **Error state** — fetch พัง (เช่นลืมรัน BE) → แสดงแถบแดงแทนหน้าขาว
- **Vite proxy** — FE ยิงไป `/messages` (relative path) แล้ว Vite ส่งต่อไป `localhost:3000` ให้ → คนละ port แต่ไม่ติด CORS (เรื่อง CORS ลึก ๆ เรียนในสัปดาห์บูรณาการ)

## โมดูลแสดงผล 3D (Three.js + GLTFLoader)

ผลงานประเภท `category: "3d"` จะเปิด Lightbox ที่มีตัวแสดงผล 3D ของจริง:

- `src/components/ThreeView.tsx` — สร้าง Scene/Camera/Renderer, ใช้ `OrbitControls` หมุน/ซูม (เมาส์ + ทัช), `GLTFLoader` โหลดไฟล์ `.glb` / `.gltf`, `RoomEnvironment` ทำให้วัสดุ PBR ไม่มืด, ปรับขนาดโมเดลให้พอดีฉากอัตโนมัติ และเล่นอนิเมชันแรกของโมเดล
- ปุ่ม **นำเข้าโมเดล** ในแถบเครื่องมือเลือกไฟล์ `.glb` / `.gltf` จากเครื่องได้เลย (ใช้ `URL.createObjectURL` และคืน URL ตอนเลิกใช้)
- ถ้าโหลดไม่สำเร็จ จะแสดงแถบแจ้งเตือน + ปุ่ม "ลองใหม่" และสลับไปแสดง geometry พื้นฐานแทน
- ไฟล์โมเดลตัวอย่างอยู่ที่ `public/models/Fox.glb` และถูกอ้างอิงจาก `modelUrl` ใน `src/data/members.ts` (ผลงาน "Animated Fox 3D (GLTF)")
- three.js ถูกโหลดแบบ lazy (`React.lazy` + `Suspense`) ตอนเปิดผลงาน 3D จึงไม่ไปเพิ่มขนาด bundle หน้าแชท

เพิ่มผลงาน 3D ของตัวเองได้โดยใส่ field ลงใน `Artwork`:

```ts
{
  id: 'art-09',
  category: '3d',
  title: 'My Model',
  modelUrl: '/models/my-model.glb',
  model3dType: 'cyber-cube'
}
```

**เครดิตไฟล์ตัวอย่าง:** `Fox.glb` จาก [Khronos glTF Sample Assets](https://github.com/KhronosGroup/glTF-Sample-Assets/tree/main/Models/Fox) — model © PixelMannen (CC0), rigging & animation © tomkranis (CC BY 4.0), glTF conversion © AsoboStudio & scurest (CC BY 4.0)

## ต่อยอด (ถ้าเสร็จเร็ว)

- เพิ่ม **loading state** (spinner ตอนโหลดครั้งแรก) และ **optimistic update** (แสดงข้อความเราทันที ก่อน API ตอบ)
- ปุ่มเปิด/ปิด polling (เช่น checkbox "Live") — ลองสร้าง Effect ที่มี dependency เปลี่ยนได้
- Polling แบบฉลาดขึ้น: ดู `id` ล่าสุดที่มี แล้วถามหาเฉพาะข้อความที่ใหม่กว่านั้น
- เปลี่ยน `POLL_INTERVAL` เป็น 500ms แล้วเปิด DevTools → Network ดูว่าเกิดอะไรขึ้น
