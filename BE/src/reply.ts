import { askLlm, isLlmConfigured, type ChatTurn } from "./llm";

const FALLBACK_REPLIES: string[] = [
  "รับทราบครับ!",
  "น่าสนใจมากเลย เล่าต่อได้ไหม?",
  "ขอคิดแป๊บนึงนะ 🤔",
  "เข้าใจแล้วครับ",
  "เยี่ยมเลย! มีอะไรให้ช่วยอีกไหม?",
];

let warned = false;

export async function getReply(text: string, history: ChatTurn[] = []): Promise<string> {
  if (!isLlmConfigured()) {
    if (!warned) {
      console.warn("⚠️  ยังไม่ได้ตั้ง LLM_API_KEY ใน BE/.env — ใช้คำตอบสุ่มแทน AI จริง (ดู BE/.env.example)");
      warned = true;
    }
    return FALLBACK_REPLIES[Math.floor(Math.random() * FALLBACK_REPLIES.length)];
  }
  return askLlm("", [...history, { role: "user", content: text }]);
}
