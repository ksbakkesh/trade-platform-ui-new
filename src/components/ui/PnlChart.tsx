'use client'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'

interface Props {
  data: { time: string; pnl: number }[]
}

export default function PnlChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={160}>
      <LineChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
        <XAxis
          dataKey="time"
          tick={{ fill: '#8892A4', fontSize: 10, fontFamily: 'JetBrains Mono' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: '#8892A4', fontSize: 10, fontFamily: 'JetBrains Mono' }}
          axisLine={false}
          tickLine={false}
          tickFormatter={v => `₹${v}`}
          width={50}
        />
        <Tooltip
          contentStyle={{
            background: '#1C2333',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '8px',
            fontSize: '12px',
            fontFamily: 'JetBrains Mono',
            color: '#E8ECF4'
          }}
          formatter={(v: number) => [`₹${v.toLocaleString('en-IN')}`, 'P&L']}
        />
        <ReferenceLine y={0} stroke="rgba(255,255,255,0.1)" strokeDasharray="4 4" />
        <Line
          type="monotone"
          dataKey="pnl"
          stroke="#00D4AA"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, fill: '#00D4AA' }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
