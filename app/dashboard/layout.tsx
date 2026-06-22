'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Bookings', icon: 'calendar' },
] as const

type IconName = typeof NAV_ITEMS[number]['icon']

function NavIcon({ name, className }: { name: IconName; className?: string }) {
  switch (name) {
    case 'calendar':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
        </svg>
      )
  }
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setLoggedIn(!!session)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setLoggedIn(!!session)
    })

    return () => subscription.unsubscribe()
  }, [])

  const isAuthPage = pathname === '/dashboard/reset-password'
  if (isAuthPage) return <>{children}</>

  if (!loggedIn) {
    return (
      <div className="min-h-screen bg-surface">
        {children}
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

      <div className="max-w-5xl mx-auto px-5 py-10 flex gap-8">
        {/* Sidebar nav */}
        <nav className="w-48 flex-shrink-0 hidden md:block">
          <div className="sticky top-10 space-y-1">
            {NAV_ITEMS.map(item => {
              const active = item.href === '/dashboard'
                ? pathname === '/dashboard'
                : pathname.startsWith(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-sm text-sm font-body font-medium transition-all duration-300 ${
                    active
                      ? 'bg-white border border-border text-dark shadow-soft'
                      : 'text-text-secondary hover:bg-white hover:text-dark'
                  }`}
                >
                  <NavIcon name={item.icon} className="w-4 h-4" />
                  {item.label}
                </Link>
              )
            })}
          </div>
        </nav>

        {/* Mobile nav */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border flex md:hidden z-40">
          {NAV_ITEMS.map(item => {
            const active = item.href === '/dashboard'
              ? pathname === '/dashboard'
              : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-body font-medium transition-colors ${
                  active ? 'text-primary' : 'text-text-muted'
                }`}
              >
                <NavIcon name={item.icon} className="w-5 h-5" />
                {item.label}
              </Link>
            )
          })}
        </div>

        {/* Main content */}
        <main className="flex-1 min-w-0 pb-20 md:pb-0">
          {children}
        </main>
      </div>
    </div>
  )
}
