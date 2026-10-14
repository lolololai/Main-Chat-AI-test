# bu-web-technology-week-9

Mini chat (React + Express + SQLite + Gemini) สำหรับวิชา Web Technology สัปดาห์ที่ 9: AI workflow

## เริ่มใช้งาน

1. Fork โปรเจกต์ไปไว้ในบัญชี GitLab ของตัวเอง (ปุ่ม **Fork** ที่หน้า https://gitlab.com/aiyaruch1320/bu-web-technology-week-9) แล้วตั้ง Visibility เป็น **Public**
2. Clone จาก fork ของตัวเอง (คัดลอกลิงก์ HTTPS จากปุ่ม **Code**)

```bash
git clone <ลิงก์ HTTPS ของ fork ตัวเอง>
```

3. ติดตั้ง

```bash
node -v
cd BE
npm install
cd ../FE
npm install
cd ..
```

4. สร้างไฟล์ `BE/.env` โดยคัดลอกจาก `BE/.env.example` แล้วแก้บรรทัด `LLM_API_KEY`
   (ไฟล์ `.env` ถูก git ignore ไว้แล้ว ห้าม commit key)

5. รัน (ใช้ 2 terminal)

```bash
# Terminal 1
cd BE
npm run dev
```

```bash
# Terminal 2
cd FE
npm run dev
```

เปิด http://localhost:5173

## คำสั่งที่ใช้บ่อย (ในโฟลเดอร์ BE)

| คำสั่ง | ทำอะไร |
|---|---|
| `npm run dev` | รัน BE (restart เองเมื่อแก้ไฟล์) |
| `npm run check` | ตรวจโค้ดด้วย TypeScript (ไม่รันโปรแกรม) |

ต้องใช้ Node 22.13 ขึ้นไป (ใช้ `node:sqlite`) จะเห็น `ExperimentalWarning` ตอนรัน BE ซึ่งเป็นเรื่องปกติ
