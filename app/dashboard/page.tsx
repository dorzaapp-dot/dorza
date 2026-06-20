'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Session } from '@supabase/supabase-js'

type Booking = {
  id: string
  created_at: string
  booking_date: string
  booking_time: string
  name: string
  email: string
  phone: string | null
  message: string | null
  status: 'pending' | 'confirmed' | 'cancelled'
}

type Submission = {
  id: string
  business_name: string | null
  owner_name: string | null
}

type Phase = 'loading' | 'unauthenticated' | 'ready'
type Tab = 'upcoming' | 'past'

export default function DashboardPage() {
  const [phase, setPhase] = useState<Phase>('loading')
  const [session, setSession] = useState<Session | null>(null)
  const [submission, setSubmission] = useState<Submission | null>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [tab, setTab] = useState<Tab>('upcoming')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState<string | null>(null)
  const [signingIn, setSigningIn] = useState(false)

  useEffect(() => {
    async function handleSession(s: Session | null) {
      if (!s) {
        setPhase('unauthenticated')
        return
      }
      setSession(s)
      await loadData(s.user.id)
      setPhase('ready')
    }

    supabase.auth.getSession().then(({ data: { session: s } }) => handleSession(s))

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, s) => {
      handleSession(s)
    })

    return () => subscription.unsubscribe()
  }, [])

  async function loadData(userId: string) {
    const { data: sub } = await supabase
      .from('onboard_submissions')
      .select('id, business_name, owner_name')
      .eq('user_id', userId)
      .single()

    if (!sub) return
    setSubmission(sub as Submission)

    const { data: rows } = await supabase
      .from('bookings')
      .select('id, created_at, booking_date, booking_time, name, email, phone, message, status')
      .eq('client_id', sub.id)
      .order('booking_date', { ascending: false })

    if (rows) setBookings(rows as Booking[])
  }

  async function signIn() {
    setSigningIn(true)
    setLoginError(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setLoginError(error.message)
    setSigningIn(false)
  }

  async function updateStatus(id: string, status: Booking['status']) {
    setUpdatingId(id)
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', id)
      if (error) throw error
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b))
      showToast(`Booking ${status}`)
    } catch (err) {
      showToast(`Error: ${String(err)}`)
    } finally {
      setUpdatingId(null)
    }
  }

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 4000)
  }

  const today = new Date().toISOString().split('T')[0]
  const upcoming = bookings.filter(b => b.booking_date >= today && b.status !== 'cancelled')
  const past = bookings.filter(b => b.booking_date < today || b.status === 'cancelled')
  const displayed = tab === 'upcoming' ? upcoming : past

  if (phase === 'loading') {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <p className="font-body text-sm text-text-muted">Loading…</p>
      </div>
    )
  }

  if (phase === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center px-5">
        <div className="bg-white border border-border rounded-card p-8 w-full max-w-sm shadow-soft">
          <h1 className="font-display text-2xl text-dark mb-1">Client Dashboard</h1>
          <p className="font-body text-sm text-text-secondary mb-6">
            Sign in to view your bookings.
          </p>
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
      {/* Top bar */}
      <div className="bg-dark px-5 py-4 flex items-center justify-between">
        <span className="font-display text-xl text-white">Dorza</span>
        <button
          onClick={() => supabase.auth.signOut()}
          className="text-sm text-white/60 hover:text-white transition-colors font-body"
        >
          Sign out
        </button>
      </div>

      <div className="max-w-3xl mx-auto px-5 py-10">
        {/* Header */}
        <div className="mb-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent mb-2">Dashboard</p>
          <h1 className="font-display text-[36px] leading-tight tracking-[-0.02em] text-dark">
            {submission?.business_name ? `${submission.business_name}` : 'My Bookings'}
          </h1>
          {submission?.owner_name && (
            <p className="font-body text-text-secondary mt-2">
              Welcome back, {submission.owner_name}
            </p>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white border border-border rounded-card p-5">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-text-muted mb-1">Upcoming</p>
            <p className="font-display text-[28px] text-dark">{upcoming.length}</p>
          </div>
          <div className="bg-white border border-border rounded-card p-5">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-text-muted mb-1">Pending</p>
            <p className="font-display text-[28px] text-primary">{bookings.filter(b => b.status === 'pending').length}</p>
          </div>
          <div className="bg-white border border-border rounded-card p-5">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-text-muted mb-1">Total</p>
            <p className="font-display text-[28px] text-dark">{bookings.length}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6">
          {(['upcoming', 'past'] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-full text-sm font-semibold font-body transition-all duration-300 ${
                tab === t
                  ? 'bg-dark text-white'
                  : 'bg-white border border-border text-text-secondary hover:bg-surface'
              }`}
            >
              {t === 'upcoming' ? `Upcoming (${upcoming.length})` : `Past & Cancelled (${past.length})`}
            </button>
          ))}
        </div>

        {/* Bookings list */}
        {displayed.length === 0 ? (
          <div className="bg-white border border-border rounded-card p-10 text-center">
            <p className="font-body text-text-muted text-sm">
              {tab === 'upcoming' ? 'No upcoming bookings.' : 'No past bookings.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {displayed.map(b => {
              const expanded = expandedId === b.id
              const date = new Date(`${b.booking_date}T${b.booking_time}`)
              const formatted = date.toLocaleDateString('en-AU', {
                weekday: 'short',
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })
              const time = date.toLocaleTimeString('en-AU', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
              })

              return (
                <div
                  key={b.id}
                  className="bg-white border border-border rounded-card overflow-hidden transition-all duration-500 ease-dorza hover:shadow-medium"
                >
                  <button
                    onClick={() => setExpandedId(expanded ? null : b.id)}
                    className="w-full px-6 py-4 flex items-center gap-4 text-left"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-body font-semibold text-dark truncate">{b.name}</p>
                      <p className="font-body text-sm text-text-secondary">
                        {formatted} at {time}
                      </p>
                    </div>
                    <span className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-semibold font-body ${
                      b.status === 'confirmed'
                        ? 'bg-accent-tint text-accent-dark'
                        : b.status === 'cancelled'
                          ? 'bg-red-50 text-red-500'
                          : 'bg-primary-tint text-primary-dark'
                    }`}>
                      {b.status}
                    </span>
                    <svg
                      className={`w-4 h-4 text-text-muted transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {expanded && (
                    <div className="px-6 pb-5 border-t border-border pt-4">
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-text-muted mb-1">Email</p>
                          <p className="font-body text-sm text-dark">{b.email}</p>
                        </div>
                        {b.phone && (
                          <div>
                            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-text-muted mb-1">Phone</p>
                            <p className="font-body text-sm text-dark">
                              <a href={`tel:${b.phone}`} className="text-primary hover:underline">{b.phone}</a>
                            </p>
                          </div>
                        )}
                      </div>
                      {b.message && (
                        <div className="mb-4">
                          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-text-muted mb-1">Message</p>
                          <p className="font-body text-sm text-text-secondary">{b.message}</p>
                        </div>
                      )}
                      {b.status !== 'cancelled' && (
                        <div className="flex gap-2">
                          {b.status === 'pending' && (
                            <button
                              onClick={() => updateStatus(b.id, 'confirmed')}
                              disabled={updatingId === b.id}
                              className="h-9 px-4 bg-accent hover:bg-accent-dark text-white text-xs font-semibold font-body rounded-full transition-all duration-300 disabled:opacity-40"
                            >
                              Confirm
                            </button>
                          )}
                          <button
                            onClick={() => updateStatus(b.id, 'cancelled')}
                            disabled={updatingId === b.id}
                            className="h-9 px-4 bg-white border border-border text-text-secondary text-xs font-semibold font-body rounded-full hover:bg-surface transition-all duration-300 disabled:opacity-40"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-dark text-white text-sm font-body px-5 py-3 rounded-full shadow-card whitespace-nowrap z-50">
          {toast}
        </div>
      )}
    </div>
  )
}
