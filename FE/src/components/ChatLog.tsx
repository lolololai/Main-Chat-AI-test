import { useEffect, useRef, useState } from 'react';
import MessageBubble from './MessageBubble';
import type { Message, Artwork } from '../types';

interface ChatLogProps {
  messages: Message[];
  pendingText: string | null;
  onUpdate: (id: number, text: string) => void;
  onDelete: (id: number) => void;
  onViewMember?: (memberId: string) => void;
  onOpenImageModal?: (artwork: Artwork) => void;
}

export default function ChatLog({
  messages,
  pendingText,
  onUpdate,
  onDelete,
  onViewMember,
  onOpenImageModal,
}: ChatLogProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);

  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    setIsAtBottom(scrollHeight - scrollTop - clientHeight < 50);
  };

  useEffect(() => {
    if (isAtBottom) {
      endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, pendingText, isAtBottom]);

  if (messages.length === 0 && !pendingText) {
    return (
      <div className="chatlog chatlog-empty">
        <div className="chatlog-empty-icon" aria-hidden="true">
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        </div>
        <p className="chatlog-empty-title">Linux Ai Chat พร้อมใช้งาน</p>
        <p className="chatlog-empty-hint">
          หากสงสัยอะไรสามารถพูดคุยกับผู่ให้ข้อมูลของทีมเราได้เลย
        </p>
      </div>
    );
  }

  return (
    <div
      className="chatlog"
      ref={containerRef}
      onScroll={handleScroll}
    >
      {messages.map((m) => (
        <MessageBubble
          key={m.id}
          message={m}
          onUpdate={onUpdate}
          onDelete={onDelete}
          onViewMember={onViewMember}
          onOpenImageModal={onOpenImageModal}
        />
      ))}

      {pendingText && (
        <>
          <div className="pro-message-row row-user">
            <div className="pro-message-content">
              <div className="pro-message-meta">
                <span className="pro-meta-time">กำลังส่ง...</span>
                <span className="pro-meta-author">คุณ (Workspace User)</span>
              </div>
              <div className="pro-bubble pro-bubble-user">
                <div className="pro-bubble-text">{pendingText}</div>
              </div>
            </div>
            <div className="pro-avatar pro-avatar-user" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
          </div>

          <div className="pro-message-row row-assistant">
            <div className="pro-avatar pro-avatar-ai" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10 2v7.31L4.1 19.34A2 2 0 0 0 5.8 22h12.4a2 2 0 0 0 1.7-2.66L14 9.31V2h-4z"/>
                <line x1="8.5" y1="2" x2="15.5" y2="2"/>
                <path d="M14 9.3l-2.5 4-2.5-4"/>
              </svg>
            </div>
            <div className="pro-message-content">
              <div className="pro-message-meta">
                <span className="pro-meta-author">AI Assistant</span>
                <span className="pro-meta-badge badge-engine">Creative Processing</span>
              </div>
              <div className="pro-bubble pro-bubble-assistant typing" role="status" aria-label="ระบบกำลังประมวลผลคำตอบ">
                <span /><span /><span />
              </div>
            </div>
          </div>
        </>
      )}

      {!isAtBottom && (
        <button
          className="scroll-to-bottom"
          onClick={() => endRef.current?.scrollIntoView({ behavior: 'smooth' })}
          aria-label="เลื่อนไปล่างสุด"
          title="เลื่อนไปที่ข้อความล่าสุด"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </button>
      )}

      <div ref={endRef} />
    </div>
  );
}
