import type { Metadata } from 'next'
import './globals.css'
import AppShell from '@/components/ui/AppShell'
import { AuthProvider } from '@/lib/auth'
import RouteGuard from '@/components/ui/RouteGuard'

export const metadata: Metadata = {
  title: 'Options Auto Trader',
  description: 'NIFTY & SENSEX Options Auto Trading',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-bg">
        <AuthProvider>
          <RouteGuard>
            <AppShell>{children}</AppShell>
          </RouteGuard>
        </AuthProvider>
      </body>
    </html>
  )
}
