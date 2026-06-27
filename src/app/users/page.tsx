'use client'
import { useState, useEffect } from 'react'
import { getAuthHeaders } from '@/lib/auth'
import { UserPlus, Copy, Check, Eye, EyeOff, Users } from 'lucide-react'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

interface User {
  id: number
  username: string
  email: string
  role: string
  createdAt: string
}

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [deleting, setDeleting] = useState<number | null>(null)

  // Form state
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('USER')
  const [showPassword, setShowPassword] = useState(false)
  const [creating, setCreating] = useState(false)

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API}/api/admin/users`, { headers: getAuthHeaders() })
      if (res.ok) setUsers(await res.json())
    } catch {}
    finally { setLoading(false) }
  }

  useEffect(() => { fetchUsers() }, [])

  const createUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(''); setSuccess(''); setCreating(true)
    try {
      const res = await fetch(`${API}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify({ username, email, password, role })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to create user')
      setSuccess(`✓ Account created for ${username}`)
      setUsername(''); setEmail(''); setPassword(''); setRole('USER')
      setShowForm(false)
      fetchUsers()
    } catch (err: any) {
      setError(err.message)
    } finally { setCreating(false) }
  }

  const deleteUser = async (id: number, name: string) => {
    const confirmed = window.confirm(
      `⚠️ Delete "${name}"?\n\nThis cannot be undone. The user will immediately lose access.`
    )
    if (!confirmed) return
    setDeleting(id)
    try {
      const res = await fetch(`${API}/api/auth/users/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to delete user')
      setSuccess(`✓ ${name} has been deleted`)
      fetchUsers()
    } catch (err: any) {
      setError(err.message)
    } finally { setDeleting(null) }
  }

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  const generatePassword = () => {
    const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789'
    const pwd = Array.from({ length: 10 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
    setPassword(pwd)
    setShowPassword(true)
  }

  return (
    <div className="space-y-4 pb-6 max-w-3xl">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-data text-base font-semibold">User Management</h1>
          <p className="text-muted text-xs mt-0.5">Add and manage platform users</p>
        </div>
        <button
          onClick={() => { setShowForm(v => !v); setError(''); setSuccess('') }}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-accent text-bg text-xs font-semibold hover:bg-accent/90 transition-colors"
        >
          <UserPlus size={14} />
          Add User
        </button>
      </div>

      {/* Alerts */}
      {success && (
        <div className="p-3 rounded-lg bg-accent/10 border border-accent/20">
          <p className="text-accent text-xs">{success}</p>
        </div>
      )}
      {error && (
        <div className="p-3 rounded-lg bg-loss/10 border border-loss/20">
          <p className="text-loss text-xs">{error}</p>
        </div>
      )}

      {/* Add User Form */}
      {showForm && (
        <div className="card border border-accent/20">
          <h2 className="text-data text-sm font-semibold mb-4">New User Account</h2>
          <form onSubmit={createUser} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-muted text-xs block mb-1">Full Name</label>
                <input type="text" value={username} onChange={e => setUsername(e.target.value)}
                  placeholder="e.g. Rahul Sharma" required
                  className="w-full bg-surface-2 border border-white/10 rounded-lg px-3 py-2 text-data text-sm focus:outline-none focus:border-accent/50" />
              </div>
              <div>
                <label className="text-muted text-xs block mb-1">Email Address</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="rahul@gmail.com" required
                  className="w-full bg-surface-2 border border-white/10 rounded-lg px-3 py-2 text-data text-sm focus:outline-none focus:border-accent/50" />
              </div>
              <div>
                <label className="text-muted text-xs block mb-1">Password</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input type={showPassword ? 'text' : 'password'} value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Min 6 characters" required minLength={6}
                      className="w-full bg-surface-2 border border-white/10 rounded-lg px-3 py-2 pr-8 text-data text-sm focus:outline-none focus:border-accent/50" />
                    <button type="button" onClick={() => setShowPassword(v => !v)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-muted hover:text-data">
                      {showPassword ? <EyeOff size={13} /> : <Eye size={13} />}
                    </button>
                  </div>
                  <button type="button" onClick={generatePassword}
                    className="px-3 py-2 rounded-lg bg-surface-2 border border-white/10 text-xs text-muted hover:text-data transition-colors whitespace-nowrap">
                    Generate
                  </button>
                </div>
              </div>
              <div>
                <label className="text-muted text-xs block mb-1">Role</label>
                <select value={role} onChange={e => setRole(e.target.value)}
                  className="w-full bg-surface-2 border border-white/10 rounded-lg px-3 py-2 text-data text-sm focus:outline-none focus:border-accent/50">
                  <option value="USER">USER — Trading access</option>
                  <option value="ADMIN">ADMIN — Full access</option>
                </select>
              </div>
            </div>

            {/* Credentials preview */}
            {email && password && (
              <div className="p-3 rounded-lg bg-surface-2 border border-white/10">
                <p className="text-muted text-[10px] mb-2 uppercase tracking-wider">Credentials to share</p>
                <div className="space-y-1.5 font-mono text-xs">
                  {[
                    { label: 'Email', value: email, key: 'email' },
                    { label: 'Password', value: showPassword ? password : '••••••••', copyVal: password, key: 'pwd' },
                    { label: 'Login URL', value: 'localhost:3000/login', copyVal: 'http://localhost:3000/login', key: 'url' },
                  ].map(({ label, value, copyVal, key }) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-muted">{label}:</span>
                      <div className="flex items-center gap-2">
                        <span className="text-data">{value}</span>
                        <button type="button" onClick={() => copyToClipboard(copyVal || value, key)}
                          className="text-muted hover:text-accent transition-colors">
                          {copied === key ? <Check size={12} className="text-accent" /> : <Copy size={12} />}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2 pt-1">
              <button type="submit" disabled={creating}
                className="flex-1 py-2 rounded-lg bg-accent text-bg text-sm font-semibold hover:bg-accent/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                {creating ? <><span className="w-3 h-3 border-2 border-bg/30 border-t-bg rounded-full animate-spin" />Creating...</> : 'Create Account'}
              </button>
              <button type="button" onClick={() => setShowForm(false)}
                className="px-4 py-2 rounded-lg bg-surface-2 text-muted text-sm hover:text-data transition-colors">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Users List */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-data text-sm font-semibold">All Users</h2>
          <span className="badge badge-muted">{users.length} users</span>
        </div>
        {loading ? (
          <div className="text-center py-8">
            <div className="w-6 h-6 border-2 border-accent/30 border-t-accent rounded-full animate-spin mx-auto" />
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-8">
            <Users size={32} className="text-muted mx-auto mb-2 opacity-50" />
            <p className="text-muted text-sm">No users yet</p>
            <p className="text-muted text-xs mt-1">Click &quot;Add User&quot; to create the first account</p>
          </div>
        ) : (
          <div className="space-y-2">
            {users.map(u => (
              <div key={u.id} className="flex items-center justify-between p-3 rounded-lg bg-surface-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                    <span className="text-accent text-xs font-bold">{u.username.charAt(0).toUpperCase()}</span>
                  </div>
                  <div>
                    <p className="text-data text-sm font-medium">{u.username}</p>
                    <p className="text-muted text-xs">{u.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`badge ${u.role === 'ADMIN' ? 'badge-amber' : 'badge-green'}`}>{u.role}</span>
                  {u.createdAt && (
                    <span className="text-muted text-[10px] hidden sm:block">
                      {new Date(u.createdAt).toLocaleDateString('en-IN')}
                    </span>
                  )}
                  <button
                    onClick={() => deleteUser(u.id, u.username)}
                    disabled={deleting === u.id}
                    className="p-1.5 rounded-lg text-muted hover:text-loss hover:bg-loss/10 transition-colors disabled:opacity-50"
                    title="Delete user"
                  >
                    {deleting === u.id ? (
                      <span className="w-3.5 h-3.5 border-2 border-loss/30 border-t-loss rounded-full animate-spin block" />
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                        <path d="M10 11v6"/><path d="M14 11v6"/>
                        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3 rounded-lg bg-surface-2 border border-white/5">
        <p className="text-muted text-xs leading-relaxed">
          <span className="text-data font-medium">How it works: </span>
          Create an account → share email, password and login URL with your client →
          they sign in → they see only their own trades and positions.
        </p>
      </div>
    </div>
  )
}
