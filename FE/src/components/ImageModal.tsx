import { lazy, Suspense, useEffect, useState } from "react";
import type { Artwork } from "../types";

const ThreeView = lazy(() => import("./ThreeView"));

interface ImageModalProps {
  artwork: Artwork | null;
  onClose: () => void;
  onViewMember?: (memberId: string) => void;
}

export default function ImageModal({ artwork, onClose, onViewMember }: ImageModalProps) {
  const is3D = artwork?.category === "3d" || artwork?.tag.toLowerCase().includes("3d") || false;
  const [viewMode, setViewMode] = useState<"image" | "3d">(is3D ? "3d" : "image");

  useEffect(() => {
    setViewMode(is3D ? "3d" : "image");
  }, [artwork?.id, is3D]);

  if (!artwork) return null;

  return (
    <div className="pro-lightbox-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="pro-lightbox-window" onClick={(e) => e.stopPropagation()}>
        <div className="pro-lightbox-header">
          <div className="lightbox-title-wrap">
            <span className="lightbox-tag-pill">{artwork.tag}</span>
            <span className="lightbox-title-text">{artwork.title}</span>
            {is3D && (
              <span className="badge-3d-interactive">Interactive 3D</span>
            )}
          </div>

          <div className="lightbox-header-actions">
            {is3D && (
              <div className="view-mode-switch">
                <button
                  type="button"
                  className={`btn-mode-pill ${viewMode === "3d" ? "active" : ""}`}
                  onClick={() => setViewMode("3d")}
                >
                  3D View
                </button>
                <button
                  type="button"
                  className={`btn-mode-pill ${viewMode === "image" ? "active" : ""}`}
                  onClick={() => setViewMode("image")}
                >
                  2D Render
                </button>
              </div>
            )}
            <button className="pro-modal-close" onClick={onClose} title="ปิด" aria-label="ปิด">
              <svg width="14" height="14" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        </div>

        <div className="pro-lightbox-body">
          {viewMode === "3d" && is3D ? (
            <Suspense fallback={<div className="three-stage-loading">กำลังเตรียมตัวแสดงผล 3D…</div>}>
              <ThreeView
                modelType={artwork.model3dType || "cyber-cube"}
                modelUrl={artwork.modelUrl}
                title={artwork.title}
              />
            </Suspense>
          ) : (
            <div className="pro-lightbox-img-viewport">
              <img src={artwork.imageUrl} alt={artwork.title} />
            </div>
          )}

          <div className="pro-lightbox-footer-info">
            <div className="info-top-row">
              <span className="author-info">
                เจ้าของผลงาน: <strong>{artwork.authorName}</strong>
              </span>
              <span className="likes-badge">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
                <span>{artwork.likes ?? 100} Likes</span>
              </span>
            </div>

            <p className="lightbox-desc">{artwork.description}</p>

            <div className="lightbox-action-row">
              <button
                type="button"
                className="btn-view-member-pro"
                onClick={() => {
                  onClose();
                  onViewMember?.(artwork.authorId);
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                <span>ดูแฟ้มผลงานทั้งหมดของ {artwork.authorName}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
