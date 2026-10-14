import { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import type { Message } from '../types';

interface ChatLogProps {
  messages: Message[];
  onUpdate: (id: number, text: string) => void;
  onDelete: (id: number) => void;
}

export default function ChatLog({ messages, onUpdate, onDelete }: ChatLogProps) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (messages.length === 0) {
    return <div className="chatlog chatlog-empty">ยังไม่มีข้อความ — เริ่มคุยกับบอทได้เลย 👋</div>;
  }

  return (
    <div className="chatlog">
      {messages.map((m) => (
        <MessageBubble key={m.id} message={m} onUpdate={onUpdate} onDelete={onDelete} />
      ))}
      <div ref={endRef} />
    </div>
  );
}
