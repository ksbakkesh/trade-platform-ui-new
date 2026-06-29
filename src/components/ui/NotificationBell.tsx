'use client'
import { useState, useEffect, useRef } from 'react'
import { Bell, X, Check, Trash2 } from 'lucide-react'
import { getAuthHeaders } from '@/lib/auth'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

interface Notification {
  id: number
  title: string
  message: string
  type: string
  isRead: boolean
  createdAt: string
}

const TYPE_COLORS: Record<string, string> = {
  TRADE_PLACED:     'text-accent',
  TARGET1_HIT:      'text-accent',
  TARGET2_HIT:      'text-accent',
  STOP_LOSS:        'text-loss',
  REENTRY:          'text-warn',
  SQUARE_OFF:       'text-muted',
  RISK_LIMIT:       'text-warn',
  SIGNAL:           'text-accent',
  SIGNAL_REJECTED:  'text-loss',
}

export default function NotificationBell() {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

  const fetchUnreadCount = async () => {
    try {
      const res = await fetch(`${API}/api/notifications/unread-count`, { headers: getAuthHeaders() })
      if (res.ok) {
        const data = await res.json()
        setUnreadCount(data.count)
      }
    } catch {}
  }

  const fetchNotifications = async () => {
    try {
      const res = await fetch(`${API}/api/notifications`, { headers: getAuthHeaders() })
      if (res.ok) setNotifications(await res.json())
    } catch {}
  }

  const markAllRead = async () => {
    try {
      await fetch(`${API}/api/notifications/mark-all-read`, {
        method: 'POST', headers: getAuthHeaders()
      })
      setUnreadCount(0)
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
    } catch {}
  }

  const deleteNotification = async (id: number) => {
    try {
      await fetch(`${API}/api/notifications/${id}`, {
        method: 'DELETE', headers: getAuthHeaders()
      })
      setNotifications(prev => prev.filter(n => n.id !== id))
    } catch {}
  }

  // Poll unread count every 30 seconds
  useEffect(() => {
    fetchUnreadCount()
    const interval = setInterval(fetchUnreadCount, 30000)
    return () => clearInterval(interval)
  }, [])

  // Open dropdown
  const handleOpen = () => {
    setOpen(!open)
    if (!open) {
      fetchNotifications()
      if (unreadCount > 0) markAllRead()
    }
  }

  // Close on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div className="relative" ref={ref}>
      {/* Bell button */}
      <button onClick={handleOpen}
        className="relative p-2 rounded-lg hover:bg-surface-2 transition-colors">
        <Bell size={15} className="text-muted" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-loss text-bg text-[9px] font-bold flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-9 w-80 bg-surface border border-white/10 rounded-xl shadow-2xl z-50">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
            <p className="text-data text-xs font-semibold">Notifications</p>
            <div className="flex items-center gap-2">
              {notifications.length > 0 && (
                <button onClick={markAllRead}
                  className="text-muted hover:text-accent text-[10px] flex items-center gap-1">
                  <Check size={10} />Mark all read
                </button>
              )}
              <button onClick={() => setOpen(false)}
                className="text-muted hover:text-data">
                <X size={13} />
              </button>
            </div>
          </div>

          {/* Notification list */}
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="py-8 text-center">
                <Bell size={24} className="text-muted mx-auto mb-2 opacity-40" />
                <p className="text-muted text-xs">No notifications yet</p>
                <p className="text-muted text-[10px] mt-0.5">Alerts appear here when trades happen</p>
              </div>
            ) : (
              notifications.map(n => (
                <div key={n.id}
                  className={`px-4 py-3 border-b border-white/5 hover:bg-surface-2 transition-colors ${!n.isRead ? 'bg-accent/5' : ''}`}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-semibold ${TYPE_COLORS[n.type] || 'text-data'}`}>
                        {n.title}
                      </p>
                      <p className="text-muted text-[11px] mt-0.5 leading-relaxed">{n.message}</p>
                      <p className="text-muted text-[10px] mt-1 font-mono">
                        {new Date(n.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <button onClick={() => deleteNotification(n.id)}
                      className="text-muted hover:text-loss shrink-0 mt-0.5">
                      <Trash2 size={11} />
                    </button>
                  </div>
                  {!n.isRead && (
                    <div className="w-1.5 h-1.5 rounded-full bg-accent absolute left-2 mt-1" />
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-2 border-t border-white/5 text-center">
              <p className="text-muted text-[10px]">{notifications.length} notification{notifications.length !== 1 ? 's' : ''}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
