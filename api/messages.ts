// Serverless proxy (Vercel) — ส่งต่อ /messages และ /messages/:id ไปยัง BE ผ่าน BE_URL
const BE = process.env.BE_URL || "";

type AnyReq = {
  method?: string;
  url?: string;
  on?: (event: string, cb: (chunk: any) => void) => void;
};
type AnyRes = {
  statusCode: number;
  setHeader: (k: string, v: string) => void;
  end: (body?: string) => void;
};

function respond(res: AnyRes, status: number, data: unknown) {
  res.statusCode = status;
  res.setHeader("content-type", "application/json");
  res.end(typeof data === "string" ? data : JSON.stringify(data));
}

// ดึง path ของ BE จาก URL ต้นฉบับ (/messages, /messages/5, ...)
function bePath(url: string | undefined): string {
  const raw = (url || "/messages").replace(/^\/api\/messages/, "");
  if (raw === "") return "/messages";
  if (raw.startsWith("/messages")) return raw;
  return raw.startsWith("/") ? "/messages" + raw : "/messages/" + raw;
}

export default async function handler(req: AnyReq, res: AnyRes) {
  if (!BE) {
    respond(res, 503, {
      error:
        "BE_URL is not set — set it to the BE deployment URL (e.g. https://main-chat-ai-be-xxx.onrender.com) in the Vercel project environment",
    });
    return;
  }

  const method = (req.method || "GET").toUpperCase();

  let body: string | undefined;
  if (method === "POST" || method === "PUT") {
    body = await new Promise<string>((resolve) => {
      let data = "";
      req.on?.("data", (chunk: any) => (data += chunk));
      req.on?.("end", () => resolve(data));
    });
  }

  try {
    const upstream = await fetch(BE + bePath(req.url), {
      method,
      headers: { "content-type": "application/json", accept: "application/json" },
      body,
    });
    const text = await upstream.text();
    res.statusCode = upstream.status;
    res.setHeader("content-type", "application/json");
    res.end(text);
  } catch {
    respond(res, 502, { error: "Could not reach BE" });
  }
}
