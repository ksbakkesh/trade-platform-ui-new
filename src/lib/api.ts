import { getAuthHeaders } from './auth'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

// Get brokerAccountId from localStorage (set after broker setup)
function getAccountId(): number {
  if (typeof window === 'undefined') return 1
  const stored = localStorage.getItem('tp_broker')
  if (stored) return parseInt(stored)
  return 1 // fallback
}

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    cache: 'no-store',
    headers: { ...getAuthHeaders() }
  })
  if (!res.ok) throw new Error(`${path} → ${res.status}`)
  return res.json()
}

async function post<T>(path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) throw new Error(`${path} → ${res.status}`)
  return res.json()
}

async function patch<T>(path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) throw new Error(`${path} → ${res.status}`)
  return res.json()
}

// ---- Types ----
export interface RiskSummary {
  tradingAllowed: boolean
  reason: string
  tradesUsedToday: number
  maxTradesPerDay: number
  remainingTrades: number
  lossUsedToday: number
  dailyLossLimit: number
  remainingLossBudget: number
}

export interface DailyPnl {
  tradeDate: string
  totalTrades: number
  totalPnl: number
  dailyLossLimitHit: boolean
  maxTradesHit: boolean
  tradingDisabled: boolean
}

export interface Signal {
  id: number
  indexName: string
  signalType: string
  openPrice: number
  buyAbove: number
  sellBelow: number
  strikePrice: number
  tradingSymbol: string
  premiumAtSignal: number
  rsiValue: number
  volumeRatio: number
  deltaValue: number
  status: string
  rejectionReason: string | null
  generatedAt: string
}

export interface Trade {
  id: number
  indexName: string
  tradingSymbol: string
  transactionType: string
  quantity: number
  entryPrice: number
  stopLossPrice: number
  target1Price: number
  target2Price: number
  exitPrice: number | null
  brokerOrderId: string | null
  status: string
  exitReason: string | null
  realizedPnl: number | null
  reentry: boolean
  entryTime: string
  exitTime: string | null
}

export interface Position {
  positionId: number
  tradeId: number
  tradingSymbol: string
  quantityRemaining: number
  currentLtp: number | null
  currentStopLoss: number
  unrealizedPnl: number | null
  slMovedToCost: boolean
  lastUpdatedAt: string
}

export interface GannLevels {
  indexName: string
  openPrice: number
  buyAbove: number
  sellBelow: number
  ceStrike: number
  peStrike: number
  spotStopLoss: number
  exitStrategyMode: string
}

export interface StrategySettings {
  id: number
  brokerAccountId: number
  indexName: string
  openPriceMode: string
  premiumThreshold: number
  rsiThreshold: number
  volumeMultiplier: number
  deltaMin: number
  deltaMax: number
  stopLossPoints: number
  target1Points: number
  target2Points: number
  exitStrategyMode: string
  reEntryEnabled: boolean
  quantityMode: string
  capitalAllocationPercent: number | null
  maxLots: number | null
  autoTradingEnabled: boolean
}

// ---- API calls ----
export const api = {
  // Dashboard — uses logged-in user's broker account
  riskSummary:      () => get<RiskSummary>(`/api/dashboard/risk/summary?accountId=${getAccountId()}`),
  dailyPnl:         () => get<DailyPnl>(`/api/dashboard/risk/daily-pnl?accountId=${getAccountId()}`),
  todaySignals:     () => get<Signal[]>(`/api/dashboard/signals/today?accountId=${getAccountId()}`),
  todayTrades:      () => get<Trade[]>(`/api/dashboard/trades/today?accountId=${getAccountId()}`),
  openTrades:       () => get<Trade[]>(`/api/dashboard/trades/open?accountId=${getAccountId()}`),
  positions:        () => get<Position[]>(`/api/dashboard/positions?accountId=${getAccountId()}`),
  gannLevels:       (index: string, openPrice: number) =>
    get<GannLevels>(`/api/dashboard/market/levels?accountId=${getAccountId()}&index=${index}&liveOpenPrice=${openPrice}`),
  strategySettings: (index: string) =>
    get<StrategySettings>(`/api/admin/strategy-settings/account/${getAccountId()}/index/${index}`),
  toggleAutoTrading: (settingsId: number, enabled: boolean) =>
    patch<StrategySettings>(`/api/admin/strategy-settings/${settingsId}/auto-trading?enabled=${enabled}`),

  // Angel One — test endpoints (no auth needed)
  login: () => post<{ status: string }>('/api/test/angelone/login'),
}

// Call this after broker setup to store the accountId
export function saveBrokerAccountId(id: number) {
  localStorage.setItem('tp_broker', String(id))
}
