1. Fork โปรเจกต์ไปไว้ใน Github ของตัวเอง แล้วตั้ง 
2. Clone จาก fork ของตัวเอง

git clone 
cd Main-Chat-UI

3. ติดตั้ง 

npm install ทั้ง FE และ BE


4. สร้าง `BE/.env` copy code จาก `BE/.env.example` แล้วใส่ `LLM_API_KEY` 

5. docker-compose build


หน้า Home, หน้าสมาชิก และโมเดล 3D ใช้ข้อมูลฝั่ง FE จึงเปิดได้ไม่ต้องรัน BE — เฉพาะหน้า CHAT AI ที่ต้องรัน BE

| BE | `npm run dev` | รัน BE (restart เองเมื่อแก้ไฟล์) |
| BE | `npm run check` | ตรวจ TypeScript |
| BE | `npm run seed` | seed ข้อมูลลง SQLite |
| FE | `npm run dev` | รัน Vite dev server |
| FE | `npm run typecheck` | ตรวจ TypeScript ฝั่ง FE |
| FE | `npm run build` | build production |

ระวัง: `docker-compose.yml` mount เฉพาะ `FE/src`, `FE/public`, `FE/index.html` และ `FE/vite.config.ts` — **ไม่ได้ mount `package.json`** ดังนั้นถ้าเพิ่ม dependency ใหม่ (เช่น `three`) ต้อง `docker compose build fe` ใหม่ และถ้าเพิ่มไฟล์ใหม่ลง `public/` หลัง Vite start ต้อง restart container FE ด้วย

```

**เครดิตโมเดลตัวอย่าง:** `Fox.glb` จาก [Khronos glTF Sample Assets](https://github.com/KhronosGroup/glTF-Sample-Assets/tree/main/Models/Fox) — model © PixelMannen (CC0), rigging & animation © tomkranis (CC BY 4.0), glTF conversion © AsoboStudio & scurest (CC BY 4.0)
