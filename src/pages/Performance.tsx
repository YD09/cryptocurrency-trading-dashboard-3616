import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function Performance() {
  const [items, setItems] = useState<{ date: string; pnl: number }[]>([]);

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) return;
      const res = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:8080') + '/api/performance', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setItems(await res.json());
    })();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-2">Performance History</h2>
      <div className="space-y-1">
        {items.map((it) => (
          <div key={it.date} className="flex justify-between border-b py-1 text-sm">
            <span>{it.date}</span>
            <span className={it.pnl >= 0 ? 'text-green-600' : 'text-red-600'}>₹ {Number(it.pnl).toFixed(2)}</span>
          </div>
        ))}
        {items.length === 0 && <div>No performance data yet.</div>}
      </div>
    </div>
  );
}