# trade-platform-ui

Next.js 14 frontend for the NIFTY & SENSEX options auto-trading platform.

## Stack
- **Next.js 14** (App Router, server components)
- **TypeScript**
- **Tailwind CSS**
- **Recharts** (charts, ready to use)
- **Lucide React** (icons)

## Pages
| Route | Description |
|-------|-------------|
| `/` | Dashboard — risk gauge, P&L, today's trades + signals |
| `/signals` | Signal monitor — generated vs rejected, all conditions |
| `/trades` | Trade log — open positions + today's history |
| `/positions` | Live positions — LTP, SL, unrealized P&L |
| `/risk` | Risk management — detailed loss meter + daily P&L |
| `/settings` | Strategy configuration — all params for NIFTY + SENSEX |

## Setup

```bash
npm install
```

Create `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8080
```

```bash
npm run dev
```

Open http://localhost:3000

## Notes
- All data is fetched from the Spring Boot backend (`trade-platform-api`)
- The backend must be running on port 8080 (or update `NEXT_PUBLIC_API_URL`)
- Account ID is hardcoded to `1` in `src/lib/api.ts` — update for multi-account support
- WebSocket live feed + Redis (real-time LTP updates) is deferred to a future sprint
  — currently uses server-side fetching with `force-dynamic` (no stale cache)
