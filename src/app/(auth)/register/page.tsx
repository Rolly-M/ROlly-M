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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Heart, Mail, Lock, User } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { CURRENCIES } from '@/types'

const registerSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  currency: z.string().min(1, 'Please select a currency'),
})
type RegisterData = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { currency: 'USD' },
  })

  const onSubmit = async (data: RegisterData) => {
    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.fullName,
          currency: data.currency,
        },
      },
    })

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' })
    } else {
      toast({ title: 'Account created!', description: 'Welcome to CouplesBudget.' })
      router.push('/dashboard')
    }
    setLoading(false)
  }

  const handleGoogleRegister = async () => {
    setGoogleLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${process.env.NEXT_PUBLIC_APP_URL ?? window.location.origin}/auth-callback` },
    })
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' })
      setGoogleLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Heart className="w-7 h-7 text-white" fill="currentColor" />
          </div>
          <h1 className="text-2xl font-bold text-white">Create your account</h1>
          <p className="text-slate-400 mt-1">Start managing finances together</p>
        </div>

        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-8 space-y-6">
          <Button
            type="button"
            variant="outline"
            className="w-full border-slate-700 hover:bg-slate-800 text-white"
            onClick={handleGoogleRegister}
            disabled={googleLoading}
          >
            <span className="mr-2 text-sm font-bold">G</span>
            {googleLoading ? 'Connecting...' : 'Sign up with Google'}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-700" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-slate-900 px-3 text-slate-500 text-sm">or</span>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="fullName" className="text-slate-300">Full Name</Label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                <Input
                  id="fullName"
                  {...register('fullName')}
                  placeholder="Alex Johnson"
                  className="pl-9 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                />
              </div>
              {errors.fullName && <p className="text-red-400 text-xs mt-1">{errors.fullName.message}</p>}
            </div>

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
              <Label htmlFor="password" className="text-slate-300">Password</Label>
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

            <div>
              <Label className="text-slate-300">Default Currency</Label>
              <Select onValueChange={v => setValue('currency', v)} defaultValue="USD">
                <SelectTrigger className="mt-1 bg-slate-800 border-slate-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map(c => (
                    <SelectItem key={c.value} value={c.value}>{c.symbol} {c.label} ({c.value})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.currency && <p className="text-red-400 text-xs mt-1">{errors.currency.message}</p>}
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>
        </div>

        <p className="text-center text-slate-500 text-sm mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
