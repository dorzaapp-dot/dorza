'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

type Phase = 'loading' | 'ready' | 'success' | 'request' | 'request_sent'

export default function ResetPasswordPage() {
  const [phase, setPhase] = useState<Phase>('loading')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [requestEmail, setRequestEmail] = useState('')
  const [requesting, setRequesting] = useState(false)

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setPhase('ready')
      }
    })

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        setPhase('request')
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function handleReset() {
    setError(null)

    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }

    setSaving(true)
    const { error: updateError } = await supabase.auth.updateUser({ password })
    setSaving(false)

    if (updateError) {
      setError(updateError.message)
      return
    }

    setPhase('success')
  }

  async function handleRequest() {
    setError(null)
    if (!requestEmail) return

    setRequesting(true)
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(requestEmail, {
      redirectTo: `${window.location.origin}/dashboard/reset-password`,
    })
    setRequesting(false)

    if (resetError) {
      setError(resetError.message)
      return
    }

    setPhase('request_sent')
  }

  if (phase === 'loading') {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <p className="font-body text-sm text-text-muted">Loading…</p>
      </div>
    )
  }

  if (phase === 'success') {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center px-5">
        <div className="bg-white border border-border rounded-card p-8 w-full max-w-sm shadow-soft text-center">
          <div className="w-12 h-12 rounded-full bg-accent-tint flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="font-display text-2xl text-dark mb-2">Password updated</h1>
          <p className="font-body text-sm text-text-secondary mb-6">
            Your password has been changed. You can now sign in with your new password.
          </p>
          <Link
            href="/dashboard"
            className="inline-block h-12 leading-[3rem] px-8 bg-primary hover:bg-primary-dark text-white font-semibold text-sm rounded-full transition-all duration-300 hover:-translate-y-px hover:shadow-medium"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  if (phase === 'request' || phase === 'request_sent') {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center px-5">
        <div className="bg-white border border-border rounded-card p-8 w-full max-w-sm shadow-soft">
          <h1 className="font-display text-2xl text-dark mb-1">Reset your password</h1>
          <p className="font-body text-sm text-text-secondary mb-6">
            Enter your email and we&apos;ll send you a reset link.
          </p>
          {phase === 'request_sent' ? (
            <div className="text-center py-4">
              <p className="font-body text-sm text-accent font-semibold mb-2">Check your email</p>
              <p className="font-body text-sm text-text-secondary">
                We sent a password reset link to <strong>{requestEmail}</strong>.
              </p>
            </div>
          ) : (
            <>
              <input
                type="email"
                value={requestEmail}
                onChange={e => setRequestEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleRequest()}
                placeholder="your@email.com"
                className="w-full h-12 px-4 rounded-sm border border-border text-dark font-body text-sm focus:outline-none focus:border-primary mb-3"
              />
              {error && (
                <p className="font-body text-xs text-red-500 mb-3">{error}</p>
              )}
              <button
                onClick={handleRequest}
                disabled={!requestEmail || requesting}
                className="w-full h-12 bg-primary hover:bg-primary-dark text-white font-semibold text-sm rounded-full transition-all duration-300 hover:-translate-y-px hover:shadow-medium disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-y-0"
              >
                {requesting ? 'Sending…' : 'Send reset link'}
              </button>
            </>
          )}
          <p className="text-center mt-4">
            <Link href="/dashboard" className="font-body text-sm text-primary hover:underline">
              Back to sign in
            </Link>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-5">
      <div className="bg-white border border-border rounded-card p-8 w-full max-w-sm shadow-soft">
        <h1 className="font-display text-2xl text-dark mb-1">Set new password</h1>
        <p className="font-body text-sm text-text-secondary mb-6">
          Enter your new password below.
        </p>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="New password"
          className="w-full h-12 px-4 rounded-sm border border-border text-dark font-body text-sm focus:outline-none focus:border-primary mb-3"
        />
        <input
          type="password"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleReset()}
          placeholder="Confirm password"
          className="w-full h-12 px-4 rounded-sm border border-border text-dark font-body text-sm focus:outline-none focus:border-primary mb-3"
        />
        {error && (
          <p className="font-body text-xs text-red-500 mb-3">{error}</p>
        )}
        <button
          onClick={handleReset}
          disabled={!password || !confirm || saving}
          className="w-full h-12 bg-primary hover:bg-primary-dark text-white font-semibold text-sm rounded-full transition-all duration-300 hover:-translate-y-px hover:shadow-medium disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-y-0"
        >
          {saving ? 'Updating…' : 'Update password'}
        </button>
      </div>
    </div>
  )
}
