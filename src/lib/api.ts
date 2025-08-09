import { supabase } from '@/lib/supabase';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

async function authHeader() {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getPortfolioSnapshot() {
  const headers = await authHeader();
  const res = await fetch(`${API_URL}/api/portfolio`, { headers });
  if (!res.ok) throw new Error('Failed to fetch portfolio');
  return res.json();
}

export async function streamPortfolioSnapshot(onMessage: (data: any) => void) {
  const headers = await authHeader();
  const url = `${API_URL}/api/portfolio/stream`;
  const resp = await fetch(url, { headers });
  if (!resp.body) return;
  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const parts = buffer.split('\n\n');
    for (let i = 0; i < parts.length - 1; i++) {
      const block = parts[i];
      if (block.startsWith('data:')) {
        const json = block.replace(/^data:\s*/, '');
        try { onMessage(JSON.parse(json)); } catch {}
      }
    }
    buffer = parts[parts.length - 1];
  }
}

export async function listTrades() {
  const headers = await authHeader();
  const res = await fetch(`${API_URL}/api/trades`, { headers });
  if (!res.ok) throw new Error('Failed to fetch trades');
  return res.json();
}

export async function createTrade(payload: { symbol: string; type: 'BUY'|'SELL'; volume: number; stopLoss?: number; takeProfit?: number; }) {
  const headers = { 'Content-Type': 'application/json', ...(await authHeader()) };
  const res = await fetch(`${API_URL}/api/trades`, { method: 'POST', headers, body: JSON.stringify(payload) });
  if (!res.ok) throw new Error('Failed to create trade');
  return res.json();
}

export async function closeTrade(id: string) {
  const headers = await authHeader();
  const res = await fetch(`${API_URL}/api/trades/${id}/close`, { method: 'POST', headers });
  if (!res.ok) throw new Error('Failed to close trade');
  return res.json();
}