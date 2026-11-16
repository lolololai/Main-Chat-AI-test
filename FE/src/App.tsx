import { useState, useEffect } from "react";
import ChatPage from "./pages/chat";
import MembersPage from "./pages/MembersPage";
import MemberModal from "./components/MemberModal";
import ImageModal from "./components/ImageModal";
import HomeLanding from "./components/HomeLanding";
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

  return <HomeLanding onNavigateChat={() => navigateTo("/chat")} />;
}
