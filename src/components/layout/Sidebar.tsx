'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard, Wallet, Receipt, PiggyBank,
  Target, TrendingUp, FileText, Settings, X, Heart,
} from 'lucide-react'

const navGroups = [
  {
    label: 'Overview',
    items: [
      { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    ],
  },
  {
    label: 'Money',
    items: [
      { href: '/income',   label: 'Income',   icon: Wallet },
      { href: '/expenses', label: 'Expenses', icon: Receipt },
      { href: '/budget',   label: 'Budget',   icon: PiggyBank },
    ],
  },
  {
    label: 'Planning',
    items: [
      { href: '/goals',       label: 'Goals',       icon: Target },
      { href: '/investments', label: 'Investments', icon: TrendingUp },
    ],
  },
  {
    label: 'Account',
    items: [
      { href: '/reports',  label: 'Reports',  icon: FileText },
      { href: '/settings', label: 'Settings', icon: Settings },
    ],
  },
]

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          'fixed left-0 top-0 z-50 h-full w-60 flex flex-col transition-transform duration-300 ease-in-out',
          'lg:static lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
        style={{ background: '#030912', borderRight: '1px solid rgba(255,255,255,0.06)' }}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center gradient-bg glow-violet shrink-0">
              <Heart className="w-4 h-4 text-white" fill="currentColor" />
            </div>
            <div>
              <span className="text-white font-bold text-sm tracking-tight">CouplesBudget</span>
              <p className="text-xs mt-0.5" style={{ color: '#64748B' }}>finances together</p>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden text-slate-500 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav groups */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
          {navGroups.map(group => (
            <div key={group.label}>
              <p className="text-xs font-semibold uppercase tracking-widest px-3 mb-2" style={{ color: '#334155' }}>
                {group.label}
              </p>
              <div className="space-y-0.5">
                {group.items.map(item => {
                  const Icon = item.icon
                  const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative group',
                        isActive
                          ? 'text-white'
                          : 'text-slate-500 hover:text-slate-200'
                      )}
                      style={isActive ? {
                        background: 'rgba(124,58,237,0.15)',
                        borderLeft: '2px solid #A855F7',
                      } : { borderLeft: '2px solid transparent' }}
                    >
                      <Icon className={cn(
                        'w-4 h-4 shrink-0 transition-colors',
                        isActive ? 'text-violet-400' : 'text-slate-600 group-hover:text-slate-400'
                      )} />
                      {item.label}
                      {isActive && (
                        <span className="absolute right-3 w-1.5 h-1.5 rounded-full bg-violet-400" />
                      )}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-5 py-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs" style={{ color: '#475569' }}>All systems operational</span>
          </div>
        </div>
      </aside>
    </>
  )
}
