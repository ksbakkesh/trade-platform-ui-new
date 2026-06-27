'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import {
  LayoutDashboard, TrendingUp, Activity, ClipboardList,
  Settings, Shield, BarChart2, Wallet, History,
  FileText, Users, LogOut, Sliders, BookOpen
} from 'lucide-react'

const nav = [
  { href: '/',          label: 'Dashboard',         icon: LayoutDashboard, adminOnly: false },
  { href: '/market',    label: 'Market Overview',   icon: TrendingUp,      adminOnly: false },
  { href: '/signals',   label: 'Live Signals',      icon: Activity,        adminOnly: false },
  { href: '/positions', label: 'Positions',         icon: BarChart2,       adminOnly: false },
  { href: '/trades',    label: 'Trade History',     icon: History,         adminOnly: false },
  { href: '/orders',    label: 'Orders',            icon: ClipboardList,   adminOnly: false },
  { href: '/risk',      label: 'Risk Management',   icon: Shield,          adminOnly: false },
  { href: '/funds',     label: 'Funds & Margin',    icon: Wallet,          adminOnly: false },
  { href: '/broker',    label: 'Broker Setup',      icon: Wallet,          adminOnly: false },
  { href: '/settings',  label: 'Strategy Settings', icon: Sliders,         adminOnly: false },
  { href: '/config',    label: 'Configuration',     icon: Settings,        adminOnly: true  },
  { href: '/logs',      label: 'Logs',              icon: BookOpen,        adminOnly: true  },
  { href: '/reports',   label: 'Reports',           icon: FileText,        adminOnly: true  },
  { href: '/users',     label: 'User Management',   icon: Users,           adminOnly: true  },
]

export default function Sidebar({ onClose }: { onClose?: () => void }) {
  const path = usePathname()
  const { logout, user } = useAuth()
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'ROLE_ADMIN'

  return (
    <aside className="w-52 h-full flex flex-col border-r border-white/5 bg-surface overflow-y-auto">
      <nav className="flex-1 p-2 space-y-0.5">
        {nav.filter(item => !item.adminOnly || isAdmin).map(({ href, label, icon: Icon }) => {
          const active = path === href
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-colors ${
                active
                  ? 'bg-accent/10 text-accent border-l-2 border-accent'
                  : 'text-muted hover:text-data hover:bg-surface-2 border-l-2 border-transparent'
              }`}
            >
              <Icon size={14} strokeWidth={active ? 2 : 1.5} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* User + Logout */}
      <div className="p-2 border-t border-white/5 space-y-1">
        {user && (
          <div className="px-3 py-2">
            <p className="text-data text-xs font-medium truncate">{user.username}</p>
            <p className="text-muted text-[10px] truncate">{user.email}</p>
          </div>
        )}
        <button
          onClick={() => { logout(); onClose?.() }}
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-loss hover:bg-loss/10 w-full transition-colors"
        >
          <LogOut size={14} />
          Logout
        </button>
      </div>
    </aside>
  )
}
