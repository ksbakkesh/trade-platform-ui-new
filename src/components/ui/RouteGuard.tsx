'use client'
import { useAuth } from '@/lib/auth'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'

// Pages only ADMIN can access
const ADMIN_ONLY_ROUTES = ['/users', '/config', '/logs', '/reports']

export default function RouteGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const path = usePathname()

  useEffect(() => {
    if (loading) return
    if (!user && path !== '/login') {
      router.push('/login')
      return
    }
    if (user && path === '/login') {
      router.push('/')
      return
    }
    // Block non-admin users from admin-only routes
    const isAdmin = user?.role === 'ADMIN' || user?.role === 'ROLE_ADMIN'
    if (user && !isAdmin && ADMIN_ONLY_ROUTES.includes(path)) {
      router.push('/')
    }
  }, [user, loading, path, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
          <p className="text-muted text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user && path !== '/login') return null
  return <>{children}</>
}
