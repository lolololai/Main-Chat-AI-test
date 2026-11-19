// Serverless proxy (Vercel) — ส่งต่อ GET /status ไปยัง BE ผ่าน BE_URL
const BE = process.env.BE_URL || "";

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

export default async function handler(_req: unknown, res: AnyRes) {
  if (!BE) {
    respond(res, 503, { error: "BE_URL is not set — set it in the Vercel project environment" });
    return;
  }
  try {
    const upstream = await fetch(BE + "/status");
    const text = await upstream.text();
    res.statusCode = upstream.status;
    res.setHeader("content-type", "application/json");
    res.end(text);
  } catch {
    respond(res, 502, { error: "Could not reach BE" });
  }
}
