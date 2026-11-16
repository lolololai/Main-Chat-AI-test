import type { Member, Artwork } from "../types";

interface MembersPageProps {
  members: Member[];
  onOpenMemberModal: (member: Member) => void;
  onOpenArtworkModal: (artwork: Artwork) => void;
}

export default function MembersPage({ members, onOpenMemberModal, onOpenArtworkModal }: MembersPageProps) {
  const navigateTo = (path: string) => {
    window.history.pushState({}, "", path);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  return (
    <div className="pro-app-window">
      
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
          <button className="pro-nav-link" onClick={() => navigateTo("/")}>
            หน้าหลัก
          </button>
          <button className="pro-nav-link" onClick={() => navigateTo("/about")}>
            <span className="status-dot dot-orange" />
            แนะนำกลุ่ม
          </button>
          <button className="pro-nav-link active" onClick={() => navigateTo("/members")}>
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
          <div className="window-controls-group">
            <button className="win-btn" onClick={() => navigateTo("/")} title="ปิด">
              <svg width="11" height="11" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        </div>
      </header>

      
      <div className="pro-workspace-body members-page-layout">
        <div className="pro-members-header">
          <div>
            <h2>ทำเนียบสมาชิก & ผลงานสร้างสรรค์</h2>
            <p>รายชื่อสมาชิกกลุ่ม CTRL+V และผลงาน Asset ทั้งหมดที่ออกแบบและพัฒนา</p>
          </div>
          <button className="pro-btn-back-chat" onClick={() => navigateTo("/chat")}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            <span>กลับสู่หน้าแชท</span>
          </button>
        </div>

        <div className="pro-members-grid">
          {members.map((m) => (
            <div key={m.id} className="pro-member-card">
              <div className="card-profile-top">
                <img src={m.avatar} alt={m.name} className="member-card-avatar" />
                <div className="member-card-title-info">
                  <h3>{m.name}</h3>
                  <span className="member-badge-role">{m.role}</span>
                </div>
              </div>

              <p className="member-card-bio">{m.bio}</p>

              <div className="member-skills-summary">
                <strong>ทักษะ:</strong> <span>{m.skills}</span>
              </div>

              
              <div className="member-art-preview-wrap">
                <div className="preview-label">ผลงานตัวอย่าง:</div>
                <div className="preview-thumbnails-row">
                  {m.artworks.map((art) => (
                    <div
                      key={art.id}
                      className="preview-thumb-box"
                      onClick={() => onOpenArtworkModal(art)}
                      title={`${art.title} (คลิกดูภาพขยาย)`}
                    >
                      <img src={art.imageUrl} alt={art.title} />
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                className="btn-open-full-portfolio"
                onClick={() => onOpenMemberModal(m)}
              >
                <span>ดูประวัติและผลงานทั้งหมด</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
