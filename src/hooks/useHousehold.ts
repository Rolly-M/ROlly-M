'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Household, Profile } from '@/types'

export function useHousehold(householdId: string | null | undefined) {
  const [household, setHousehold] = useState<Household | null>(null)
  const [members, setMembers] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    if (!householdId) {
      setLoading(false)
      return
    }

    const fetchHousehold = async () => {
      const [{ data: hData }, { data: mData }] = await Promise.all([
        supabase.from('households').select('*').eq('id', householdId).single(),
        supabase.from('profiles').select('*').eq('household_id', householdId),
      ])
      setHousehold(hData)
      setMembers(mData ?? [])
      setLoading(false)
    }

    fetchHousehold()
  }, [householdId])

  const inviteMember = async (email: string, inviterId: string) => {
    if (!householdId) return { error: 'No household' }
    const { error } = await supabase.from('household_invites').insert({
      household_id: householdId,
      invitee_email: email,
      inviter_id: inviterId,
      status: 'pending',
    })
    return { error }
  }

  return { household, members, loading, inviteMember }
}
