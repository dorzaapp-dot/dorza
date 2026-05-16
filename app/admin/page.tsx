'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Session } from '@supabase/supabase-js'

const ADMIN_EMAIL = 'dorza.app@gmail.com'

type Submission = {
  id: string
  created_at: string
  email: string
  business_name: string | null
  owner_name: string | null
  status: 'pending' | 'provisioned'
}

type Phase = 'loading' | 'unauthenticated' | 'unauthorized' | 'ready'

export default function AdminPage() {
  const [phase, setPhase] = useState<Phase>('loading')
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [creating, setCreating] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState<string | null>(null)
  const [signingIn, setSigningIn] = useState(false)

  useEffect(() => {
    async function handleSession(session: Session | null) {
      if (!session) {
        setPhase('unauthenticated')
        return
      }
      if (session.user.email !== ADMIN_EMAIL) {
        setPhase('unauthorized')
        return
      }
      const { data: { session: activeSession } } = await supabase.auth.getSession()
      console.log('[admin] active session email →', activeSession?.user.email)
      const { data, error, status } = await supabase
        .from('onboard_submissions')
        .select('id, created_at, email, business_name, owner_name, status')
        .order('created_at', { ascending: false })
      console.log('[admin] submissions query →', { status, count: data?.length, data, error })
      if (data) setSubmissions(data as Submission[])
      setPhase('ready')
    }

    supabase.auth.getSession().then(({ data: { session } }) => handleSession(session))

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      handleSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  async function signIn() {
    setSigningIn(true)
    setLoginError(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setLoginError(error.message)
    setSigningIn(false)
  }

  async function createUser(submissionId: string) {
    setCreating(submissionId)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const res = await fetch(process.env.NEXT_PUBLIC_CREATE_CLIENT_USER_URL!, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session!.access_token}`,
        },
        body: JSON.stringify({ submissionId }),
      })
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      setSubmissions(prev =>
        prev.map(s => s.id === submissionId ? { ...s, status: 'provisioned' as const } : s)
      )
      showToast('Invitation sent!')
    } catch (err) {
      showToast(`Error: ${String(err)}`)
    } finally {
      setCreating(null)
    }
  }

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 4000)
  }

  async function signOut() {
    await supabase.auth.signOut()
  }

  if (phase === 'loading') {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <p className="font-body text-sm text-text-muted">Loading…</p>
      </div>
    )
  }

  if (phase === 'unauthorized') {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <p className="font-body text-text-secondary mb-4">Not authorized.</p>
          <button onClick={signOut} className="text-sm text-primary underline">Sign out</button>
        </div>
      </div>
    )
  }

  if (phase === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center px-5">
        <div className="bg-white border border-border rounded-card p-8 w-full max-w-sm shadow-soft">
          <h1 className="font-display text-2xl text-dark mb-1">Dorza Admin</h1>
          <p className="font-body text-sm text-text-secondary mb-6">Sign in to manage submissions.</p>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full h-12 px-4 rounded-sm border border-border text-dark font-body text-sm focus:outline-none focus:border-primary mb-3"
          />
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && signIn()}
            placeholder="Password"
            className="w-full h-12 px-4 rounded-sm border border-border text-dark font-body text-sm focus:outline-none focus:border-primary mb-3"
          />
          {loginError && (
            <p className="font-body text-xs text-red-500 mb-3">{loginError}</p>
          )}
          <button
            onClick={signIn}
            disabled={!email || !password || signingIn}
            className="w-full h-12 bg-primary hover:bg-primary-dark text-white font-semibold text-sm rounded-full transition-all duration-300 hover:-translate-y-px hover:shadow-medium disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-y-0"
          >
            {signingIn ? 'Signing in…' : 'Sign in'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface">
      <div className="bg-dark px-5 py-4 flex items-center justify-between">
        <span className="font-display text-xl text-white">Dorza Admin</span>
        <button
          onClick={signOut}
          className="text-sm text-white/60 hover:text-white transition-colors font-body"
        >
          Sign out
        </button>
      </div>

      <div className="max-w-layout mx-auto px-5 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl text-dark">Submissions</h2>
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">
            {submissions.length} total
          </span>
        </div>

        {submissions.length === 0 ? (
          <div className="bg-white border border-border rounded-card p-10 text-center">
            <p className="font-body text-sm text-text-muted">No submissions yet.</p>
          </div>
        ) : (
          <div className="bg-white border border-border rounded-card overflow-hidden shadow-soft">
            <div className="overflow-x-auto">
              <table className="w-full text-sm font-body">
                <thead>
                  <tr className="border-b border-border bg-surface">
                    {['Business', 'Owner', 'Email', 'Status', 'Date', ''].map(h => (
                      <th key={h} className="text-left px-5 py-3 text-text-muted font-semibold text-xs uppercase tracking-wider whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((s, i) => (
                    <tr
                      key={s.id}
                      className={`border-b border-border last:border-0 ${i % 2 === 1 ? 'bg-surface/40' : ''}`}
                    >
                      <td className="px-5 py-4 font-semibold text-dark whitespace-nowrap">
                        {s.business_name || '—'}
                      </td>
                      <td className="px-5 py-4 text-text-secondary whitespace-nowrap">
                        {s.owner_name || '—'}
                      </td>
                      <td className="px-5 py-4 text-text-secondary">{s.email}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${
                          s.status === 'provisioned'
                            ? 'bg-accent-tint text-accent-dark'
                            : 'bg-primary-tint text-primary-dark'
                        }`}>
                          {s.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-text-muted whitespace-nowrap">
                        {new Date(s.created_at).toLocaleDateString('en-AU', {
                          day: 'numeric', month: 'short', year: 'numeric',
                        })}
                      </td>
                      <td className="px-5 py-4 text-right">
                        {s.status === 'pending' ? (
                          <button
                            onClick={() => createUser(s.id)}
                            disabled={creating === s.id}
                            className="h-8 px-4 bg-primary hover:bg-primary-dark text-white text-xs font-semibold rounded-full transition-all duration-300 hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0 whitespace-nowrap"
                          >
                            {creating === s.id ? 'Creating…' : 'Create User'}
                          </button>
                        ) : (
                          <span className="text-xs text-text-muted">Provisioned</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-dark text-white text-sm font-body px-5 py-3 rounded-full shadow-card whitespace-nowrap">
          {toast}
        </div>
      )}
    </div>
  )
}
