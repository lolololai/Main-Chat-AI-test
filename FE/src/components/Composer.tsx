import React, { useState } from 'react';

const MAX_CHARS = 1000;

interface ComposerProps {
  onSend: (text: string) => void;
  disabled: boolean;
  onSelectPrompt?: (text: string) => void;
}

export default function Composer({ onSend, disabled }: ComposerProps) {
  const [text, setText] = useState<string>('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setText('');
  }

  const charCount = text.length;
  const isOverLimit = charCount > MAX_CHARS;
  const canSend = text.trim().length > 0 && !disabled && !isOverLimit;

  return (
    <div className="pro-composer-wrapper">
      <form className="pro-composer-form" onSubmit={handleSubmit}>
        
        <button
          type="button"
          className="pro-attach-btn"
          title="แนบเอกสารหรือรูปภาพอ้างอิง"
          aria-label="แนบเอกสาร"
          disabled={disabled}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
          </svg>
        </button>

        
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="พิมพ์ข้อความคำสั่งหรือขอให้ช่วยสร้างรูปภาพที่นี่..."
          disabled={disabled}
          maxLength={MAX_CHARS + 50}
          aria-label="พิมพ์ข้อความคำสั่ง"
        />

        
        <span className="pro-enter-hint">Enter</span>

        
        <button
          type="submit"
          className="pro-submit-btn"
          disabled={!canSend}
          title="ส่งข้อความ (Enter)"
          aria-label="ส่งข้อความ"
        >
          {disabled ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10" strokeDasharray="31.4" strokeDashoffset="10">
                <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="1s" repeatCount="indefinite"/>
              </circle>
            </svg>
          ) : (
            <>
              <span>ส่งข้อความ</span>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
