'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAuth } from '@/hooks/useAuth'
import { useHousehold } from '@/hooks/useHousehold'
import { CURRENCIES, Currency } from '@/types'
import { User, Home, Mail, LogOut, Copy, Check, Bell } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function SettingsPage() {
  const { profile, signOut } = useAuth()
  const { household, members, inviteMember } = useHousehold(profile?.household_id)
  const { toast } = useToast()
  const router = useRouter()
  const supabase = createClient()

  const [fullName, setFullName] = useState(profile?.full_name ?? '')
  const [currency, setCurrency] = useState<Currency>((profile?.currency as Currency) ?? 'USD')
  const [savingProfile, setSavingProfile] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviting, setInviting] = useState(false)
  const [copied, setCopied] = useState(false)

  const initials = profile?.full_name
    ? profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : profile?.email?.slice(0, 2).toUpperCase() ?? 'U'

  const handleSaveProfile = async () => {
    if (!profile) return
    setSavingProfile(true)
    const { error } = await supabase.from('profiles').update({ full_name: fullName, currency }).eq('id', profile.id)
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' })
    } else {
      toast({ title: 'Profile updated!' })
    }
    setSavingProfile(false)
  }

  const handleInvite = async () => {
    if (!inviteEmail || !profile) return
    setInviting(true)
    const { error } = await inviteMember(inviteEmail, profile.id)
    if (error) {
      toast({ title: 'Error', description: typeof error === 'string' ? error : (error as { message?: string })?.message ?? 'Failed to send invite', variant: 'destructive' })
    } else {
      toast({ title: 'Invite sent!', description: `Invitation sent to ${inviteEmail}` })
      setInviteEmail('')
    }
    setInviting(false)
  }

  const copyInviteLink = async () => {
    if (!household?.invite_token) return
    const link = `${process.env.NEXT_PUBLIC_APP_URL ?? window.location.origin}/join/${household.invite_token}`
    await navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast({ title: 'Invite link copied!' })
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/login')
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-slate-400 text-sm mt-1">Manage your account and household</p>
      </div>

      {/* Profile */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-base text-slate-300 flex items-center gap-2">
            <User className="w-4 h-4 text-indigo-400" />
            Profile Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={profile?.avatar_url ?? ''} />
              <AvatarFallback className="bg-indigo-600 text-white text-lg">{initials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-white font-medium">{profile?.full_name ?? 'User'}</p>
              <p className="text-slate-400 text-sm">{profile?.email}</p>
            </div>
          </div>

          <div>
            <Label htmlFor="fullName" className="text-slate-300">Full Name</Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              className="mt-1 bg-slate-800 border-slate-700"
              placeholder="Your full name"
            />
          </div>

          <div>
            <Label className="text-slate-300">Default Currency</Label>
            <Select value={currency} onValueChange={v => setCurrency(v as Currency)}>
              <SelectTrigger className="mt-1 bg-slate-800 border-slate-700">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map(c => (
                  <SelectItem key={c.value} value={c.value}>{c.symbol} {c.label} ({c.value})</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleSaveProfile} disabled={savingProfile} className="bg-indigo-600 hover:bg-indigo-700">
            {savingProfile ? 'Saving...' : 'Save Profile'}
          </Button>
        </CardContent>
      </Card>

      {/* Household */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-base text-slate-300 flex items-center gap-2">
            <Home className="w-4 h-4 text-indigo-400" />
            Household
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {household ? (
            <>
              <div>
                <p className="text-slate-400 text-sm">Household Name</p>
                <p className="text-white font-medium mt-1">{household.name}</p>
              </div>

              <div>
                <p className="text-slate-400 text-sm mb-2">Members ({members.length})</p>
                <div className="space-y-2">
                  {members.map(member => (
                    <div key={member.id} className="flex items-center gap-3 bg-slate-800 rounded-lg p-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={member.avatar_url ?? ''} />
                        <AvatarFallback className="bg-indigo-600 text-white text-xs">
                          {member.full_name?.slice(0, 2).toUpperCase() ?? member.email?.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-white text-sm font-medium">{member.full_name ?? 'Partner'}</p>
                        <p className="text-slate-500 text-xs">{member.email}</p>
                      </div>
                      {member.id === household.owner_id && (
                        <span className="ml-auto text-xs text-indigo-400 bg-indigo-600/20 px-2 py-0.5 rounded-full">Owner</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <Separator className="bg-slate-700" />

              <div>
                <p className="text-slate-400 text-sm mb-2">Invite Partner by Email</p>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                    <Input
                      type="email"
                      value={inviteEmail}
                      onChange={e => setInviteEmail(e.target.value)}
                      placeholder="partner@example.com"
                      className="pl-9 bg-slate-800 border-slate-700"
                    />
                  </div>
                  <Button onClick={handleInvite} disabled={inviting || !inviteEmail} className="bg-indigo-600 hover:bg-indigo-700">
                    {inviting ? 'Sending...' : 'Invite'}
                  </Button>
                </div>
              </div>

              <div>
                <p className="text-slate-400 text-sm mb-2">Or share invite link</p>
                <Button
                  variant="outline"
                  onClick={copyInviteLink}
                  className="w-full border-slate-700 hover:bg-slate-800 gap-2"
                >
                  {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied!' : 'Copy Invite Link'}
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-6">
              <Home className="w-10 h-10 mx-auto mb-2 text-slate-600" />
              <p className="text-slate-400 text-sm">No household set up yet.</p>
              <p className="text-slate-600 text-xs">Connect Supabase to create your household.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-base text-slate-300 flex items-center gap-2">
            <Bell className="w-4 h-4 text-indigo-400" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-slate-400">
            <div className="flex items-center justify-between">
              <span>Budget alerts (over 80%)</span>
              <span className="text-green-400 text-xs">Enabled</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Monthly summary</span>
              <span className="text-green-400 text-xs">Enabled</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Goal milestone alerts</span>
              <span className="text-green-400 text-xs">Enabled</span>
            </div>
          </div>
          <p className="text-slate-600 text-xs mt-3">Push notifications require PWA installation.</p>
        </CardContent>
      </Card>

      {/* Sign Out */}
      <Card className="bg-slate-900 border-slate-800 border-red-900/30">
        <CardContent className="p-5">
          <Button
            variant="destructive"
            onClick={handleSignOut}
            className="w-full gap-2"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
