import { useState, useEffect } from "react";
import ChatLog from "../components/ChatLog";
import Composer from "../components/Composer";
import MemberModal from "../components/MemberModal";
import ImageModal from "../components/ImageModal";
import SiteNavbar from "../components/SiteNavbar";
import { fetchMessages, sendMessage, clearMessages, updateMessage, deleteMessage, fetchServerStatus } from "../api";
import { MEMBERS, ALL_ARTWORKS } from "../data/members";
import type { Message, Artwork, Member } from "../types";

const POLL_INTERVAL = 2000;

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [sending, setSending] = useState<boolean>(false);
  const [pendingText, setPendingText] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [isAiReady, setIsAiReady] = useState<boolean>(true);

  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);

  const matchArtworksFromText = (userText: string, assistantReplyText: string): Artwork[] => {
    const userLower = userText.toLowerCase();
    const assistantLower = assistantReplyText.toLowerCase();

    const hasRequestIntent = 
      userLower.includes("ขอดูรูป") ||
      userLower.includes("ขอรูป") ||
      userLower.includes("ดูรูป") ||
      userLower.includes("ขอดูภาพ") ||
      userLower.includes("ขอภาพ") ||
      userLower.includes("ดูภาพ") ||
      userLower.includes("ขอดูผลงาน") ||
      userLower.includes("ขอผลงาน") ||
      userLower.includes("ดูผลงาน") ||
      userLower.includes("วาดรูป") ||
      userLower.includes("วาดภาพ") ||
      userLower.includes("สร้างรูป") ||
      userLower.includes("สร้างภาพ") ||
      userLower.includes("generate รูป") ||
      userLower.includes("generate ภาพ") ||
      userLower.includes("show artwork") ||
      userLower.includes("show image");

    if (!hasRequestIntent) {
      return [];
    }

    for (const m of MEMBERS) {
      const nick = m.nickname.toLowerCase();
      const fullName = m.name.toLowerCase();
      const shortNick = nick.length > 4 ? nick.slice(0, 5) : nick;

      const isMentionedByUser = userLower.includes(nick) || userLower.includes(fullName) || userLower.includes(shortNick);
      const isMentionedByAi = assistantLower.includes(nick) || assistantLower.includes(fullName) || assistantLower.includes(shortNick);

      if (isMentionedByUser || isMentionedByAi) {
        return m.artworks && m.artworks.length > 0 ? m.artworks : [];
      }
    }

    if (userLower.includes("วาด") || userLower.includes("สร้างรูป") || userLower.includes("generate")) {
      return ALL_ARTWORKS.slice(0, 2);
    }

    return [];
  };

  useEffect(() => {
    async function checkStatus() {
      const status = await fetchServerStatus();
      setIsAiReady(status.aiConfigured);
    }
    checkStatus();

    async function refresh() {
      try {
        const raw = await fetchMessages();
        setMessages((prev) => {
          if (prev.length === 0) return raw;
          return raw.map((newMsg) => {
            const existing = prev.find((p) => p.id === newMsg.id);
            if (existing && existing.artworks) {
              return { ...newMsg, artworks: existing.artworks };
            }
            return newMsg;
          });
        });
        setError(null);
      } catch {
        setError("เชื่อมต่อเซิร์ฟเวอร์ไม่ได้ — ตรวจสอบว่า BE รันอยู่");
      }
    }
    refresh();
    const timer = setInterval(refresh, POLL_INTERVAL);
    return () => clearInterval(timer);
  }, []);

  async function handleSend(text: string) {
    setSending(true);
    setPendingText(text);
    setError(null);
    try {
      const { userMessage, assistantMessage } = await sendMessage(text);

      const matchedArts = matchArtworksFromText(userMessage.text, assistantMessage.text);
      const enrichedAssistant: Message = {
        ...assistantMessage,
        artworks: matchedArts.length > 0 ? matchedArts : undefined,
      };

      setMessages((prev) => [...prev, userMessage, enrichedAssistant]);
    } catch {
      setError("ส่งข้อความไม่สำเร็จ — ตรวจสอบการเชื่อมต่อ");
    }
    setSending(false);
    setPendingText(null);
  }

  async function handleClear() {
    try {
      await clearMessages();
      setMessages([]);
      setShowClearConfirm(false);
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
      setError("แก้ไขข้อความไม่สำเร็จ");
    }
  }

  async function handleDelete(id: number) {
    try {
      await deleteMessage(id);
      setMessages((prev) => prev.filter((m) => m.id !== id));
      setError(null);
    } catch {
      setError("ลบข้อความไม่สำเร็จ");
    }
  }

  const handleOpenMember = (memberId: string) => {
    const target = MEMBERS.find((m) => m.id === memberId || m.name.includes(memberId) || m.nickname.includes(memberId));
    if (target) {
      setSelectedMember(target);
    }
  };

  const navigateTo = (path: string) => {
    window.history.pushState({}, "", path);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  const goToSection = (hash: string) => {
    window.history.pushState({}, "", `/${hash}`);
    window.dispatchEvent(new PopStateEvent("popstate"));
    window.setTimeout(() => {
      document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" });
    }, 80);
  };

  return (
    <div className="pro-app-window">
      <div className="design-scope site-navbar">
        <SiteNavbar
          onNavigateChat={() => navigateTo("/chat")}
          onNavigateSection={goToSection}
          showChatButton={false}
          showNavLinks={false}
        />
      </div>

      
      <div className="pro-workspace-body">
        
        {showMobileSidebar && (
          <div className="pro-mobile-backdrop" onClick={() => setShowMobileSidebar(false)} />
        )}

        
        <aside className={`pro-sidebar ${showMobileSidebar ? "drawer-open" : ""}`}>
          
          <div className="mobile-sidebar-close-bar">
            <span className="drawer-title">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <line x1="9" y1="3" x2="9" y2="21"/>
              </svg>
              <span>แถบเมนูคำสั่ง</span>
            </span>
            <button
              className="btn-close-drawer"
              onClick={() => setShowMobileSidebar(false)}
              aria-label="ปิดเมนูแถบข้าง"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          
          <div className="pro-sidebar-card">
            <div className="card-top-status">
              <span className="card-label">ACTIVE AGENT</span>
              {isAiReady ? (
                <span className="agent-ready-pill" title="AI เชื่อมต่อ API Key พร้อมใช้งาน">
                  <span className="status-dot dot-blue" />
                  Ready
                </span>
              ) : (
                <span className="agent-ready-pill pill-not-ready" title="ยังไม่ได้ตั้งค่า LLM_API_KEY">
                  <span className="status-dot dot-orange" />
                  Not Ready
                </span>
              )}
            </div>

            
          </div>

          
          <div className="pro-sidebar-card templates-card">
            <div className="card-top-status">
              <div className="template-title-left">

                <span className="card-label">QUICK PROMPT</span>
              </div>
            </div>

            <div className="templates-list">
              <button
                type="button"
                className="template-item-btn"
                onClick={() => {
                  setShowMobileSidebar(false);
                  handleSend("ผลงานทั้งหมดของกลุ่มมีอะไรบ้าง");
                }}
                disabled={sending}
              >
                <div className="template-icon-wrap icon-cyan">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                </div>
                <div className="template-text">
                  <strong>ผลงานทั้งหมด</strong>
                  <p>ผลงานทั้งหมดของกลุ่มมีอะไรบ้าง</p>
                </div>
              </button>

              <button
                type="button"
                className="template-item-btn"
                onClick={() => {
                  setShowMobileSidebar(false);
                  handleSend("ดูข้อมูลสมาชิกทั้งหมด");
                }}
                disabled={sending}
              >
                <div className="template-icon-wrap icon-red">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                  </svg>
                </div>
                <div className="template-text">
                  <strong>รายชื่อสมาชิก</strong>
                  <p>ดูข้อมูลสมาชิกทั้งหมด</p>
                </div>
              </button>

              <button
                type="button"
                className="template-item-btn"
                onClick={() => {
                  setShowMobileSidebar(false);
                  handleSend("จุดเด่นของกลุ่ม");
                }}
                disabled={sending}
              >
                <div className="template-icon-wrap icon-orange">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 20h9"/>
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                  </svg>
                </div>
                <div className="template-text">
                  <strong>จุดเด่นของกลุ่ม</strong>
                  <p>ความสามารถและจุดเด่นของกลุ่มนี้</p>
                </div>
              </button>
            </div>
          </div>

          
          <div className="pro-sidebar-card directory-card">
            <span className="card-label">MEMBERS DIRECTORY</span>
            <div className="directory-list">
              {MEMBERS.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  className="directory-item"
                  onClick={() => {
                    setShowMobileSidebar(false);
                    setSelectedMember(m);
                  }}
                >
                  <img src={m.avatar} alt={m.name} className="dir-avatar" />
                  <div className="dir-info">
                    <strong>{m.name}</strong>
                    <span>{m.role}</span>
                  </div>
                </button>
              ))}
            </div>

            {messages.length > 0 && (
              <button
                type="button"
                className="btn-clear-chat"
                onClick={() => setShowClearConfirm(true)}
                disabled={sending}
              >
                ล้างประวัติการสนทนา
              </button>
            )}
          </div>

          
          <div className="pro-sidebar-bottom-tags">
            <div className="preset-pill">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
            </div>
            <div className="quality-pill">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </div>
          </div>
        </aside>

        
        <main className="pro-chat-main">
          {error && (
            <div className="pro-error-banner" role="alert">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <span>{error}</span>
            </div>
          )}

          
          {showClearConfirm && (
            <div className="pro-modal-overlay">
              <div className="pro-confirm-dialog">
                <h3>ยืนยันการล้างประวัติการสนทนา?</h3>
                <p>ข้อความทั้งหมด {messages.length} รายการจะถูกลบออกจากฐานข้อมูลอย่างถาวร</p>
                <div className="pro-dialog-actions">
                  <button className="btn-cancel" onClick={() => setShowClearConfirm(false)}>
                    ยกเลิก
                  </button>
                  <button className="btn-confirm-delete" onClick={handleClear}>
                    ล้างประวัติ
                  </button>
                </div>
              </div>
            </div>
          )}

          
          <ChatLog
            messages={messages}
            pendingText={pendingText}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            onViewMember={handleOpenMember}
            onOpenImageModal={setSelectedArtwork}
          />

          
          <Composer
            onSend={handleSend}
            disabled={sending}
            onSelectPrompt={handleSend}
          />
        </main>
      </div>

      
      <footer className="pro-footer-statusbar">
        <div className="status-item-left">
          <span className="status-dot dot-green" />
          <span>Server Latency: 24ms</span>
          <span className="status-separator">•</span>
          <span>Location: Asia-Pacific (Bangkok)</span>
        </div>
        <div className="status-item-right">
          <span>Encoding: UTF-8</span>
          <span className="status-separator">•</span>
          <span>LINUX CHAT AI</span>
        </div>
      </footer>

      
      <MemberModal
        member={selectedMember}
        onClose={() => setSelectedMember(null)}
        onOpenArtworkModal={setSelectedArtwork}
        onAskAiAboutMember={(name) => handleSend(`ช่วยวิเคราะห์และแนะนำผลงานของ ${name} ให้หน่อยครับ`)}
      />

      <ImageModal
        artwork={selectedArtwork}
        onClose={() => setSelectedArtwork(null)}
        onViewMember={handleOpenMember}
      />
    </div>
  );
}
