import { useState, useEffect } from "react";
import ChatLog from "./components/ChatLog";
import Composer from "./components/Composer";
import { fetchMessages, sendMessage, clearMessages, updateMessage, deleteMessage } from "./api";
import type { Message } from "./types";

const POLL_INTERVAL = 2000;

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [sending, setSending] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function refresh() {
      try {
        setMessages(await fetchMessages());
        setError(null);
      } catch {
        setError(
          "เชื่อมต่อ API ไม่ได้ — รัน BE ไว้แล้วหรือยัง? (cd ../BE แล้ว npm run dev)",
        );
      }
    }

    refresh();
    const timer = setInterval(refresh, POLL_INTERVAL);
    return () => clearInterval(timer);
  }, []);

  async function handleSend(text: string) {
    setSending(true);
    try {
      const { userMessage, assistantMessage } = await sendMessage(text);
      setMessages((prev) => [...prev, userMessage, assistantMessage]);
      setError(null);
    } catch {
      setError("ส่งข้อความไม่สำเร็จ — BE รันอยู่ไหม?");
    }
    setSending(false);
  }

  async function handleClear() {
    try {
      await clearMessages();
      setMessages([]);
    } catch {
      setError("ล้างประวัติไม่สำเร็จ");
    }
  }

  async function handleUpdate(id: number, text: string) {
    try {
      const updated = await updateMessage(id, text);
      setMessages((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
      setError(null);
    } catch {
      setError("แก้ไขข้อความไม่สำเร็จ — BE รันอยู่ไหม?");
    }
  }

  async function handleDelete(id: number) {
    try {
      await deleteMessage(id);
      setMessages((prev) => prev.filter((m) => m.id !== id));
      setError(null);
    } catch {
      setError("ลบข้อความไม่สำเร็จ — BE รันอยู่ไหม?");
    }
  }

  return (
    <div className="chat-app">
      <header className="chat-header">
        <h1>🤖 Mini Chat</h1>
        <button className="clear-btn" onClick={handleClear}>
          Clear history
        </button>
      </header>

      {error && <div className="error-banner">{error}</div>}

      <ChatLog messages={messages} onUpdate={handleUpdate} onDelete={handleDelete} />
      <Composer onSend={handleSend} disabled={sending} />
    </div>
  );
}
