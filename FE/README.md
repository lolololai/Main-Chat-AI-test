# FE — Mini Chat (React + TypeScript + Vite)

Frontend ของ mini chat วิชา Web Technology สัปดาห์ที่ 9 (พัฒนาต่อยอดจาก React Basics สัปดาห์ที่ 5) เขียนด้วย React **TypeScript** และเชื่อมกับ BE ด้วย 2 กลไกหลัก:

1. **REST API** — ส่ง/อ่าน/ล้างข้อความผ่าน `fetch` ไปที่ Express Chat API
2. **Polling** — `setInterval` ถาม `GET /messages` ทุก 2 วินาที

## รัน (ต้องรัน BE ด้วย → ใช้ 2 terminal)

**Terminal 1 — BE** (http://localhost:3000):

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

```bash
npm run typecheck
npm run build
```

## โครงสร้าง

```
FE/
├── vite.config.ts
├── tsconfig.json
├── index.html
├── public/
│   ├── profiles/
│   ├── mockup/             # ภาพผลงาน (retro-torus.png, ผลงาน*.jpg, Fox.png, clis_anime.jpg ฯลฯ)
│   └── models/Fox.glb
└── src/
    ├── main.tsx
    ├── types.ts
    ├── App.tsx
    ├── api.ts
    ├── index.css
    ├── homeLanding.css      # CSS ของ design หน้า Home (scope ด้วย .design-scope)
    ├── data/members.ts
    ├── pages/
    │   ├── chat.tsx
    │   └── MembersPage.tsx
    └── components/
        ├── HomeLanding.tsx  # หน้า Home ตาม design
        ├── SiteNavbar.tsx   # navbar ใช้ร่วมกัน 2 หน้า
        ├── ThreeView.tsx
        ├── ChatLog.tsx
        ├── MessageBubble.tsx
        ├── Composer.tsx
        ├── ArtworkCard.tsx
        ├── MemberModal.tsx
        └── ImageModal.tsx
```

## หน้า Home (Pastel Landing)

หน้า `/` และ `/about` ใช้ `HomeLanding.tsx` ที่นำ design จากโฟลเดอร์ design มาใช้ตรงต้นฉบับ:

- แถบเมนู, Hero แบบแฟ้มเอกสาร (_folder tabs_, รูเจาะ, จุดฮาล์ฟโทน, ดาวสติกเกอร์)
- ส่วน TEAM PROJECT, MEMBERS (การ์ดห้อยสายคล้อง 5 ใบ กดพลิกได้), CONTACT และ footer
- ฟอนต์: Bricolage Grotesque / DM Sans / JetBrains Mono / Noto Sans Thai (โหลดผ่าน `<link>` ใน `index.html`)
- CSS ทั้งหมดอยู่ใน `homeLanding.css` และถูก scope ด้วย `.design-scope` จึงไม่ไปเปลี่ยนหน้า Chat/Members

## Navbar

`SiteNavbar.tsx` ใช้ร่วมกัน 2 หน้า:

| หน้า | แสดง |
| --- | --- |
| Home | โลโก้ `Linux`, ลิงก์ HOME / TEAM / MEMBERS / CONTACT, ปุ่ม CHAT AI |
| Chat | เฉพาะโลโก้ `Linux` (ไม่แสดงลิงก์และปุ่ม CHAT AI ตามที่กำหนด) |

ลิงก์ section บนหน้า Home เลื่อนไป anchor ที่เกี่ยวข้อง ส่วนปุ่ม CHAT AI ไปหน้า `/chat`

## โมดูลแสดงผล 3D

ผลงาน `category: "3d"` เปิด Lightbox ที่มี `ThreeView.tsx`:

- `GLTFLoader` โหลดไฟล์ `.glb` / `.gltf`, `OrbitControls` หมุน/ซูมด้วยเมาส์และทัช, `RoomEnvironment` ทำให้วัสดุ PBR สว่างขึ้น
- ปรับขนาดและตำแหน่งโมเดลให้พอดีฉากอัตโนมัติ, เล่นอนิเมชันแรกของโมเดล
- แถบเครื่องมือ: หมุนอัตโนมัติ, Wireframe, เล่น/หยุดอนิเมชัน, รีเซ็ตมุมมอง
- มี loading progress และแถบแจ้งเตือนเมื่อโหลดไม่สำเร็จ (สลับไป geometry พื้นฐานแทน)
- three.js ถูกโหลดแบบ lazy (`React.lazy` + `Suspense`) ตอนเปิดผลงาน 3D
- ไฟล์ตัวอย่าง: `public/models/Fox.glb` อ้างอิงจาก `modelUrl` ใน `data/members.ts`

เพิ่มผลงาน 3D:

```ts
{
  id: 'art-09',
  category: '3d',
  title: 'My Model',
  modelUrl: '/models/my-model.glb',
  model3dType: 'cyber-cube'
}
```

**เครดิต:** `Fox.glb` จาก [Khronos glTF Sample Assets](https://github.com/KhronosGroup/glTF-Sample-Assets/tree/main/Models/Fox) — model © PixelMannen (CC0), rigging & animation © tomkranis (CC BY 4.0), glTF conversion © AsoboStudio & scurest (CC BY 4.0)

## ข้อควรระวังเรื่อง public/

Vite เสิร์ฟไฟล์ใน `public/` ที่ root (เช่น `/mockup/retro-torus.png`) ถ้าเพิ่มไฟล์ใหม่ลง `public/` ขณะที่ Docker container รันอยู่ ต้อง restart container FE มิเช่นนั้น Vite จะยังตอบ HTML แทนไฟล์นั้น

ห้ามใช้ path แบบเครื่อง เช่น `bu-web-technology-week-9-afternoon-chat-ui/FE/public/mockup/...` ใน `imageUrl` — ต้องเป็น `/mockup/...`
