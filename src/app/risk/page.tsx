import { api } from '@/lib/api'
import RiskGauge from '@/components/ui/RiskGauge'
export const dynamic = 'force-dynamic'

export default async function RiskPage() {
  const [risk, pnl] = await Promise.all([
    api.riskSummary().catch(() => null),
    api.dailyPnl().catch(() => null),
  ])

  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-data text-xl font-semibold">Risk Management</h1>

      {/* Status banner */}
      <div className={`card border ${risk?.tradingAllowed ? 'border-accent/20' : 'border-loss/30'}`}>
        <div className="flex items-center gap-3">
          <div className={`w-2.5 h-2.5 rounded-full ${risk?.tradingAllowed ? 'bg-accent' : 'bg-loss'}`} />
          <p className="text-data font-medium">{risk?.tradingAllowed ? 'Trading is active' : 'Trading is blocked'}</p>
          <span className="text-muted text-sm ml-auto">{risk?.reason}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Gauge */}
        <div className="card flex flex-col items-center py-6">
          <p className="text-muted text-xs font-mono uppercase tracking-wider mb-4">Daily Loss Consumed</p>
          <RiskGauge used={risk?.lossUsedToday ?? 0} limit={risk?.dailyLossLimit ?? 4500} />
        </div>

        {/* Stats */}
        <div className="card space-y-5">
          <Row label="Trades Used" value={`${risk?.tradesUsedToday ?? 0} / ${risk?.maxTradesPerDay ?? 2}`} />
          <Row label="Trades Remaining" value={String(risk?.remainingTrades ?? 0)} />
          <div className="border-t border-white/5 pt-4">
            <Row label="Loss Used Today" value={`₹${(risk?.lossUsedToday ?? 0).toLocaleString('en-IN')}`} cls="text-loss" />
            <Row label="Daily Loss Limit" value={`₹${(risk?.dailyLossLimit ?? 4500).toLocaleString('en-IN')}`} />
            <Row label="Remaining Budget" value={`₹${(risk?.remainingLossBudget ?? 0).toLocaleString('en-IN')}`} cls="text-accent" />
          </div>
        </div>
      </div>

      {/* Today's P&L */}
      {pnl && (
        <div className="card">
          <h2 className="text-data text-sm font-semibold mb-4">Today — {pnl.tradeDate}</h2>
          <div className="grid grid-cols-3 gap-6 font-mono text-sm">
            <div>
              <p className="text-muted text-xs">Total Trades</p>
              <p className="text-data mt-1 text-xl font-semibold">{pnl.totalTrades}</p>
            </div>
            <div>
              <p className="text-muted text-xs">Total P&L</p>
              <p className={`mt-1 text-xl font-semibold ${pnl.totalPnl >= 0 ? 'text-accent' : 'text-loss'}`}>
                {pnl.totalPnl >= 0 ? '+' : ''}₹{Math.abs(pnl.totalPnl).toLocaleString('en-IN')}
              </p>
            </div>
            <div className="space-y-1.5">
              <Flag label="Loss Limit Hit" active={pnl.dailyLossLimitHit} />
              <Flag label="Max Trades Hit" active={pnl.maxTradesHit} />
              <Flag label="Trading Disabled" active={pnl.tradingDisabled} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Row({ label, value, cls = 'text-data' }: { label: string; value: string; cls?: string }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-muted text-sm">{label}</span>
      <span className={`font-mono text-sm font-medium ${cls}`}>{value}</span>
    </div>
  )
}

function Flag({ label, active }: { label: string; active: boolean }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-loss' : 'bg-surface-2'}`} />
      <span className={active ? 'text-loss' : 'text-muted'}>{label}</span>
    </div>
  )
}
