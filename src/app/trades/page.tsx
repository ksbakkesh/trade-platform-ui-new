import { api } from '@/lib/api'
import TradeTable from '@/components/ui/TradeTable'
export const dynamic = 'force-dynamic'

export default async function TradesPage() {
  const [today, open] = await Promise.all([
    api.todayTrades().catch(() => []),
    api.openTrades().catch(() => []),
  ])
  return (
    <div className="space-y-6 max-w-6xl">
      <h1 className="text-data text-xl font-semibold">Trades</h1>
      <div className="card">
        <h2 className="text-data text-sm font-semibold mb-4">Open ({open.length})</h2>
        <TradeTable trades={open} />
      </div>
      <div className="card">
        <h2 className="text-data text-sm font-semibold mb-4">Today&apos;s History ({today.length})</h2>
        <TradeTable trades={today} />
      </div>
    </div>
  )
}
