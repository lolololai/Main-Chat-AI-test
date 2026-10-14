import { askLlm, isLlmConfigured, type ChatTurn } from "./llm";

const SYSTEM_PROMPT = `คุณคือผู้ช่วยในแอป mini chat ของวิชา Web Technology
- ตอบเป็นภาษาไทย สุภาพ กระชับ ไม่เกิน 4 ประโยค
- ถ้าไม่รู้หรือไม่แน่ใจ ให้บอกตรงๆ ว่าไม่ทราบ อย่าเดา`;

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
  return askLlm(SYSTEM_PROMPT, [...history, { role: "user", content: text }]);
}
