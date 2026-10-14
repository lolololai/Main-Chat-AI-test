import { useState } from 'react';

interface ComposerProps {
  onSend: (text: string) => void;
  disabled: boolean;
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

  return (
    <form className="composer" onSubmit={handleSubmit}>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="พิมพ์ข้อความถึงบอท..."
      />
      <button type="submit" disabled={!text.trim() || disabled}>
        ส่ง
      </button>
    </form>
  );
}
