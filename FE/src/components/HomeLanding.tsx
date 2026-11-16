import { useEffect, useState } from "react";
import SiteNavbar from "./SiteNavbar";
import "../homeLanding.css";

interface MemberCardData {
  name: string;
  role: string;
  photo: string;
  skills: string[];
  work: string;
  email: string;
  lanyardColor: string;
  accentBg: string;
  accentText: string;
  backBg: string;
  dropOffsetPx: number;
}

const MEMBERS: MemberCardData[] = [
  {
    name: "พงศกร เจิมเจิดพล",
    role: "Front-end",
    photo: "profiles/icon_profile01.png",
    skills: ["Tailwind.css", "React", "TypeScript", "NextJS"],
    work: "ดูแลส่วน Front-end ของโปรเจกต์ Chat AI พร้อม Portfolio ของกลุ่ม linux",
    email: "pongsakorn.jerm@bumail.net",
    lanyardColor: "#E8A598",
    accentBg: "#F9D8D1",
    accentText: "#6E2F26",
    backBg: "#FDF2EF",
    dropOffsetPx: 14,
  },
  {
    name: "นรินทร์ฤทธิ์ หิรัญอาจ",
    role: "Back-end",
    photo: "images/member_portrait_one_1794740320754.jpg",
    skills: ["UX/UI", "3D model", "html", ".json", "css", "llm"],
    work: "ดูแลส่วน Back-end ของโปรเจกต์ Chat AI พร้อม Portfolio ของกลุ่ม linux",
    email: "narinlit.hirn@bumail.net",
    lanyardColor: "#98BBD9",
    accentBg: "#D6E7F5",
    accentText: "#234663",
    backBg: "#F0F6FB",
    dropOffsetPx: 14,
  },
  {
    name: "มนัสชนก สิมบุตร",
    role: "Chat bot",
    photo: "images/member_portrait_one_1794740320754.jpg",
    skills: ["html", "js", "css"],
    work: "ดูแลส่วน Chat bot ของโปรเจกต์ Chat AI พร้อม Portfolio ของกลุ่ม linux",
    email: "manatchanok.simb@bumail.net",
    lanyardColor: "#DFB3AA",
    accentBg: "#F6DFDA",
    accentText: "#6B362E",
    backBg: "#FCF3F1",
    dropOffsetPx: 14,
  },
  {
    name: "อุชุตา ศรีทองสุข",
    role: "Front-end",
    photo: "images/member_portrait_one_1794740320754.jpg",
    skills: ["html", "js", "css"],
    work: "ดูแลส่วน Front-end ของโปรเจกต์ Chat AI พร้อม Portfolio ของกลุ่ม linux",
    email: "uchuta.srit@bumail.net",
    lanyardColor: "#BFB2DB",
    accentBg: "#E7E0F6",
    accentText: "#433466",
    backBg: "#F6F3FC",
    dropOffsetPx: 14,
  },
  {
    name: "ปิยวัฒน์ ชื่นมีเชาว์",
    role: "Back-end",
    photo: "images/member_portrait_one_1794740320754.jpg",
    skills: ["js", "unity", "rigging", "android studio", "vscode"],
    work: "ดูแลส่วน Back-end ของโปรเจกต์ Chat AI พร้อม Portfolio ของกลุ่ม linux",
    email: "piyawat.chue@bumail.net",
    lanyardColor: "#A5C1AD",
    accentBg: "#D8EAD9",
    accentText: "#2A4E34",
    backBg: "#F1F7F2",
    dropOffsetPx: 14,
  },
];

function MailIcon() {
  return (
    <svg className="icon" viewBox="0 0 24 24">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function RotateIcon() {
  return (
    <svg className="icon" viewBox="0 0 24 24">
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  );
}

function LanyardCard({ member }: { member: MemberCardData }) {
  const [flipped, setFlipped] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <div className="member-cell">
      <div className="member">
        <div className="strap-wrap" style={{ ["--drop" as string]: `${member.dropOffsetPx}px` }} aria-hidden="true">
          <div className="strap" style={{ backgroundColor: member.lanyardColor }} />
          <div className="clasp">
            <div className="clasp-top" />
            <div className="clasp-bottom" />
          </div>
        </div>

        <button
          type="button"
          className={`card${flipped ? " flipped" : ""}`}
          aria-pressed={flipped}
          aria-label={`${member.name} — ${flipped ? "แสดงด้านหน้าบัตร" : "พลิกดูทักษะและช่องทางติดต่อ"}`}
          onClick={() => setFlipped(!flipped)}
        >
          <div className="card-inner">
            <div className="face face-front">
              <div>
                <div className="slot" />
                <div className="portrait" style={{ backgroundColor: member.accentBg }}>
                  {imageFailed ? (
                    <div className="portrait-fallback" style={{ color: member.accentText }}>
                      <strong>{member.name.charAt(0)}</strong>
                      <span>{member.name}</span>
                    </div>
                  ) : (
                    <img
                      src={member.photo}
                      alt={member.name}
                      referrerPolicy="no-referrer"
                      onError={() => setImageFailed(true)}
                    />
                  )}
                </div>
                <div className="identity">
                  <h3 className="truncate">{member.name}</h3>
                  <p className="role truncate">{member.role}</p>
                </div>
              </div>
            </div>

            <div className="face face-back" style={{ backgroundColor: member.backBg }}>
              <div>
                <div className="slot" />
                <div className="skills">
                  <p className="skills-title">SKILLS</p>
                  <div className="skill-list">
                    {member.skills.map((skill) => (
                      <span
                        key={skill}
                        className="skill"
                        style={{ backgroundColor: member.accentBg, color: member.accentText }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="skills">
                  <p className="bio">{member.work}</p>
                </div>
                <div className="skills">
                  <p className="skills-title">CONTACT</p>
                  <div className="social">
                    <MailIcon />
                    <span>{member.email}</span>
                  </div>
                </div>
              </div>
              <div className="back-foot">
                <div className="flip-hint">
                  <RotateIcon />
                  <span>คลิกเพื่อพลิกกลับ</span>
                </div>
              </div>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}

interface HomeLandingProps {
  onNavigateChat: () => void;
}

export default function HomeLanding({ onNavigateChat }: HomeLandingProps) {
  useEffect(() => {
    document.body.classList.add("landing-mode");
    return () => document.body.classList.remove("landing-mode");
  }, []);

  return (
    <div className="home-landing design-scope">
      <SiteNavbar onNavigateChat={onNavigateChat} />

      <main>
        <section id="hero" className="hero">
          <div className="folder-tabs" aria-hidden="true">
            <div className="tab tab-pink">01 · Linux</div>
            <div className="tab tab-purple">02 · Portfolio</div>
            <div className="tab tab-green">03 · Chat AI</div>
          </div>

          <div className="binder">
            <div className="edge edge-pink" aria-hidden="true" />
            <div className="edge edge-purple" aria-hidden="true" />
            <div className="edge edge-green" aria-hidden="true" />

            <div className="punch-holes" aria-hidden="true">
              <span className="hole" />
              <span className="hole" />
            </div>

            <div className="halftone-dots" aria-hidden="true" />

            <svg viewBox="0 0 64 64" className="star star-pink" aria-hidden="true">
              <path
                d="M32 4 L39 22 L58 24 L43 36 L48 55 L32 44 L16 55 L21 36 L6 24 L25 22 Z"
                fill="currentColor"
                stroke="#1F1C18"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
            </svg>
            <svg viewBox="0 0 64 64" className="star star-yellow" aria-hidden="true">
              <path
                d="M32 4 L39 22 L58 24 L43 36 L48 55 L32 44 L16 55 L21 36 L6 24 L25 22 Z"
                fill="currentColor"
                stroke="#1F1C18"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
            </svg>

            <div className="hero-content">
              <h1>Linux</h1>
              <p>Portfolio &amp; Chat AI</p>

              <div className="hero-actions">
                <button type="button" id="chat-btn" className="chat-btn" onClick={onNavigateChat}>
                  CHAT AI
                </button>
                <p id="chat-notice" className="chat-notice" role="status" hidden>
                  ส่วนหน้าต่างแชทยังไม่เปิดใช้งานในตอนนี้ (รอเชื่อมต่อในขั้นถัดไป)
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="project-details" className="details">
          <div className="details-card">
            <div className="details-head">
              <div className="details-head-text">
                <h2 className="section-title">TEAM PROJECT</h2>
              </div>
            </div>

            <p className="details-summary">
              สมาชิกในทีมสามารถนำศักยภาพและความถนัดเฉพาะตัวมาปรับใช้ในการทำงานได้อย่างมีประสิทธิภาพ มีการสื่อสารแลกเปลี่ยนไอเดียและปรึกษาหารือกันอย่างสม่ำเสมอเมื่อเจออุปสรรค เพื่อร่วมกันสร้างสรรค์ผลงานให้บรรลุเป้าหมาย
            </p>
          </div>
        </section>

        <section id="members" className="members">
          <div className="members-head">
            <h2 className="section-title">MEMBERS</h2>
          </div>

          <div className="rail">
            <div id="members-grid" className="members-grid">
              {MEMBERS.map((member) => (
                <LanyardCard key={member.name} member={member} />
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="contact">
          <div className="double-divider" aria-hidden="true">
            <div className="line-long" />
          </div>

          <div className="contact-card">
            <h2 className="section-title">CONTACT</h2>

            <div className="contact-action">
              <a
                className="github-btn"
                href="https://gitlab.com/narinlit.hirnart/aie312-project"
                target="_blank"
                rel="noopener"
              >
                GitLab
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-inner">
          <span className="footer-title">Linux Group Project</span>
        </div>
      </footer>
    </div>
  );
}
