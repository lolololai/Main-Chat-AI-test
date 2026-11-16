import { saveAllStudents } from "./db";

const GROUP_NAME = "CTRL+V";

const students = [
  {
    profile: {
      name: "นรินทร์ฤทธิ์",
      bio: `INFP ,ชอบทำโมเดล 3D ,unity , blender, Substance 3D (สังกัดกลุ่ม: ${GROUP_NAME})`,
      skills: "เขียนcode ได้นิดหน่อย , powerBI , exce , python, TypeScript, Fullstack",
    },
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
    projects: [
      {
        title: "Mini Chat",
        description: "เว็บแชตกับบอท ต่อ Gemini API",
        tech: "React, TypeScript, Express",
      },
    ],
  },
];

saveAllStudents(students);
console.log(`[seed] บันทึกข้อมูลนักศึกษา ${students.length} คน (กลุ่ม: ${GROUP_NAME}) เรียบร้อยแล้ว`);