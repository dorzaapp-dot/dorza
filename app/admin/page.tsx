'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { ADMIN_EMAIL } from '@/lib/constants'
import type { Session } from '@supabase/supabase-js'

type Submission = {
  id: string
  created_at: string
  email: string
  business_name: string | null
  owner_name: string | null
  markdown_content: string | null
  user_id: string | null
  status: 'pending' | 'provisioned'
}

type Enquiry = {
  id: string
  created_at: string
  name: string
  email: string
  business_type: string | null
  suburb: string | null
  services_interested: string[]
  message: string | null
  source: 'inline' | 'modal'
  status: 'new' | 'contacted' | 'converted' | 'archived'
}

type SubmissionAssets = {
  logoUrl: string | null
  photoUrls: string[]
}

type Phase = 'loading' | 'unauthenticated' | 'unauthorized' | 'ready'
type Tab = 'submissions' | 'enquiries'

export default function AdminPage() {
  const [phase, setPhase] = useState<Phase>('loading')
  const [tab, setTab] = useState<Tab>('enquiries')
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [enquiries, setEnquiries] = useState<Enquiry[]>([])
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [assets, setAssets] = useState<Record<string, SubmissionAssets>>({})
  const [creating, setCreating] = useState<string | null>(null)
  const [updatingEnquiry, setUpdatingEnquiry] = useState<string | null>(null)
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
      const [subs, enq] = await Promise.all([
        supabase
          .from('onboard_submissions')
          .select('id, created_at, email, business_name, owner_name, markdown_content, user_id, status')
          .order('created_at', { ascending: false }),
        supabase
          .from('enquiries')
          .select('id, created_at, name, email, business_type, suburb, services_interested, message, source, status')
          .order('created_at', { ascending: false }),
      ])
      if (subs.data) setSubmissions(subs.data as Submission[])
      if (enq.data) setEnquiries(enq.data as Enquiry[])
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

  async function loadAssets(submissionId: string, userId: string) {
    const result: SubmissionAssets = { logoUrl: null, photoUrls: [] }

    const { data: logoFiles } = await supabase.storage.from('assets').list(`${userId}/logo`)
    if (logoFiles?.length) {
      const { data } = await supabase.storage.from('assets')
        .createSignedUrl(`${userId}/logo/${logoFiles[0].name}`, 3600)
      if (data) result.logoUrl = data.signedUrl
    }

    const { data: photoFiles } = await supabase.storage.from('assets').list(`${userId}/photos`)
    if (photoFiles?.length) {
      const signed = await Promise.all(
        photoFiles.map(f =>
          supabase.storage.from('assets').createSignedUrl(`${userId}/photos/${f.name}`, 3600)
        )
      )
      result.photoUrls = signed.flatMap(r => r.data ? [r.data.signedUrl] : [])
    }

    setAssets(prev => ({ ...prev, [submissionId]: result }))
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

  async function updateEnquiryStatus(id: string, status: Enquiry['status']) {
    setUpdatingEnquiry(id)
    try {
      const { error } = await supabase.from('enquiries').update({ status }).eq('id', id)
      if (error) throw error
      setEnquiries(prev => prev.map(e => e.id === id ? { ...e, status } : e))
      showToast(`Marked ${status}`)
    } catch (err) {
      showToast(`Error: ${String(err)}`)
    } finally {
      setUpdatingEnquiry(null)
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
        <div className="flex items-end justify-between mb-6 flex-wrap gap-4">
          <div className="flex items-center gap-1 bg-white border border-border rounded-full p-1">
            {(['enquiries', 'submissions'] as const).map(t => (
              <button
                key={t}
                onClick={() => { setTab(t); setExpandedId(null) }}
                className={`relative px-4 h-9 rounded-full font-semibold text-[13px] transition-colors duration-300 ease-dorza capitalize ${
                  tab === t
                    ? 'bg-primary text-white shadow-soft'
                    : 'text-text-secondary hover:text-dark'
                }`}
              >
                {t}
                <span className={`ml-1.5 font-mono text-[11px] ${tab === t ? 'text-white/70' : 'text-text-muted'}`}>
                  {t === 'enquiries' ? enquiries.length : submissions.length}
                </span>
              </button>
            ))}
          </div>
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">
            {tab === 'enquiries'
              ? `${enquiries.filter(e => e.status === 'new').length} new`
              : `${submissions.filter(s => s.status === 'pending').length} pending`}
          </span>
        </div>

        {tab === 'submissions' ? (
          <SubmissionsTable
            submissions={submissions}
            expandedId={expandedId}
            setExpandedId={setExpandedId}
            assets={assets}
            loadAssets={loadAssets}
            creating={creating}
            createUser={createUser}
          />
        ) : (
          <EnquiriesTable
            enquiries={enquiries}
            expandedId={expandedId}
            setExpandedId={setExpandedId}
            updatingId={updatingEnquiry}
            updateStatus={updateEnquiryStatus}
          />
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

function SubmissionsTable({
  submissions, expandedId, setExpandedId, assets, loadAssets, creating, createUser,
}: {
  submissions: Submission[]
  expandedId: string | null
  setExpandedId: (id: string | null) => void
  assets: Record<string, SubmissionAssets>
  loadAssets: (submissionId: string, userId: string) => void
  creating: string | null
  createUser: (id: string) => void
}) {
  if (submissions.length === 0) {
    return (
      <div className="bg-white border border-border rounded-card p-10 text-center">
        <p className="font-body text-sm text-text-muted">No submissions yet.</p>
      </div>
    )
  }
  return (
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
            {submissions.map((s, i) => {
              const expanded = expandedId === s.id
              return (
                <>
                  <tr
                    key={s.id}
                    onClick={() => {
                      const next = expanded ? null : s.id
                      setExpandedId(next)
                      if (next && s.user_id && !assets[s.id]) loadAssets(s.id, s.user_id)
                    }}
                    className={`border-b border-border cursor-pointer select-none transition-colors hover:bg-primary-tint/30 ${expanded ? 'bg-primary-tint/20' : i % 2 === 1 ? 'bg-surface/40' : ''}`}
                  >
                    <td className="px-5 py-4 font-semibold text-dark whitespace-nowrap">
                      <span className="inline-flex items-center gap-2">
                        <span className={`text-text-muted transition-transform duration-200 text-xs ${expanded ? 'rotate-90' : ''}`}>▶</span>
                        {s.business_name || '—'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-text-secondary whitespace-nowrap">{s.owner_name || '—'}</td>
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
                      {new Date(s.created_at).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-5 py-4 text-right" onClick={e => e.stopPropagation()}>
                      <div className="inline-flex items-center gap-2">
                        <Link
                          href={`/admin/workspace?id=${s.id}`}
                          className="h-8 px-4 bg-white border border-border text-dark hover:bg-surface text-xs font-semibold rounded-full transition-all duration-300 hover:-translate-y-px inline-flex items-center whitespace-nowrap"
                        >
                          View
                        </Link>
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
                      </div>
                    </td>
                  </tr>
                  {expanded && (
                    <tr key={`${s.id}-detail`} className="border-b border-border bg-surface">
                      <td colSpan={6} className="px-5 py-5 space-y-4">
                        {s.user_id && assets[s.id] ? (
                          <div className="flex gap-4 flex-wrap items-start">
                            {assets[s.id].logoUrl ? (
                              <div>
                                <p className="font-mono text-[10px] uppercase tracking-widest text-text-muted mb-1">Logo</p>
                                <img
                                  src={assets[s.id].logoUrl!}
                                  alt="Logo"
                                  className="h-16 w-auto rounded-sm border border-border bg-white p-1 object-contain"
                                />
                              </div>
                            ) : null}
                            {assets[s.id].photoUrls.length > 0 ? (
                              <div className="flex-1">
                                <p className="font-mono text-[10px] uppercase tracking-widest text-text-muted mb-1">Photos</p>
                                <div className="flex gap-2 flex-wrap">
                                  {assets[s.id].photoUrls.map((url, i) => (
                                    <img key={i} src={url} alt={`Photo ${i + 1}`} className="h-16 w-16 rounded-sm border border-border object-cover" />
                                  ))}
                                </div>
                              </div>
                            ) : null}
                            {!assets[s.id].logoUrl && assets[s.id].photoUrls.length === 0 && (
                              <p className="font-body text-xs text-text-muted">No assets uploaded yet.</p>
                            )}
                          </div>
                        ) : s.user_id ? (
                          <p className="font-body text-xs text-text-muted">Loading assets…</p>
                        ) : null}
                        <pre className="font-mono text-xs text-text-secondary leading-relaxed whitespace-pre-wrap bg-white border border-border rounded-sm p-4 max-h-[400px] overflow-y-auto">
                          {s.markdown_content || 'No content.'}
                        </pre>
                      </td>
                    </tr>
                  )}
                </>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const STATUS_BADGE: Record<Enquiry['status'], string> = {
  new: 'bg-primary-tint text-primary-dark',
  contacted: 'bg-accent-tint text-accent-dark',
  converted: 'bg-accent text-white',
  archived: 'bg-surface text-text-muted',
}

function EnquiriesTable({
  enquiries, expandedId, setExpandedId, updatingId, updateStatus,
}: {
  enquiries: Enquiry[]
  expandedId: string | null
  setExpandedId: (id: string | null) => void
  updatingId: string | null
  updateStatus: (id: string, status: Enquiry['status']) => void
}) {
  if (enquiries.length === 0) {
    return (
      <div className="bg-white border border-border rounded-card p-10 text-center">
        <p className="font-body text-sm text-text-muted">No enquiries yet.</p>
      </div>
    )
  }
  return (
    <div className="bg-white border border-border rounded-card overflow-hidden shadow-soft">
      <div className="overflow-x-auto">
        <table className="w-full text-sm font-body">
          <thead>
            <tr className="border-b border-border bg-surface">
              {['Name', 'Email', 'Business', 'Source', 'Status', 'Date', ''].map(h => (
                <th key={h} className="text-left px-5 py-3 text-text-muted font-semibold text-xs uppercase tracking-wider whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {enquiries.map((e, i) => {
              const expanded = expandedId === e.id
              return (
                <>
                  <tr
                    key={e.id}
                    onClick={() => setExpandedId(expanded ? null : e.id)}
                    className={`border-b border-border cursor-pointer select-none transition-colors hover:bg-primary-tint/30 ${expanded ? 'bg-primary-tint/20' : i % 2 === 1 ? 'bg-surface/40' : ''}`}
                  >
                    <td className="px-5 py-4 font-semibold text-dark whitespace-nowrap">
                      <span className="inline-flex items-center gap-2">
                        <span className={`text-text-muted transition-transform duration-200 text-xs ${expanded ? 'rotate-90' : ''}`}>▶</span>
                        {e.name}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-text-secondary">
                      <a href={`mailto:${e.email}`} onClick={ev => ev.stopPropagation()} className="hover:text-primary">{e.email}</a>
                    </td>
                    <td className="px-5 py-4 text-text-secondary whitespace-nowrap">{e.business_type || '—'}</td>
                    <td className="px-5 py-4 text-text-muted whitespace-nowrap font-mono text-xs uppercase tracking-wider">{e.source}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${STATUS_BADGE[e.status]}`}>
                        {e.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-text-muted whitespace-nowrap">
                      {new Date(e.created_at).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-5 py-4 text-right whitespace-nowrap" onClick={ev => ev.stopPropagation()}>
                      <EnquiryActions enquiry={e} updating={updatingId === e.id} update={updateStatus} />
                    </td>
                  </tr>
                  {expanded && (
                    <tr key={`${e.id}-detail`} className="border-b border-border bg-surface">
                      <td colSpan={7} className="px-5 py-5">
                        <div className="grid sm:grid-cols-2 gap-5">
                          <div>
                            <p className="font-mono text-[10px] uppercase tracking-widest text-text-muted mb-2">Suburb</p>
                            <p className="font-body text-sm text-dark">{e.suburb || '—'}</p>
                          </div>
                          <div>
                            <p className="font-mono text-[10px] uppercase tracking-widest text-text-muted mb-2">Services of interest</p>
                            {e.services_interested.length === 0 ? (
                              <p className="font-body text-sm text-text-muted">None selected</p>
                            ) : (
                              <div className="flex flex-wrap gap-1.5">
                                {e.services_interested.map(s => (
                                  <span key={s} className="inline-flex items-center h-6 px-3 rounded-full bg-white border border-border text-xs text-text-secondary font-medium">
                                    {s}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          {e.message && (
                            <div className="sm:col-span-2">
                              <p className="font-mono text-[10px] uppercase tracking-widest text-text-muted mb-2">Message</p>
                              <p className="font-body text-sm text-dark leading-relaxed whitespace-pre-wrap bg-white border border-border rounded-sm p-3">{e.message}</p>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function EnquiryActions({
  enquiry, updating, update,
}: {
  enquiry: Enquiry
  updating: boolean
  update: (id: string, status: Enquiry['status']) => void
}) {
  const next: { label: string; status: Enquiry['status'] }[] = []
  if (enquiry.status === 'new') next.push({ label: 'Mark contacted', status: 'contacted' })
  if (enquiry.status === 'contacted') next.push({ label: 'Mark converted', status: 'converted' })
  if (enquiry.status !== 'archived') next.push({ label: 'Archive', status: 'archived' })

  return (
    <div className="inline-flex items-center gap-1.5">
      {next.map(({ label, status }) => (
        <button
          key={status}
          onClick={() => update(enquiry.id, status)}
          disabled={updating}
          className={`h-8 px-3 text-xs font-semibold rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap ${
            status === 'archived'
              ? 'bg-white border border-border text-text-secondary hover:bg-surface'
              : 'bg-dark text-white hover:bg-primary-dark hover:-translate-y-px'
          }`}
        >
          {updating ? '…' : label}
        </button>
      ))}
    </div>
  )
}
