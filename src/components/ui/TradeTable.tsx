import { Trade } from '@/lib/api'

interface Props { trades: Trade[] }

const statusClass: Record<string, string> = {
  OPEN: 'badge-green', PARTIALLY_CLOSED: 'badge-amber',
  CLOSED: 'badge-muted', CANCELLED: 'badge-muted', REJECTED: 'badge-red',
}

export default function TradeTable({ trades }: Props) {
  if (trades.length === 0) {
    return <p className="text-muted text-sm text-center py-6">No trades today</p>
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-muted text-xs font-mono border-b border-white/5">
            {['Symbol', 'Type', 'Qty', 'Entry', 'SL', 'T1', 'T2', 'Exit', 'P&L', 'Status'].map(h => (
              <th key={h} className="text-left pb-2 pr-4 font-medium">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {trades.map(t => {
            const pnl = t.realizedPnl
            return (
              <tr key={t.id} className="border-b border-white/5 last:border-0">
                <td className="py-2.5 pr-4 font-mono text-xs text-data">{t.tradingSymbol}</td>
                <td className="py-2.5 pr-4">
                  <span className={`badge ${t.signalType === 'CE' ? 'badge-green' : 'badge-amber'}`}>
                    {t.indexName} {t.tradingSymbol?.includes('CE') ? 'CE' : 'PE'}
                  </span>
                </td>
                <td className="py-2.5 pr-4 font-mono">{t.quantity}</td>
                <td className="py-2.5 pr-4 font-mono">₹{t.entryPrice}</td>
                <td className="py-2.5 pr-4 font-mono text-loss">₹{t.stopLossPrice}</td>
                <td className="py-2.5 pr-4 font-mono text-accent">₹{t.target1Price}</td>
                <td className="py-2.5 pr-4 font-mono text-accent">₹{t.target2Price}</td>
                <td className="py-2.5 pr-4 font-mono">{t.exitPrice ? `₹${t.exitPrice}` : '—'}</td>
                <td className={`py-2.5 pr-4 font-mono font-medium ${pnl == null ? 'text-muted' : pnl >= 0 ? 'text-accent' : 'text-loss'}`}>
                  {pnl != null ? `${pnl >= 0 ? '+' : ''}₹${Math.abs(pnl).toLocaleString('en-IN')}` : '—'}
                </td>
                <td className="py-2.5">
                  <span className={`badge ${statusClass[t.status] ?? 'badge-muted'}`}>{t.status}</span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
