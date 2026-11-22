import { resolve } from "node:path";
import { Pool } from "pg";

try {
  process.loadEnvFile(resolve(process.cwd(), ".env"));
} catch {
}
try {
  process.loadEnvFile(resolve(__dirname, "../.env"));
} catch {
}

export interface Message {
  id: number;
  role: "user" | "assistant";
  text: string;
  createdAt?: string;
}

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.warn("⚠️  ยังไม่ได้ตั้งค่า DATABASE_URL สำหรับ PostgreSQL");
}

const localDatabase = connectionString
  ? /@(?:localhost|127\.0\.0\.1|::1)(?::|\/)/i.test(connectionString)
  : false;

const pool = new Pool({
  connectionString,
  ssl: connectionString && !localDatabase
    ? { rejectUnauthorized: false }
    : undefined,
});

let initialized = false;

export async function initDb(): Promise<void> {
  if (initialized) return;
  if (!connectionString) {
    throw new Error("DATABASE_URL ยังไม่ได้ตั้งค่า กรุณาเพิ่มใน BE/.env หรือ Environment Variables");
  }

  await pool.query(`
    CREATE TABLE IF NOT EXISTS messages (
      id         SERIAL PRIMARY KEY,
      role       TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
      text       TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS profile (
      id       SERIAL PRIMARY KEY,
      name     TEXT NOT NULL,
      nickname TEXT NOT NULL DEFAULT '',
      bio      TEXT NOT NULL,
      skills   TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS projects (
      id          SERIAL PRIMARY KEY,
      profile_id  INTEGER NOT NULL REFERENCES profile(id) ON DELETE CASCADE,
      title       TEXT NOT NULL,
      description TEXT NOT NULL,
      tech        TEXT NOT NULL
    );
  `);

  initialized = true;
}

const toMessage = (r: Record<string, unknown>): Message => ({
  id: Number(r.id),
  role: r.role as Message["role"],
  text: String(r.text),
  createdAt: r.created_at ? String(r.created_at) : undefined,
});

export async function listMessages(): Promise<Message[]> {
  await initDb();
  const res = await pool.query(
    "SELECT id, role, text, created_at FROM messages ORDER BY id ASC",
  );
  return res.rows.map((r) => toMessage(r as Record<string, unknown>));
}

export async function recentMessages(n: number): Promise<Message[]> {
  await initDb();
  const res = await pool.query(
    "SELECT id, role, text, created_at FROM messages ORDER BY id DESC LIMIT $1",
    [n],
  );
  return res.rows
    .map((r) => toMessage(r as Record<string, unknown>))
    .reverse();
}

export async function addPair(
  userText: string,
  assistantText: string,
): Promise<[Message, Message]> {
  await initDb();
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const u = await client.query(
      "INSERT INTO messages (role, text) VALUES ($1, $2) RETURNING id, role, text, created_at",
      ["user", userText],
    );
    const a = await client.query(
      "INSERT INTO messages (role, text) VALUES ($1, $2) RETURNING id, role, text, created_at",
      ["assistant", assistantText],
    );
    await client.query("COMMIT");
    return [
      toMessage(u.rows[0] as Record<string, unknown>),
      toMessage(a.rows[0] as Record<string, unknown>),
    ];
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
}

export async function updateMessage(
  id: number,
  text: string,
): Promise<Message | null> {
  await initDb();
  const res = await pool.query(
    "UPDATE messages SET text = $1 WHERE id = $2 RETURNING id, role, text, created_at",
    [text, id],
  );
  if (res.rowCount === 0) return null;
  return toMessage(res.rows[0] as Record<string, unknown>);
}

export async function deleteMessage(id: number): Promise<boolean> {
  await initDb();
  const res = await pool.query("DELETE FROM messages WHERE id = $1", [id]);
  return (res.rowCount ?? 0) > 0;
}

export async function clearMessages(): Promise<void> {
  await initDb();
  await pool.query("DELETE FROM messages");
}

export interface ProfileRow {
  name: string;
  nickname: string;
  bio: string;
  skills: string;
}

export interface ProjectRow {
  title: string;
  description: string;
  tech: string;
}

export async function getPortfolioContext(): Promise<string> {
  await initDb();
  const profilesRes = await pool.query(
    "SELECT id, name, nickname, bio, skills FROM profile ORDER BY id ASC",
  );
  const profiles = profilesRes.rows as Array<{
    id: number;
    name: string;
    nickname: string;
    bio: string;
    skills: string;
  }>;

  if (profiles.length === 0) return "(ยังไม่มีข้อมูล portfolio)";

  const lines: string[] = [];
  for (const profile of profiles) {
    const projectsRes = await pool.query(
      "SELECT title, description, tech FROM projects WHERE profile_id = $1 ORDER BY id ASC",
      [profile.id],
    );

    lines.push(`--- นักศึกษา: ${profile.name} ---`);
    lines.push(`ชื่อ: ${profile.name}`);
    lines.push(`ชื่อเล่น: ${profile.nickname}`);
    lines.push(`แนะนำตัว: ${profile.bio}`);
    lines.push(`ทักษะ: ${profile.skills}`);
    lines.push("โปรเจกต์:");
    projectsRes.rows.forEach((p, i) => {
      lines.push(
        `${i + 1}. ${p.title} — ${p.description} (เทคโนโลยี: ${p.tech})`,
      );
    });
    lines.push("");
  }
  return lines.join("\n");
}

export interface StudentData {
  profile: { name: string; nickname: string; bio: string; skills: string };
  projects: { title: string; description: string; tech: string }[];
}

export async function saveAllStudents(students: StudentData[]): Promise<void> {
  await initDb();
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query("DELETE FROM projects");
    await client.query("DELETE FROM profile");

    for (const student of students) {
      const profileRes = await client.query(
        "INSERT INTO profile (name, nickname, bio, skills) VALUES ($1, $2, $3, $4) RETURNING id",
        [
          student.profile.name,
          student.profile.nickname,
          student.profile.bio,
          student.profile.skills,
        ],
      );
      const profileId = profileRes.rows[0].id as number;

      for (const p of student.projects) {
        await client.query(
          "INSERT INTO projects (profile_id, title, description, tech) VALUES ($1, $2, $3, $4)",
          [profileId, p.title, p.description, p.tech],
        );
      }
    }

    await client.query("COMMIT");
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
}