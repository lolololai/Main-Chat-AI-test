import { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import type { Message } from '../types';

interface ChatLogProps {
  messages: Message[];
  pendingText: string | null;
  onUpdate: (id: number, text: string) => void;
  onDelete: (id: number) => void;
}

export default function ChatLog({ messages, pendingText, onUpdate, onDelete }: ChatLogProps) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, pendingText]);

  if (messages.length === 0 && !pendingText) {
    return <div className="chatlog chatlog-empty">ยังไม่มีข้อความ — เริ่มคุยกับบอทได้เลย 👋</div>;
  }

  return (
    <div className="chatlog">
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
