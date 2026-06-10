'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { IncomeSource } from '@/types'
import { getMonthlyAmount } from '@/lib/utils'

export function useIncome(householdId: string | null | undefined) {
  const [incomeSources, setIncomeSources] = useState<IncomeSource[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchIncome = useCallback(async () => {
    if (!householdId) {
      setLoading(false)
      return
    }
    const { data } = await supabase
      .from('income_sources')
      .select('*')
      .eq('household_id', householdId)
      .order('created_at', { ascending: false })
    setIncomeSources(data ?? [])
    setLoading(false)
  }, [householdId])

  useEffect(() => {
    fetchIncome()
  }, [fetchIncome])

  const totalMonthlyIncome = incomeSources
    .filter(s => s.is_active)
    .reduce((sum, s) => sum + getMonthlyAmount(s.amount, s.frequency), 0)

  const addIncomeSource = async (data: Omit<IncomeSource, 'id' | 'created_at'>) => {
    const { error } = await supabase.from('income_sources').insert(data)
    if (!error) await fetchIncome()
    return { error }
  }

  const updateIncomeSource = async (id: string, data: Partial<IncomeSource>) => {
    const { error } = await supabase.from('income_sources').update(data).eq('id', id)
    if (!error) await fetchIncome()
    return { error }
  }

  const deleteIncomeSource = async (id: string) => {
    const { error } = await supabase.from('income_sources').delete().eq('id', id)
    if (!error) await fetchIncome()
    return { error }
  }

  const toggleActive = async (id: string, isActive: boolean) => {
    return updateIncomeSource(id, { is_active: isActive })
  }

  return { incomeSources, loading, totalMonthlyIncome, addIncomeSource, updateIncomeSource, deleteIncomeSource, toggleActive, refetch: fetchIncome }
}
