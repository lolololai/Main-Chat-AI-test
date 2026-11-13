import { saveAllStudents } from "./db";

// 🎯 กำหนดชื่อกลุ่ม
const GROUP_NAME = "CTRL+V";

// กำหนดรายชื่อนักศึกษา
const students = [
  {
    profile: {
      name: "นรินทร์ฤทธิ์",
      bio: `INFP ,ชอบทำโมเดล 3D ,unity , blender, Substance 3D (สังกัดกลุ่ม: ${GROUP_NAME})`,
      skills: "เขียนcode ได้นิดหน่อย , powerBI , exce , python, TypeScript, Fullstack",
    },
    // 👉 คนนี้มี 2 โปรเจกต์ (คั่นด้วยคอมมา , ระหว่าง object)
    projects: [
      {
        title: "WebTrade - ธนาคารแห่งนึง",
        description: "trading, funding, crypto",
        tech: "React, Express, SQLite",
      },
      {
        title: "Cloud Infrastructure Monitor",
        description: "ระบบแดชบอร์ดมอนิเตอร์สถานะเซิร์ฟเวอร์และแจ้งเตือนอัตโนมัติบน Kubernetes Cluster",
        tech: "Golang, React, Kubernetes, Docker",
      },
    ],
  },
  {
    profile: {
      name: "พงศกร",
      bio: `สาย Frontend ตัวตึง ทำ UI สวยเนี๊ยบ, ชอบทำงานเป็นทีม , เฟรนลี่มากๆ , อะไรที่ไม่ถูกจะบอกตรงๆ (สังกัดกลุ่ม: ${GROUP_NAME})`,
      skills: "concert production, React, python , BullMQ , MinIO",
    },
    // 👉 คนนี้มีโปรเจกต์เดียว ก็ใส่ Object ไว้ข้างในอันเดียวปกติ
    projects: [
      {
        title: "E-Commerce Shop",
        description: "ระบบร้านค้าออนไลน์พร้อมระบบตะกร้าสินค้า",
        tech: "Vue.js, Node.js, PostgreSQL",
      },
    ],
  },
  {
    profile: {
      name: "ปิยวัฒน์",
      bio: `สนใจการทำเกมมือถือ, ออกแบบเกมคอม, การทำอนิเมชั่น, เน้นเอนเตอร์เทน (สังกัดกลุ่ม: ${GROUP_NAME})`,
      skills: "Python, FastAPI, Docker, Penetration Testing",
    },
    // 👉 คนนี้มีโปรเจกต์เดียว
    projects: [
      {
        title: "Game Chat App",
        description: "แอปพลิเคชันแชทหาคู่ความปลอดภัยสูง",
        tech: "Python, WebSockets, Docker",
      },
    ],
  },
  {
    profile: {
      name: "อุชุตา",
      bio: `สนใจด้านการเขียนโปรแกรมและออกแบบ ux/ui (figma) (สังกัดกลุ่ม: ${GROUP_NAME})`,
      skills: "python, html เบื้องต้น",
    },
    // 👉 คนนี้มีโปรเจกต์เดียว
    projects: [
      {
        title: "Warehouse Management Dashboard",
        description: "ระบบแดชบอร์ดจัดการสต็อกสินค้าและเส้นทางจัดส่งสำหรับแอดมิน",
        tech: "Figma, Vue.js",
      },
    ],
  },
  {
    profile: {
      name: "มนัสชนก",
      bio: `สนใจในการทำchat bot คอมพิวเตอร์วิชั่น เเละการทำเว็บดีไซน์ (สังกัดกลุ่ม: ${GROUP_NAME})`,
      skills: "python,c++, html,css,SQL",
    },
    // 👉 คนนี้มีโปรเจกต์เดียว
    projects: [
      {
        title: "Mini Chat",
        description: "เว็บแชตกับบอท ต่อ Gemini API",
        tech: "React, TypeScript, Express",
      },
    ],
  },
];

// บันทึกข้อมูลทั้งหมดลงฐานข้อมูล
saveAllStudents(students);
console.log(`✅ บันทึกข้อมูลนักศึกษา ${students.length} คน (กลุ่ม: ${GROUP_NAME}) เรียบร้อยแล้ว!`);