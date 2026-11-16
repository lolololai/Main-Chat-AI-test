import type { Artwork } from '../types';

interface ArtworkCardProps {
  artwork: Artwork;
  onViewMember?: (memberId: string) => void;
  onOpenImageModal?: (artwork: Artwork) => void;
}

export default function ArtworkCard({ artwork, onViewMember, onOpenImageModal }: ArtworkCardProps) {
  return (
    <div className="pro-asset-card">
      <div className="pro-asset-header">
        <span className="pro-asset-pill">
          <span className="pill-dot red-dot" />
          {artwork.tag || 'Asset #01'}
        </span>
        <span className="pro-asset-author">โดย: {artwork.authorName}</span>
      </div>

      <div
        className="pro-asset-img-container"
        onClick={() => onOpenImageModal?.(artwork)}
        title="คลิกเพื่อขยายดูรายละเอียดรูปภาพ"
      >
        <img
          src={artwork.imageUrl}
          alt={artwork.title}
          className="pro-asset-img"
          loading="lazy"
        />
        <div className="pro-asset-overlay">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            <line x1="11" y1="8" x2="11" y2="14"/>
            <line x1="8" y1="11" x2="14" y2="11"/>
          </svg>
          <span>คลิกเพื่อขยายดูภาพ</span>
        </div>
      </div>

      <div className="pro-asset-details">
        <div className="pro-asset-title-block">
          <h4 className="pro-asset-title">{artwork.title}</h4>
          <span className="pro-asset-subtitle">{artwork.description}</span>
        </div>

        <div className="pro-asset-actions">
          <span className="badge-ready">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Ready for Export
          </span>

          <div className="pro-btn-group">
            <button
              type="button"
              className="pro-action-btn btn-primary-pro"
              onClick={() => onViewMember?.(artwork.authorId)}
              title={`ดูผลงานทั้งหมดของ ${artwork.authorName}`}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <span>รายละเอียด</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
