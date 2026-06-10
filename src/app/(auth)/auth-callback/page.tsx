'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Heart } from 'lucide-react'
import { Suspense } from 'react'

function AuthCallbackInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code')
      const next = searchParams.get('next') ?? '/dashboard'

      if (code) {
        // Exchange PKCE code for session (required for OAuth)
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (error) {
          router.push(`/login?error=${encodeURIComponent(error.message)}`)
          return
        }
      }

      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        router.push(next)
      } else {
        router.push('/login')
      }
    }
    handleCallback()
  }, [])

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-center">
        <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
          <Heart className="w-7 h-7 text-white" fill="currentColor" />
        </div>
        <p className="text-slate-400">Signing you in...</p>
      </div>
    </div>
  )
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center animate-pulse">
          <Heart className="w-7 h-7 text-white" fill="currentColor" />
        </div>
      </div>
    }>
      <AuthCallbackInner />
    </Suspense>
  )
}
