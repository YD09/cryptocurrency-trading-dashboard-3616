import { useEffect, useState } from 'react';
import { getPortfolioSnapshot, streamPortfolioSnapshot } from '@/lib/api';

export default function RealtimePnL() {
  const [snapshot, setSnapshot] = useState<any>(null);

  useEffect(() => {
    let cancelled = false;
    getPortfolioSnapshot().then(setSnapshot).catch(console.error);
    streamPortfolioSnapshot((data) => { if (!cancelled) setSnapshot(data); }).catch(console.error);
    return () => { cancelled = true; };
  }, []);

  if (!snapshot) return <div className="p-4">Loading P&L...</div>;

  return (
    <div className="p-4 border rounded-md">
      <h3 className="text-lg font-semibold mb-2">Real-time P&amp;L</h3>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>Balance</div><div className="text-right">₹ {Number(snapshot.balance).toFixed(2)}</div>
        <div>Equity</div><div className="text-right">₹ {Number(snapshot.equity).toFixed(2)}</div>
        <div>Unrealized P&amp;L</div><div className={`text-right ${snapshot.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>₹ {Number(snapshot.pnl).toFixed(2)}</div>
      </div>
    </div>
  );
}