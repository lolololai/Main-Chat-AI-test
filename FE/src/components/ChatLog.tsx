import { useEffect, useRef, useState } from 'react';
import MessageBubble from './MessageBubble';
import type { Message } from '../types';

interface ChatLogProps {
  messages: Message[];
  pendingText: string | null;
  onUpdate: (id: number, text: string) => void;
  onDelete: (id: number) => void;
}

export default function ChatLog({ messages, pendingText, onUpdate, onDelete }: ChatLogProps) {
  // 👉 เพิ่มตัวแปร ref สำหรับอ้างอิงตำแหน่งกล่องแชทหลัก และ state เช็กสถานะการเลื่อน
  const containerRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);

  // 👉 เพิ่มฟังก์ชันนี้: เช็กว่าผู้ใช้งานเลื่อนมาอยู่ล่างสุดหรือยัง (ถ้าระยะห่างจากด้านล่าง < 50px ถือว่าอยู่ล่างสุด)
  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const atBottom = scrollHeight - scrollTop - clientHeight < 50;
    setIsAtBottom(atBottom);
  };

  // 👉 แก้ไขตรงนี้: จะสั่งเลื่อนลงล่างอัตโนมัติเฉพาะตอนที่ isAtBottom เป็น true เท่านั้น
  useEffect(() => {
    if (isAtBottom) {
      endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, pendingText, isAtBottom]);

  if (messages.length === 0 && !pendingText) {
    return <div className="chatlog chatlog-empty">ยังไม่มีข้อความ — เริ่มคุยกับบอทได้เลย 👋</div>;
  }

  return (
    // 👉 เพิ่ม containerRef และผูกเหตุการณ์ onScroll={handleScroll} เข้าไปที่ตัวกล่องแชทหลัก
    <div 
      className="chatlog" 
      ref={containerRef} 
      onScroll={handleScroll}
    >
      {messages.map((m) => (
        <MessageBubble key={m.id} message={m} onUpdate={onUpdate} onDelete={onDelete} />
      ))}
      {pendingText && (
        <>
          <div className="bubble-row row-user">
            <div className="bubble bubble-user">{pendingText}</div>
          </div>
          <div className="bubble-row row-assistant">
            <div className="bubble bubble-assistant typing" role="status" aria-label="บอทกำลังพิมพ์">
              <span />
              <span />
              <span />
            </div>
          </div>
        </>
      )}
      <div ref={endRef} />
    </div>
  );
}