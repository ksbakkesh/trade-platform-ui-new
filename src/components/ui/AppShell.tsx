'use client'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Sidebar from './Sidebar'
import TopBar from './TopBar'

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const path = usePathname()

  // Login page has its own layout — no shell
  if (path === '/login') return <>{children}</>

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-bg">
      <TopBar onMenuClick={() => setSidebarOpen(o => !o)} />
      <div className="flex flex-1 overflow-hidden min-w-0 relative">
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        {/* Sidebar */}
        <div className={`
          fixed lg:static inset-y-0 left-0 z-30
          transform transition-transform duration-200 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          top-14 lg:top-0
        `}>
          <Sidebar onClose={() => setSidebarOpen(false)} />
        </div>
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 bg-bg min-w-0">
          {children}
        </main>
      </div>
    </div>
  )
}
