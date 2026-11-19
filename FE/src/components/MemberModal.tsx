import type { Member, Artwork } from "../types";

interface MemberModalProps {
  member: Member | null;
  onClose: () => void;
  onOpenArtworkModal?: (artwork: Artwork) => void;
  onAskAiAboutMember?: (memberName: string) => void;
}

export default function MemberModal({
  member,
  onClose,
  onOpenArtworkModal,
  onAskAiAboutMember,
}: MemberModalProps) {
  if (!member) return null;

  return (
    <div className="pro-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="pro-modal-window" onClick={(e) => e.stopPropagation()}>
        
        <div className="pro-modal-header">
          <div className="pro-modal-title-left">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            <span className="pro-modal-title">แฟ้มประวัติ & ผลงาน — {member.name}</span>
          </div>
          <button className="pro-modal-close" onClick={onClose} title="ปิดหน้าต่าง" aria-label="ปิด">
            <svg width="14" height="14" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        
        <div className="pro-modal-body">
          
          <div className="pro-profile-summary-card">
            <img src={member.avatar} alt={member.name} className="pro-modal-avatar" />
            <div className="pro-modal-bio-info">
              <div className="bio-name-row">
                <h3>{member.name}</h3>
                <span className="badge-role-tag">{member.role}</span>
              </div>
              <p className="bio-desc">{member.bio}</p>
              <div className="skills-row">
                <strong>ความเชี่ยวชาญ:</strong> <span>{member.skills}</span>
              </div>
            </div>
            {onAskAiAboutMember && (
              <button
                type="button"
                className="btn-ask-ai-pro"
                onClick={() => {
                  onClose();
                  onAskAiAboutMember(member.nickname);
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
                <span>วิเคราะห์ด้วย AI</span>
              </button>
            )}
          </div>

          
          <div className="pro-modal-section">
            <h4 className="pro-section-title">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
              <span>รูปภาพผลงาน ({member.artworks.length})</span>
            </h4>

            <div className="pro-modal-artworks-grid">
              {member.artworks.map((art) => (
                <div
                  key={art.id}
                  className="pro-art-card-item"
                  onClick={() => onOpenArtworkModal?.(art)}
                  title="คลิกเพื่อขยายดูภาพ"
                >
                  <div className="art-thumb-frame">
                    <img src={art.imageUrl} alt={art.title} />
                  </div>
                  <div className="art-thumb-info">
                    <span className="art-tag-label">{art.tag}</span>
                    <strong className="art-name-label">{art.title}</strong>
                    <p className="art-desc-label">{art.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          
          <div className="pro-modal-section">
            <h4 className="pro-section-title">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="16 18 22 12 16 6"/>
                <polyline points="8 6 2 12 8 18"/>
              </svg>
              <span>โปรเจกต์ที่ผ่านมา({member.projects.length})</span>
            </h4>

            <div className="pro-modal-projects-list">
              {member.projects.map((proj, idx) => (
                <div key={idx} className="pro-project-item">
                  <div className="proj-item-header">
                    <h5>{proj.title}</h5>
                    <span className="proj-tech-pill">{proj.tech}</span>
                  </div>
                  <p>{proj.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
