interface SiteNavbarProps {
  onNavigateChat: () => void;
  onNavigateSection?: (hash: string) => void;
  showChatButton?: boolean;
  showNavLinks?: boolean;
}

const SECTIONS = [
  { label: "HOME", hash: "#hero" },
  { label: "TEAM", hash: "#project-details" },
  { label: "MEMBERS", hash: "#members" },
  { label: "CONTACT", hash: "#contact" },
];

export default function SiteNavbar({
  onNavigateChat,
  onNavigateSection,
  showChatButton = true,
  showNavLinks = true,
}: SiteNavbarProps) {
  const handleSectionClick = (event: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
    if (!onNavigateSection) return;
    event.preventDefault();
    onNavigateSection(hash);
  };

  return (
    <header className="topbar">
      <div className="topbar-inner">
        <a
          href="#hero"
          className="logo"
          onClick={(event) => handleSectionClick(event, "#hero")}
        >
          Linux
        </a>

        {showNavLinks && (
          <nav className="main-nav" aria-label="หลัก">
            {SECTIONS.map((section) => (
              <a
                key={section.hash}
                href={section.hash}
                onClick={(event) => handleSectionClick(event, section.hash)}
              >
                {section.label}
              </a>
            ))}
          </nav>
        )}

        {showChatButton && (
          <a
            href="/chat"
            className="pill-btn"
            onClick={(event) => {
              event.preventDefault();
              onNavigateChat();
            }}
          >
            CHAT AI
          </a>
        )}
      </div>
    </header>
  );
}
