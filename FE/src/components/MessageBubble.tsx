import { useState } from 'react';
import type { Message, Artwork } from '../types';
import ArtworkCard from './ArtworkCard';

interface MessageBubbleProps {
  message: Message;
  onUpdate: (id: number, text: string) => void;
  onDelete: (id: number) => void;
  onViewMember?: (memberId: string) => void;
  onOpenImageModal?: (artwork: Artwork) => void;
}

function formatTime(createdAt?: string): string {
  if (!createdAt) return '10:44 AM';
  const date = new Date(createdAt.endsWith('Z') ? createdAt : `${createdAt}Z`);
  if (isNaN(date.getTime())) return '10:44 AM';
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

export default function MessageBubble({
  message,
  onUpdate,
  onDelete,
  onViewMember,
  onOpenImageModal,
}: MessageBubbleProps) {
  const isUser: boolean = message.role === 'user';
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);

  function startEdit() {
    setDraft(message.text);
    setEditing(true);
  }

  function saveEdit() {
    const trimmed = draft.trim();
    if (!trimmed) return;
    onUpdate(message.id, trimmed);
    setEditing(false);
  }

  function handleDeleteClick() {
    if (confirmDelete) {
      onDelete(message.id);
    } else {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
    }
  }

  const timeString = formatTime(message.createdAt);

  return (
    <div className={`pro-message-row ${isUser ? 'row-user' : 'row-assistant'}`}>
      
      {!isUser && (
        <div className="pro-avatar pro-avatar-ai" title="AI Creative Engine" aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10 2v7.31L4.1 19.34A2 2 0 0 0 5.8 22h12.4a2 2 0 0 0 1.7-2.66L14 9.31V2h-4z"/>
            <line x1="8.5" y1="2" x2="15.5" y2="2"/>
            <path d="M14 9.3l-2.5 4-2.5-4"/>
          </svg>
        </div>
      )}

      <div className="pro-message-content">
        
        <div className="pro-message-meta">
          {!isUser ? (
            <>
              <span className="pro-meta-author">LINUX AI</span>
            </>
          ) : (
            <>
              <span className="pro-meta-time">{timeString}</span>
              <span className="pro-meta-author">คุณ </span>
            </>
          )}
        </div>

        
        <div className={`pro-bubble ${isUser ? 'pro-bubble-user' : 'pro-bubble-assistant'}`}>
          {editing ? (
            <div className="pro-bubble-edit">
              <input
                autoFocus
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') saveEdit();
                  if (e.key === 'Escape') setEditing(false);
                }}
                aria-label="แก้ไขข้อความ"
              />
              <button className="btn-edit-save" onClick={saveEdit} disabled={!draft.trim()}>
                บันทึก
              </button>
              <button className="btn-edit-cancel" onClick={() => setEditing(false)}>
                ยกเลิก
              </button>
            </div>
          ) : (
            <>
              <div className="pro-bubble-text">{message.text}</div>

              
              {message.artworks && message.artworks.length > 0 && (
                <div className="pro-artworks-container">
                  <div className="pro-artworks-grid">
                    {message.artworks.map((art) => (
                      <ArtworkCard
                        key={art.id}
                        artwork={art}
                        onViewMember={onViewMember}
                        onOpenImageModal={onOpenImageModal}
                      />
                    ))}
                  </div>

                  
                  <div className="pro-engine-metadata-footer">
                    <div className="pro-meta-right-icons">
                      <button type="button" className="meta-icon-btn" title="คัดลอก Prompt" aria-label="คัดลอก Prompt">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                        </svg>
                      </button>
                      <button type="button" className="meta-icon-btn" title="ดาวน์โหลดภาพ" aria-label="ดาวน์โหลดภาพ">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                          <polyline points="7 10 12 15 17 10"/>
                          <line x1="12" y1="15" x2="12" y2="3"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        
        <div className="pro-actions-bar">

        </div>
      </div>

      

    </div>
  );
}
