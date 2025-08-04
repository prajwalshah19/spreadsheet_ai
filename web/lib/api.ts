import { ChatResponsePayload, ChatRequestPayload } from './types';

const BASE = process.env.NEXT_PUBLIC_API_BASE!;

export async function postGenerate(threadId: string, userText: string, turn: number): Promise<ChatResponsePayload> {
  const payload: ChatRequestPayload = {
    thread_id: threadId,
    prompt: userText,
    turn: turn
  };
  
  const res = await fetch(`${BASE}/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    throw new Error(`Generate failed ${res.status}: ${await res.text()}`);
  }
  return res.json();
}

export async function postReiterate(threadId: string, userText: string, turn: number): Promise<ChatResponsePayload> {
  const payload: ChatRequestPayload = {
    thread_id: threadId,
    prompt: userText,
    turn: turn
  };
  
  const res = await fetch(`${BASE}/reiterate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    throw new Error(`Reiterate failed ${res.status}: ${await res.text()}`);
  }
  return res.json();
} 