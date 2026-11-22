import express from "express";
import cors from "cors";
import {
  addPair,
  clearMessages,
  deleteMessage,
  listMessages,
  recentMessages,
  updateMessage,
} from "./db";
import { getReply } from "./reply";
import { isLlmConfigured } from "./llm";

try {
  process.loadEnvFile();
} catch {
}

const app = express();

const allowedOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost",
    "https://chat-ai-fe-latest.onrender.com",
    ...allowedOrigins,
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));

const MAX_HISTORY = 10;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.get("/status", (req, res) => {
  res.json({
    aiConfigured: isLlmConfigured(),
    model: process.env.LLM_MODEL || "gemini-3.5-flash-lite",
  });
});

app.get("/messages", async (req, res) => {
  res.json(await listMessages());
});

app.post("/messages", async (req, res) => {
  const text = req.body?.text;
  if (typeof text !== "string" || !text.trim()) {
    res.status(400).json({ error: "text is required" });
    return;
  }
  const userText = text.trim();

  const history = (await recentMessages(MAX_HISTORY)).map((m) => ({
    role: m.role,
    content: m.text,
  }));

  let replyText: string;
  try {
    replyText = await getReply(userText, history);
  } catch (err) {
    const e = err as { status?: number; message?: string };
    console.error("LLM error:", e.status ?? "-", e.message);
    if (e.status === 429) {
      res
        .status(429)
        .json({ error: "เรียก AI ถี่เกินโควตา รอสักครู่แล้วลองใหม่" });
    } else {
      res.status(502).json({
        error: "เรียก AI ไม่สำเร็จ ตรวจ LLM_API_KEY / LLM_MODEL ใน BE/.env",
      });
    }
    return;
  }

  const [userMessage, assistantMessage] = await addPair(userText, replyText);

  res.status(201).json({ userMessage, assistantMessage });
});

app.put("/messages/:id", async (req, res) => {
  const id = Number(req.params.id);
  const text = req.body?.text;
  if (typeof text !== "string" || !text.trim()) {
    res.status(400).json({ error: "text is required" });
    return;
  }

  const message = await updateMessage(id, text.trim());
  if (!message) {
    res.status(404).json({ error: "message not found" });
    return;
  }

  res.json(message);
});

app.delete("/messages/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!(await deleteMessage(id))) {
    res.status(404).json({ error: "message not found" });
    return;
  }

  res.json({ message: "deleted" });
});

app.delete("/messages", async (req, res) => {
  await clearMessages();
  res.json({ message: "cleared" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});