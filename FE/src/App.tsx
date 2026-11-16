import { useState, useEffect } from "react";
import ChatPage from "./pages/chat";
import MembersPage from "./pages/MembersPage";
import MemberModal from "./components/MemberModal";
import ImageModal from "./components/ImageModal";
import { MEMBERS } from "./data/members";
import type { Member, Artwork } from "./types";

export default function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);

  useEffect(() => {
    const handleLocationChange = () => setCurrentPath(window.location.pathname);
    window.addEventListener("popstate", handleLocationChange);
    return () => window.removeEventListener("popstate", handleLocationChange);
  }, []);

  const navigateTo = (path: string) => {
    window.history.pushState({}, "", path);
    setCurrentPath(path);
  };

  if (currentPath === "/chat" || currentPath === "/chat/") {
    return <ChatPage />;
  }

  if (currentPath === "/members" || currentPath === "/members/") {
    return (
      <>
        <MembersPage
          members={MEMBERS}
          onOpenMemberModal={setSelectedMember}
          onOpenArtworkModal={setSelectedArtwork}
        />
        <MemberModal
          member={selectedMember}
          onClose={() => setSelectedMember(null)}
          onOpenArtworkModal={setSelectedArtwork}
          onAskAiAboutMember={(name) => navigateTo("/chat")}
        />
        <ImageModal
          artwork={selectedArtwork}
          onClose={() => setSelectedArtwork(null)}
          onViewMember={(id) => {
            const m = MEMBERS.find((mem) => mem.id === id);
            if (m) setSelectedMember(m);
          }}
        />
      </>
    );
  }

  return (
    <div className="pro-app-window">
      {/* ── TOP HEADER ── */}
      <header className="pro-header">
        <div className="pro-brand-zone">
          <div className="pro-logo-badge">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
          </div>
          <div className="pro-brand-info">
            <div className="brand-title-row">
              <span className="brand-name">LINUX CHAT AI</span>
              <span className="badge-tag badge-enterprise">Enterprise v2.4</span>
            </div>
            <span className="brand-sub">Workspace • Multi-Modal Creative Engine</span>
          </div>
        </div>

        <nav className="pro-nav-tabs">
          <button className={`pro-nav-link ${currentPath === "/" ? "active" : ""}`} onClick={() => navigateTo("/")}>
            หน้าหลัก
          </button>
          <button className={`pro-nav-link ${currentPath === "/about" ? "active" : ""}`} onClick={() => navigateTo("/about")}>
            <span className="status-dot dot-orange" />
            แนะนำกลุ่ม
          </button>
          <button className="pro-nav-link" onClick={() => navigateTo("/members")}>
            สมาชิก
          </button>
          <button className="pro-nav-link" onClick={() => navigateTo("/chat")}>
            CHAT AI
            <span className="status-dot dot-green" />
          </button>
        </nav>

        <div className="pro-header-right">
          <div className="cloud-sync-pill">
            <span className="status-dot dot-green" />
            <span>Cloud Sync</span>
          </div>
        </div>
      </header>

      {/* ── HOME HERO WORKSPACE ── */}
      <div className="pro-workspace-body home-workspace-layout">
        <div className="pro-home-hero-card">
          <div className="home-hero-badge">
            <span className="status-dot dot-green" />
            <span>กลุ่ม CTRL+V • Enterprise AI Platform</span>
          </div>

          <h1 className="pro-home-title">Creative AI Workspace & Portfolio</h1>
          <p className="pro-home-desc">
            ระบบบริหารจัดการและจัดแสดงผลงานรูปภาพ กราฟิกดีไซน์ และเว็บแอปพลิเคชัน
            ขับเคลื่อนด้วยโมเดล Generative AI อัจฉริยะที่พร้อมตอบคำถามและนำเสนอความสามารถของสมาชิกทุกคน
          </p>

          <div className="pro-home-buttons">
            <button className="btn-hero-primary" onClick={() => navigateTo("/chat")}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              <span>เข้าสู่หน้า CHAT AI Workspace</span>
            </button>

            <button className="btn-hero-secondary" onClick={() => navigateTo("/members")}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              <span>ดูรายชื่อสมาชิกและผลงาน</span>
            </button>
          </div>

          {/* Members Avatar Row */}
          <div className="pro-home-members-preview">
            <h3>ทีมงานผู้พัฒนา:</h3>
            <div className="pro-members-avatar-row">
              {MEMBERS.map((m) => (
                <div
                  key={m.id}
                  className="pro-avatar-chip"
                  onClick={() => setSelectedMember(m)}
                  title={`คลิกเพื่อดูผลงานของ ${m.name}`}
                >
                  <img src={m.avatar} alt={m.name} />
                  <span>{m.nickname}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <MemberModal
        member={selectedMember}
        onClose={() => setSelectedMember(null)}
        onOpenArtworkModal={setSelectedArtwork}
        onAskAiAboutMember={(name) => navigateTo("/chat")}
      />

      <ImageModal
        artwork={selectedArtwork}
        onClose={() => setSelectedArtwork(null)}
        onViewMember={(id) => {
          const m = MEMBERS.find((mem) => mem.id === id);
          if (m) setSelectedMember(m);
        }}
      />
    </div>
  );
}
