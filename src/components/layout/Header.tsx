'use client'

import { Menu, Bell, LogOut } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'

interface HeaderProps {
  onMenuClick: () => void
  title?: string
}

export function Header({ onMenuClick, title }: HeaderProps) {
  const { profile, signOut } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push('/login')
  }

  const initials = profile?.full_name
    ? profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : profile?.email?.slice(0, 2).toUpperCase() ?? 'U'

  return (
    <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 lg:px-6 shrink-0">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden text-slate-400 hover:text-white transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        {title && (
          <h2 className="text-white font-semibold text-lg hidden sm:block">{title}</h2>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button className="text-slate-400 hover:text-white transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-indigo-500 rounded-full" />
        </button>

        <div className="flex items-center gap-2">
          <Avatar className="w-8 h-8">
            <AvatarImage src={profile?.avatar_url ?? ''} alt={profile?.full_name ?? 'User'} />
            <AvatarFallback className="bg-indigo-600 text-white text-xs">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="hidden sm:block">
            <p className="text-white text-sm font-medium leading-none">
              {profile?.full_name ?? 'User'}
            </p>
            <p className="text-slate-400 text-xs">{profile?.email}</p>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={handleSignOut}
          className="text-slate-400 hover:text-white hover:bg-slate-800"
        >
          <LogOut className="w-4 h-4" />
        </Button>
      </div>
    </header>
  )
}
