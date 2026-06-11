'use client'

import { Menu, Bell, LogOut, ChevronDown } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAuth } from '@/hooks/useAuth'
import { useRouter, usePathname } from 'next/navigation'
import { useState } from 'react'

const PAGE_TITLES: Record<string, string> = {
  '/dashboard':   'Dashboard',
  '/income':      'Income',
  '/expenses':    'Expenses',
  '/budget':      'Budget',
  '/goals':       'Goals',
  '/investments': 'Investments',
  '/reports':     'Reports',
  '/settings':    'Settings',
}

interface HeaderProps {
  onMenuClick: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  const { profile, signOut } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  const title = PAGE_TITLES[pathname] ?? 'CouplesBudget'

  const handleSignOut = async () => {
    await signOut()
    router.push('/login')
  }

  const initials = profile?.full_name
    ? profile.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : profile?.email?.slice(0, 2).toUpperCase() ?? 'U'

  const firstName = profile?.full_name?.split(' ')[0] ?? profile?.email?.split('@')[0] ?? 'User'

  return (
    <header
      className="h-16 flex items-center justify-between px-4 lg:px-6 shrink-0"
      style={{
        background: 'rgba(5, 12, 24, 0.8)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-white font-bold text-base leading-none">{title}</h1>
          <p className="text-xs mt-0.5" style={{ color: '#475569' }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Notification bell */}
        <button
          className="relative p-2 rounded-xl text-slate-400 hover:text-white transition-all"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-violet-500 ring-2 ring-[#050C18]" />
        </button>

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(v => !v)}
            className="flex items-center gap-2 px-2 py-1.5 rounded-xl transition-all hover:bg-white/5"
            style={{ border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <Avatar className="w-7 h-7">
              <AvatarImage src={profile?.avatar_url ?? ''} alt={firstName} />
              <AvatarFallback className="text-white text-xs font-semibold" style={{ background: 'linear-gradient(135deg, #7C3AED, #A855F7)' }}>
                {initials}
              </AvatarFallback>
            </Avatar>
            <span className="hidden sm:block text-sm font-medium text-slate-200">{firstName}</span>
            <ChevronDown className="hidden sm:block w-3 h-3 text-slate-500" />
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div
                className="absolute right-0 top-full mt-2 w-44 z-20 rounded-xl overflow-hidden"
                style={{ background: '#0D1829', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                <div className="px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <p className="text-white text-sm font-medium truncate">{profile?.full_name ?? 'User'}</p>
                  <p className="text-xs text-slate-500 truncate">{profile?.email}</p>
                </div>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 w-full px-4 py-3 text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  Sign out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
