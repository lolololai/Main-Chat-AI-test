# assets/images

เก็บรูปภาพที่ใช้ใน UI ทั้งหมด

## วิธีใช้งานใน React

```tsx
import botAvatar from '../assets/images/bot-avatar.png';

<img src={botAvatar} alt="Bot" />
```

## แนวทางจัดไฟล์

| ประเภท | ตัวอย่างชื่อไฟล์ | หมายเหตุ |
|---|---|---|
| Avatar / Icon | `bot-avatar.svg`, `user-avatar.png` | ใช้ `.svg` ถ้าทำได้ ขยายได้ไม่แตก |
| Background | `bg-pattern.svg` | |
| Logo | `logo.svg`, `logo@2x.png` | |
| Illustration | `empty-state.svg` | |

## ขนาดไฟล์ที่แนะนำ

- ไฟล์ที่เล็กกว่า **4 KB** → Vite จะ inline เป็น base64 อัตโนมัติ
- ไฟล์ใหญ่กว่านั้น → Vite จะ copy ไปที่ `dist/assets/`
- ใช้ `.svg` สำหรับ icon และ illustration เสมอ (ขนาดเล็ก, คมชัด ทุก resolution)
- ใช้ `.webp` แทน `.jpg`/`.png` สำหรับรูปถ่ายเพื่อลดขนาด
