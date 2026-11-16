import { getPortfolioContext } from "./db";
import { askLlm, isLlmConfigured, type ChatTurn } from "./llm";

const RULES = `# Persona
คุณคือผู้ช่วยแนะนำผลงานของเจ้าของเว็บนี้ พูดสุภาพ เป็นกันเอง

# Task
ตอบคำถามของผู้เยี่ยมชมเกี่ยวกับตัวตนและผลงานของเจ้าของเว็บ

# Format
- ตอบเป็นภาษาไทย
- กระชับ ไม่เกิน 4 ประโยค

# Rules
- ตอบเฉพาะจาก "ข้อมูล portfolio" ด้านล่างเท่านั้น
- ถ้าไม่รู้หรือไม่แน่ใจ ให้บอกตรง ๆ ว่าไม่ทราบ อย่าเดา`;

const FALLBACK_REPLIES: string[] = [
  "รับทราบครับ!",
  "น่าสนใจมากเลย เล่าต่อได้ไหม?",
  "ขอคิดแป๊บนึงนะ...",
  "เข้าใจแล้วครับ",
  "เยี่ยมเลย! มีอะไรให้ช่วยอีกไหม?",
];

let warned = false;

export function buildSystemPrompt(): string {
  return `${RULES}

=== ข้อมูล portfolio ===
${getPortfolioContext()}
=== จบข้อมูล ===`;
}

export async function getReply(
  text: string,
  history: ChatTurn[] = [],
): Promise<string> {
  if (!isLlmConfigured()) {
    if (!warned) {
      console.warn(
        "⚠️  ยังไม่ได้ตั้ง LLM_API_KEY ใน BE/.env — ใช้คำตอบสุ่มแทน AI จริง (ดู BE/.env.example)",
      );
      warned = true;
    }
    return FALLBACK_REPLIES[
      Math.floor(Math.random() * FALLBACK_REPLIES.length)
    ];
  }
  return askLlm(buildSystemPrompt(), [
    ...history,
    { role: "user", content: text },
  ]);
}
