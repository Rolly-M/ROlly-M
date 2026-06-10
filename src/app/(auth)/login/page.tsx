'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Heart, Mail, Lock } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})
type LoginData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  const { register, handleSubmit, formState: { errors } } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginData) => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' })
    } else {
      router.push('/dashboard')
    }
    setLoading(false)
  }

  const handleGoogleLogin = async () => {
    setGoogleLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth-callback` },
    })
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' })
      setGoogleLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Heart className="w-7 h-7 text-white" fill="currentColor" />
          </div>
          <h1 className="text-2xl font-bold text-white">Welcome back</h1>
          <p className="text-slate-400 mt-1">Sign in to your CouplesBudget account</p>
        </div>

        {/* Card */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-8 space-y-6">
          {/* Google */}
          <Button
            type="button"
            variant="outline"
            className="w-full border-slate-700 hover:bg-slate-800 text-white"
            onClick={handleGoogleLogin}
            disabled={googleLoading}
          >
            <span className="mr-2 text-sm font-bold">G</span>
            {googleLoading ? 'Connecting...' : 'Continue with Google'}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-700" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-slate-900 px-3 text-slate-500 text-sm">or</span>
            </div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-slate-300">Email</Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                <Input
                  id="email"
                  type="email"
                  {...register('email')}
                  placeholder="you@example.com"
                  className="pl-9 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                />
              </div>
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-slate-300">Password</Label>
              </div>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                <Input
                  id="password"
                  type="password"
                  {...register('password')}
                  placeholder="••••••••"
                  className="pl-9 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                />
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </div>

        <p className="text-center text-slate-500 text-sm mt-6">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-indigo-400 hover:text-indigo-300 font-medium">
            Sign up free
          </Link>
        </p>
      </div>
    </div>
  )
}
