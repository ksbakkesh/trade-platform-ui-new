'use client'
import { useEffect, useState } from 'react'
import { Bell, Settings, RefreshCw, User, Menu } from 'lucide-react'

interface Quote { ltp: number | null; change?: number; changePct?: number }

export default function TopBar({ onMenuClick }: { onMenuClick?: () => void }) {
  const [time, setTime] = useState('')
  const [nifty, setNifty] = useState<Quote>({ ltp: null })
  const [sensex, setSensex] = useState<Quote>({ ltp: null })
  const [autoTrading, setAutoTrading] = useState(true)
  const [marketOpen, setMarketOpen] = useState(false)

  useEffect(() => {
    const tick = () => {
      const now = new Date()
      setTime(now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }))
      const h = now.getHours(), m = now.getMinutes()
      setMarketOpen((h > 9 || (h === 9 && m >= 15)) && (h < 15 || (h === 15 && m <= 30)))
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  const fetchQuotes = async () => {
    try {
      const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
      const n = await fetch(`${API}/api/test/angelone/quote?exchange=NSE&token=99926000&mode=LTP`).then(r => r.json())
      if (n.fetched?.[0]) setNifty({ ltp: n.fetched[0].ltp })
    } catch {}
  }

  useEffect(() => { fetchQuotes() }, [])

  const toggleAutoTrading = async () => {
    const next = !autoTrading
    setAutoTrading(next)
    try {
      const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
      await fetch(`${API}/api/admin/strategy-settings/1/auto-trading?enabled=${next}`, { method: 'PATCH' })
    } catch {}
  }

  return (
    <header className="h-14 flex items-center px-3 gap-2 border-b border-white/5 bg-surface shrink-0 z-10 overflow-hidden min-w-0">
      {/* Hamburger — mobile only */}
      <button
        onClick={onMenuClick}
        className="p-2 rounded-lg text-muted hover:text-data hover:bg-surface-2 transition-colors lg:hidden shrink-0"
      >
        <Menu size={18} />
      </button>

      {/* Logo */}
      <div className="flex items-center gap-2 shrink-0">
        <div className="w-7 h-7 rounded-lg bg-accent/20 flex items-center justify-center">
          <span className="text-accent text-xs font-mono font-bold">AT</span>
        </div>
        <div className="hidden md:block">
          <p className="text-data text-xs font-semibold leading-none">Options Auto Trader</p>
          <p className="text-muted text-[10px]">NIFTY & SENSEX</p>
        </div>
      </div>

      {/* Market status */}
      <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-surface-2 shrink-0">
        <span className={`w-1.5 h-1.5 rounded-full ${marketOpen ? 'bg-accent animate-pulse' : 'bg-loss'}`} />
        <span className={`text-xs font-medium hidden sm:block ${marketOpen ? 'text-accent' : 'text-loss'}`}>
          {marketOpen ? 'Market Open' : 'Market Closed'}
        </span>
        <span className="text-muted text-xs font-mono">{time}</span>
      </div>

      {/* NIFTY */}
      <div className="px-2 py-1 rounded-lg bg-surface-2 shrink-0">
        <p className="text-muted text-[9px] hidden sm:block">NIFTY 50</p>
        <p className="text-data font-mono font-semibold text-xs">
          {nifty.ltp ? nifty.ltp.toLocaleString('en-IN', { minimumFractionDigits: 2 }) : '—'}
        </p>
      </div>

      {/* SENSEX */}
      <div className="px-2 py-1 rounded-lg bg-surface-2 shrink-0 hidden sm:block">
        <p className="text-muted text-[9px]">SENSEX</p>
        <p className="text-data font-mono font-semibold text-xs">
          {sensex.ltp ? sensex.ltp.toLocaleString('en-IN', { minimumFractionDigits: 2 }) : '—'}
        </p>
      </div>

      <button onClick={fetchQuotes} className="p-1.5 rounded-lg text-muted hover:text-data hover:bg-surface-2 transition-colors shrink-0">
        <RefreshCw size={13} />
      </button>

      <div className="ml-auto flex items-center gap-2 shrink-0">
        {/* Auto Trading toggle */}
        <div className="flex items-center gap-1.5">
          <span className="text-muted text-xs hidden lg:block">Auto Trading</span>
          <button
            onClick={toggleAutoTrading}
            className={`relative w-9 h-5 rounded-full transition-colors ${autoTrading ? 'bg-accent' : 'bg-surface-2'}`}
          >
            <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${autoTrading ? 'translate-x-4' : ''}`} />
          </button>
          <span className={`text-xs font-mono font-semibold hidden sm:block ${autoTrading ? 'text-accent' : 'text-muted'}`}>
            {autoTrading ? 'ON' : 'OFF'}
          </span>
        </div>

        <button className="p-1.5 rounded-lg text-muted hover:text-data hover:bg-surface-2 transition-colors">
          <Bell size={14} />
        </button>
        <button className="p-1.5 rounded-lg text-muted hover:text-data hover:bg-surface-2 transition-colors hidden sm:flex">
          <Settings size={14} />
        </button>
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-surface-2">
          <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center">
            <User size={10} className="text-accent" />
          </div>
          <div className="hidden md:block">
            <p className="text-data text-[11px] font-medium leading-none">Admin</p>
            <p className="text-muted text-[9px]">Administrator</p>
          </div>
        </div>
      </div>
    </header>
  )
}
