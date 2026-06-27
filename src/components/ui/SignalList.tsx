import { Signal } from '@/lib/api'

interface Props { signals: Signal[] }

export default function SignalList({ signals }: Props) {
  if (signals.length === 0) {
    return <p className="text-muted text-sm text-center py-6">No signals today</p>
  }
  return (
    <div className="space-y-2">
      {signals.map(s => (
        <div key={s.id} className="flex items-center gap-4 p-3 rounded-lg bg-surface-2">
          <span className={`badge ${s.signalType === 'CE' ? 'badge-green' : 'badge-amber'} shrink-0`}>
            {s.indexName} {s.signalType}
          </span>
          <div className="flex-1 grid grid-cols-5 gap-2 text-xs font-mono">
            <div><span className="text-muted">Strike</span><br />₹{s.strikePrice}</div>
            <div><span className="text-muted">Premium</span><br />₹{s.premiumAtSignal}</div>
            <div><span className="text-muted">RSI</span><br />{s.rsiValue}</div>
            <div><span className="text-muted">Vol ×</span><br />{s.volumeRatio}×</div>
            <div><span className="text-muted">Delta</span><br />{s.deltaValue}</div>
          </div>
          <span className={`badge shrink-0 ${s.status === 'GENERATED' ? 'badge-green' : 'badge-red'}`}>
            {s.status}
          </span>
          {s.rejectionReason && (
            <span className="text-xs text-muted truncate max-w-40" title={s.rejectionReason}>
              {s.rejectionReason}
            </span>
          )}
        </div>
      ))}
    </div>
  )
}
