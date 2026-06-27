'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

interface User {
  userId: number
  username: string
  email: string
  role: string
  token: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // On mount, restore user from localStorage + ensure broker ID is set
  useEffect(() => {
    const stored = localStorage.getItem('tp_user')
    if (stored) {
      try {
        const u = JSON.parse(stored)
        setUser(u)
        // If broker ID missing, fetch it
        if (!localStorage.getItem('tp_broker')) {
          fetch(`${API}/api/broker/my-account`, {
            headers: { Authorization: `Bearer ${u.token}` }
          }).then(r => r.ok ? r.json() : null)
            .then(d => { if (d?.id) localStorage.setItem('tp_broker', String(d.id)) })
            .catch(() => {})
        }
      } catch {}
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    const res = await fetch(`${API}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error || 'Login failed')
    }
    const data = await res.json()
    const u: User = {
      userId: data.userId,
      username: data.username,
      email: data.email,
      role: data.role,
      token: data.token,
    }
    localStorage.setItem('tp_user', JSON.stringify(u))
    setUser(u)

    // Fetch and save broker account ID
    try {
      const brokerRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/broker/my-account`, {
        headers: { Authorization: `Bearer ${data.token}` }
      })
      if (brokerRes.ok) {
        const broker = await brokerRes.json()
        localStorage.setItem('tp_broker', String(broker.id))
      }
    } catch {}

    router.push('/')
  }

  const logout = () => {
    localStorage.removeItem('tp_user')
    localStorage.removeItem('tp_broker')
    setUser(null)
    router.push('/login')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}

// Helper to get auth headers for API calls
export function getAuthHeaders(): HeadersInit {
  if (typeof window === 'undefined') return {}
  const stored = localStorage.getItem('tp_user')
  if (!stored) return {}
  try {
    const u = JSON.parse(stored)
    return { Authorization: `Bearer ${u.token}` }
  } catch { return {} }
}
