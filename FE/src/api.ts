import type { Message, ChatExchange } from './types';

const BE_BASE_URL = (import.meta.env.VITE_BE_URL || "").replace(/\/$/, "");

const TIMEOUT_MS = 5000;

const SEND_TIMEOUT_MS = 30000;

export async function fetchMessages(): Promise<Message[]> {
  const res = await fetch(`${BE_BASE_URL}/messages`, { signal: AbortSignal.timeout(TIMEOUT_MS) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function sendMessage(text: string): Promise<ChatExchange> {
  const res = await fetch(`${BE_BASE_URL}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
    signal: AbortSignal.timeout(SEND_TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function clearMessages(): Promise<{ message: string }> {
  const res = await fetch(`${BE_BASE_URL}/messages`, {
    method: 'DELETE',
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function updateMessage(id: number, text: string): Promise<Message> {
  const res = await fetch(`${BE_BASE_URL}/messages/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function deleteMessage(id: number): Promise<{ message: string }> {
  const res = await fetch(`${BE_BASE_URL}/messages/${id}`, {
    method: 'DELETE',
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function fetchServerStatus(): Promise<{ aiConfigured: boolean; model?: string }> {
  try {
    const res = await fetch(`${BE_BASE_URL}/status`, { signal: AbortSignal.timeout(TIMEOUT_MS) });
    if (!res.ok) return { aiConfigured: false };
    return res.json();
  } catch {
    return { aiConfigured: false };
  }
}