'use client'

import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import type { Session } from '@supabase/supabase-js'

type UploadedFile = {
  name: string
  path: string
  url: string
  type: 'logo' | 'photo'
}

type Submission = {
  business_name: string | null
  owner_name: string | null
}

type Phase = 'loading' | 'unauthenticated' | 'check_email' | 'ready'

export default function UploadPage() {
  const [phase, setPhase] = useState<Phase>('loading')
  const [session, setSession] = useState<Session | null>(null)
  const [submission, setSubmission] = useState<Submission | null>(null)
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [email, setEmail] = useState('')
  const [uploading, setUploading] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const logoRef = useRef<HTMLInputElement>(null)
  const photosRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    async function handleSession(session: Session | null) {
      if (!session) {
        setPhase('unauthenticated')
        return
      }
      setSession(session)
      await loadData(session.user.id)
      setPhase('ready')
    }

    supabase.auth.getSession().then(({ data: { session } }) => handleSession(session))

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      handleSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  async function loadData(userId: string) {
    const { data: sub } = await supabase
      .from('onboard_submissions')
      .select('business_name, owner_name')
      .eq('user_id', userId)
      .single()
    if (sub) setSubmission(sub as Submission)

    const allFiles: UploadedFile[] = []
    for (const folder of ['logo', 'photos'] as const) {
      const { data: listed } = await supabase.storage.from('assets').list(`${userId}/${folder}`)
      if (!listed) continue
      for (const f of listed) {
        if (!f.name || f.name === '.emptyFolderPlaceholder') continue
        const path = `${userId}/${folder}/${f.name}`
        const { data: signed } = await supabase.storage.from('assets').createSignedUrl(path, 3600)
        allFiles.push({
          name: f.name,
          path,
          url: signed?.signedUrl ?? '',
          type: folder === 'logo' ? 'logo' : 'photo',
        })
      }
    }
    setFiles(allFiles)
  }

  async function requestMagicLink() {
    if (!email) return
    await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: typeof window !== 'undefined' ? window.location.href : '' },
    })
    setPhase('check_email')
  }

  async function uploadFile(file: File, folder: 'logo' | 'photos') {
    if (!session) return
    const ext = file.name.split('.').pop()
    const fileName = folder === 'logo' ? `logo.${ext}` : `${Date.now()}.${ext}`
    const path = `${session.user.id}/${folder}/${fileName}`

    const { error } = await supabase.storage.from('assets').upload(path, file, { upsert: true })
    if (error) { showToast(`Upload failed: ${error.message}`); return }

    const { data: signed } = await supabase.storage.from('assets').createSignedUrl(path, 3600)
    const fileType = folder === 'logo' ? 'logo' as const : 'photo' as const

    setFiles(prev => {
      const filtered = folder === 'logo' ? prev.filter(f => f.type !== 'logo') : prev
      return [...filtered, { name: fileName, path, url: signed?.signedUrl ?? '', type: fileType }]
    })
    showToast(`${folder === 'logo' ? 'Logo' : 'Photo'} uploaded!`)
  }

  async function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    await uploadFile(file, 'logo')
    setUploading(false)
    e.target.value = ''
  }

  async function handlePhotosChange(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(e.target.files ?? [])
    if (!picked.length) return
    setUploading(true)
    for (const file of picked) await uploadFile(file, 'photos')
    setUploading(false)
    e.target.value = ''
  }

  async function deleteFile(path: string) {
    const { error } = await supabase.storage.from('assets').remove([path])
    if (!error) setFiles(prev => prev.filter(f => f.path !== path))
  }

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 4000)
  }

  const logoFile = files.find(f => f.type === 'logo')
  const photoFiles = files.filter(f => f.type === 'photo')

  if (phase === 'loading') {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <p className="font-body text-sm text-text-muted">Loading…</p>
      </div>
    )
  }

  if (phase === 'check_email') {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center px-5">
        <div className="text-center max-w-sm">
          <h1 className="font-display text-2xl text-dark mb-3">Check your email</h1>
          <p className="font-body text-sm text-text-secondary">
            We sent a sign-in link to <strong>{email}</strong>. Click it to access your upload portal.
          </p>
        </div>
      </div>
    )
  }

  if (phase === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center px-5">
        <div className="bg-white border border-border rounded-card p-8 w-full max-w-sm shadow-soft">
          <h1 className="font-display text-2xl text-dark mb-1">Upload your assets</h1>
          <p className="font-body text-sm text-text-secondary mb-6">
            Enter your email to sign in and upload your files.
          </p>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && requestMagicLink()}
            placeholder="your@email.com"
            className="w-full h-12 px-4 rounded-sm border border-border text-dark font-body text-sm focus:outline-none focus:border-primary mb-3"
          />
          <button
            onClick={requestMagicLink}
            disabled={!email}
            className="w-full h-12 bg-primary hover:bg-primary-dark text-white font-semibold text-sm rounded-full transition-all duration-300 hover:-translate-y-px hover:shadow-medium disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-y-0"
          >
            Send sign-in link
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface">
      <div className="bg-dark px-5 py-4 flex items-center justify-between">
        <span className="font-display text-xl text-white">Dorza</span>
        <button
          onClick={() => supabase.auth.signOut()}
          className="text-sm text-white/60 hover:text-white transition-colors font-body"
        >
          Sign out
        </button>
      </div>

      <div className="max-w-2xl mx-auto px-5 py-10">
        <div className="mb-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent mb-2">Asset upload</p>
          <h1 className="font-display text-[36px] leading-tight tracking-[-0.02em] text-dark">
            {submission?.business_name ? `${submission.business_name}'s assets` : 'Upload your assets'}
          </h1>
          {submission?.owner_name && (
            <p className="font-body text-text-secondary mt-2">
              Hi {submission.owner_name} — upload your logo and photos below.
            </p>
          )}
        </div>

        {/* Logo */}
        <div className="bg-white border border-border rounded-card p-6 mb-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-semibold text-dark font-body">Logo</h2>
              <p className="text-sm text-text-muted font-body">PNG, SVG, or JPG — max 5 MB</p>
            </div>
            {logoFile && (
              <button
                onClick={() => deleteFile(logoFile.path)}
                className="text-xs text-text-muted hover:text-red-500 transition-colors font-body"
              >
                Remove
              </button>
            )}
          </div>

          {logoFile ? (
            <div className="flex items-center gap-3 p-3 bg-surface rounded-sm border border-border">
              <div className="w-10 h-10 bg-white rounded border border-border flex items-center justify-center overflow-hidden flex-shrink-0">
                <img src={logoFile.url} alt="Logo" className="max-w-full max-h-full object-contain" />
              </div>
              <span className="text-sm font-body text-text-secondary flex-1 truncate">{logoFile.name}</span>
              <span className="text-xs text-accent font-semibold font-body flex-shrink-0">Uploaded</span>
            </div>
          ) : (
            <button
              onClick={() => logoRef.current?.click()}
              disabled={uploading}
              className="w-full border-2 border-dashed border-border rounded-sm py-8 text-center hover:border-primary hover:bg-primary-tint/30 transition-all duration-300 group disabled:opacity-50"
            >
              <p className="font-body text-sm text-text-muted group-hover:text-primary transition-colors">
                Click to upload your logo
              </p>
            </button>
          )}
          <input ref={logoRef} type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
        </div>

        {/* Photos */}
        <div className="bg-white border border-border rounded-card p-6 mb-8">
          <div className="mb-4">
            <h2 className="font-semibold text-dark font-body">Photos</h2>
            <p className="text-sm text-text-muted font-body">JPG or PNG — max 10 MB each, multiple allowed</p>
          </div>

          {photoFiles.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
              {photoFiles.map(f => (
                <div key={f.path} className="relative group aspect-square rounded-sm overflow-hidden border border-border bg-surface">
                  <img src={f.url} alt={f.name} className="w-full h-full object-cover" />
                  <button
                    onClick={() => deleteFile(f.path)}
                    className="absolute inset-0 bg-dark/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-semibold font-body transition-opacity"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={() => photosRef.current?.click()}
            disabled={uploading}
            className="w-full border-2 border-dashed border-border rounded-sm py-8 text-center hover:border-primary hover:bg-primary-tint/30 transition-all duration-300 group disabled:opacity-50"
          >
            <p className="font-body text-sm text-text-muted group-hover:text-primary transition-colors">
              {photoFiles.length > 0 ? 'Add more photos' : 'Click to upload photos'}
            </p>
          </button>
          <input ref={photosRef} type="file" accept="image/*" multiple className="hidden" onChange={handlePhotosChange} />
        </div>

        <p className="font-body text-xs text-text-muted text-center">
          Your files are securely stored and only accessible by the Dorza team.
        </p>
      </div>

      {uploading && (
        <div className="fixed inset-0 bg-dark/20 flex items-center justify-center z-50">
          <div className="bg-white rounded-card px-8 py-5 shadow-card font-body text-sm text-dark">
            Uploading…
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-dark text-white text-sm font-body px-5 py-3 rounded-full shadow-card whitespace-nowrap">
          {toast}
        </div>
      )}
    </div>
  )
}
