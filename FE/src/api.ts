import type { Message, ChatExchange } from './types';

const TIMEOUT_MS = 5000;

// รอ AI ตอบได้นานกว่าปกติ (30 วินาที)
const SEND_TIMEOUT_MS = 30000;

export async function fetchMessages(): Promise<Message[]> {
  const res = await fetch('/messages', { signal: AbortSignal.timeout(TIMEOUT_MS) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function sendMessage(text: string): Promise<ChatExchange> {
  const res = await fetch('/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
    signal: AbortSignal.timeout(SEND_TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function clearMessages(): Promise<{ message: string }> {
  const res = await fetch('/messages', {
    method: 'DELETE',
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function updateMessage(id: number, text: string): Promise<Message> {
  const res = await fetch(`/messages/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function deleteMessage(id: number): Promise<{ message: string }> {
  const res = await fetch(`/messages/${id}`, {
    method: 'DELETE',
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
