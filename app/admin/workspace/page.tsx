'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { ADMIN_EMAIL } from '@/lib/constants'

type Submission = {
  id: string
  business_name: string | null
  owner_name: string | null
  email: string
  status: 'pending' | 'provisioned'
}

type TaskStatus = 'idle' | 'running' | 'done' | 'error'

type Task = {
  id: string
  label: string
  description: string
  status: TaskStatus
  result?: string
}

function WorkspaceContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const id = searchParams.get('id')

  const [submission, setSubmission] = useState<Submission | null>(null)
  const [loading, setLoading] = useState(true)
  const [tasks, setTasks] = useState<Task[]>([])

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session || session.user.email !== ADMIN_EMAIL) {
        router.replace('/admin')
        return
      }
      if (!id) {
        router.replace('/admin')
        return
      }
      const { data } = await supabase
        .from('onboard_submissions')
        .select('id, business_name, owner_name, email, status')
        .eq('id', id)
        .single()

      if (!data) {
        router.replace('/admin')
        return
      }

      setSubmission(data as Submission)
      setTasks([
        {
          id: 'domain-search',
          label: 'Domain Search',
          description: `Find available domains for "${data.business_name || data.email}"`,
          status: 'idle',
        },
      ])
      setLoading(false)
    }

    init()
  }, [id, router])

  function startTask(taskId: string) {
    setTasks(prev =>
      prev.map(t => t.id === taskId ? { ...t, status: 'running' } : t)
    )
    // TODO: hook into Claude API to perform domain search
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <p className="font-body text-sm text-text-muted">Loading…</p>
      </div>
    )
  }

  if (!submission) return null

  return (
    <div className="min-h-screen bg-surface">
      <div className="bg-dark px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin"
            className="text-white/60 hover:text-white transition-colors font-body text-sm flex items-center gap-1.5"
          >
            ← Admin
          </Link>
          <span className="text-white/20">|</span>
          <span className="font-display text-lg text-white">
            {submission.business_name || submission.email}
          </span>
        </div>
        <span className={`font-mono text-[11px] uppercase tracking-[0.18em] px-2.5 py-0.5 rounded-full ${
          submission.status === 'provisioned'
            ? 'bg-accent-tint/20 text-accent-light'
            : 'bg-primary-tint/20 text-primary-light'
        }`}>
          {submission.status}
        </span>
      </div>

      <div className="max-w-3xl mx-auto px-5 py-10">
        <div className="mb-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent mb-1">Client workspace</p>
          <h1 className="font-display text-[32px] leading-tight tracking-[-0.02em] text-dark">
            {submission.business_name || 'Unnamed business'}
          </h1>
          <p className="font-body text-sm text-text-secondary mt-1">
            {submission.owner_name && `${submission.owner_name} · `}{submission.email}
          </p>
        </div>

        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl text-dark">Setup tasks</h2>
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-text-muted">
            {tasks.filter(t => t.status === 'done').length}/{tasks.length} done
          </span>
        </div>

        <div className="space-y-3">
          {tasks.map(task => (
            <div
              key={task.id}
              className="bg-white border border-border rounded-card p-5 flex items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3 min-w-0">
                <StatusDot status={task.status} />
                <div className="min-w-0">
                  <p className="font-semibold text-dark font-body text-sm">{task.label}</p>
                  <p className="font-body text-xs text-text-secondary mt-0.5 truncate">{task.description}</p>
                </div>
              </div>
              <div className="flex-shrink-0">
                {task.status === 'idle' && (
                  <button
                    onClick={() => startTask(task.id)}
                    className="h-8 px-4 bg-primary hover:bg-primary-dark text-white text-xs font-semibold rounded-full transition-all duration-300 hover:-translate-y-px hover:shadow-medium whitespace-nowrap"
                  >
                    Start →
                  </button>
                )}
                {task.status === 'running' && (
                  <span className="font-mono text-[11px] uppercase tracking-widest text-primary animate-pulse">
                    Running…
                  </span>
                )}
                {task.status === 'done' && (
                  <span className="font-mono text-[11px] uppercase tracking-widest text-accent">
                    Done
                  </span>
                )}
                {task.status === 'error' && (
                  <span className="font-mono text-[11px] uppercase tracking-widest text-red-400">
                    Error
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function StatusDot({ status }: { status: TaskStatus }) {
  const colours: Record<TaskStatus, string> = {
    idle: 'bg-border',
    running: 'bg-primary animate-pulse',
    done: 'bg-accent',
    error: 'bg-red-400',
  }
  return <span className={`mt-0.5 w-2.5 h-2.5 rounded-full flex-shrink-0 ${colours[status]}`} />
}

export default function WorkspacePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <p className="font-body text-sm text-text-muted">Loading…</p>
      </div>
    }>
      <WorkspaceContent />
    </Suspense>
  )
}
