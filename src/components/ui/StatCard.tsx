interface Props {
  label: string
  value: string
  sub?: string
  valueClass?: string
}

export default function StatCard({ label, value, sub, valueClass = '' }: Props) {
  return (
    <div className="card flex flex-col justify-between">
      <p className="text-muted text-xs font-mono uppercase tracking-wider">{label}</p>
      <div className="mt-2">
        <p className={`text-2xl font-mono font-semibold ${valueClass}`}>{value}</p>
        {sub && <p className="text-muted text-xs mt-1">{sub}</p>}
      </div>
    </div>
  )
}
