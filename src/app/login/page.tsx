'use client'
import { useState } from 'react'
import { useAuth } from '@/lib/auth'
import { Eye, EyeOff, TrendingUp } from 'lucide-react'

export default function LoginPage() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-accent/20 flex items-center justify-center mb-4">
            <TrendingUp size={28} className="text-accent" />
          </div>
          <h1 className="text-data text-xl font-bold">Options Auto Trader</h1>
          <p className="text-muted text-sm mt-1">NIFTY & SENSEX · Powered by Angel One</p>
        </div>

        {/* Card */}
        <div className="card">
          <h2 className="text-data text-base font-semibold mb-1">Welcome back</h2>
          <p className="text-muted text-xs mb-5">Sign in to your trading account</p>

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-loss/10 border border-loss/20">
              <p className="text-loss text-xs">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="text-muted text-xs block mb-1.5">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="email"
                className="w-full bg-surface-2 border border-white/10 rounded-lg px-3 py-2.5 text-data text-sm focus:outline-none focus:border-accent/50 placeholder:text-muted/50"
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-muted text-xs block mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className="w-full bg-surface-2 border border-white/10 rounded-lg px-3 py-2.5 pr-10 text-data text-sm focus:outline-none focus:border-accent/50 placeholder:text-muted/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-data transition-colors"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !email || !password}
              className="w-full py-2.5 rounded-lg bg-accent text-bg text-sm font-semibold hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-bg/30 border-t-bg rounded-full animate-spin" />
                  Signing in...
                </>
              ) : 'Sign In'}
            </button>
          </form>
        </div>

        <p className="text-muted text-xs text-center mt-6">
          Contact your administrator to get access.
        </p>
      </div>
    </div>
  )
}
