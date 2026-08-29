'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

type ContactMessage = {
  id: string
  created_at: string
  source: string
  name: string
  email: string
  phone: string | null
  message: string | null
}

type Submission = {
  id: string
  business_name: string | null
  owner_name: string | null
}

type Phase = 'loading' | 'unauthenticated' | 'ready'

export default function MessagesPage() {
  const [phase, setPhase] = useState<Phase>('loading')
  const [submission, setSubmission] = useState<Submission | null>(null)
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    async function handleSession(s: { user: { id: string } } | null) {
      if (!s) {
        setPhase('unauthenticated')
        return
      }
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
      .from('contact_messages')
      .select('id, created_at, source, name, email, phone, message')
      .eq('client_id', sub.id)
      .order('created_at', { ascending: false })

    if (rows) setMessages(rows as ContactMessage[])
  }

  if (phase === 'loading') {
    return (
      <div className="flex items-center justify-center py-32">
        <p className="font-body text-sm text-text-muted">Loading…</p>
      </div>
    )
  }

  if (phase === 'unauthenticated') {
    return (
      <div className="flex items-center justify-center py-32">
        <p className="font-body text-sm text-text-muted">Please sign in to view messages.</p>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent mb-2">Messages</p>
        <h1 className="font-display text-[36px] leading-tight tracking-[-0.02em] text-dark">
          Contact Messages
        </h1>
        {submission?.owner_name && (
          <p className="font-body text-text-secondary mt-2">
            Messages from your website visitors
          </p>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white border border-border rounded-card p-5">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-text-muted mb-1">Total</p>
          <p className="font-display text-[28px] text-dark">{messages.length}</p>
        </div>
        <div className="bg-white border border-border rounded-card p-5">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-text-muted mb-1">This month</p>
          <p className="font-display text-[28px] text-primary">
            {messages.filter(m => {
              const d = new Date(m.created_at)
              const now = new Date()
              return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
            }).length}
          </p>
        </div>
      </div>

      {/* Messages list */}
      {messages.length === 0 ? (
        <div className="bg-white border border-border rounded-card p-10 text-center">
          <p className="font-body text-text-muted text-sm">No messages yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map(m => {
            const expanded = expandedId === m.id
            const date = new Date(m.created_at)
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
                key={m.id}
                className="bg-white border border-border rounded-card overflow-hidden transition-all duration-500 ease-dorza hover:shadow-medium"
              >
                <button
                  onClick={() => setExpandedId(expanded ? null : m.id)}
                  className="w-full px-6 py-4 flex items-center gap-4 text-left"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-body font-semibold text-dark truncate">{m.name}</p>
                    <p className="font-body text-sm text-text-secondary">
                      {formatted} at {time}
                    </p>
                  </div>
                  <span className="flex-shrink-0 px-3 py-1 rounded-full text-xs font-semibold font-body bg-surface text-text-muted">
                    {m.source}
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
                        <p className="font-body text-sm text-dark">
                          <a href={`mailto:${m.email}`} className="text-primary hover:underline">{m.email}</a>
                        </p>
                      </div>
                      {m.phone && (
                        <div>
                          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-text-muted mb-1">Phone</p>
                          <p className="font-body text-sm text-dark">
                            <a href={`tel:${m.phone}`} className="text-primary hover:underline">{m.phone}</a>
                          </p>
                        </div>
                      )}
                    </div>
                    {m.message && (
                      <div>
                        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-text-muted mb-1">Message</p>
                        <p className="font-body text-sm text-text-secondary whitespace-pre-wrap">{m.message}</p>
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
  )
}
