'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Budget, ExpenseCategory } from '@/types'

export function useBudget(householdId: string | null | undefined, month?: number, year?: number) {
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [categories, setCategories] = useState<ExpenseCategory[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchBudgets = useCallback(async () => {
    if (!householdId) {
      setLoading(false)
      return
    }
    const currentMonth = month ?? new Date().getMonth() + 1
    const currentYear = year ?? new Date().getFullYear()

    const [{ data: bData }, { data: cData }] = await Promise.all([
      supabase
        .from('budgets')
        .select('*, category:expense_categories(*)')
        .eq('household_id', householdId)
        .eq('month', currentMonth)
        .eq('year', currentYear),
      supabase.from('expense_categories').select('*').or(`is_default.eq.true,household_id.eq.${householdId}`),
    ])

    setBudgets(bData ?? [])
    setCategories(cData ?? [])
    setLoading(false)
  }, [householdId, month, year])

  useEffect(() => {
    fetchBudgets()
  }, [fetchBudgets])

  const upsertBudget = async (categoryId: string, amount: number, currency: string) => {
    const currentMonth = month ?? new Date().getMonth() + 1
    const currentYear = year ?? new Date().getFullYear()

    const existing = budgets.find(b => b.category_id === categoryId)
    let error
    if (existing) {
      const result = await supabase.from('budgets').update({ amount }).eq('id', existing.id)
      error = result.error
    } else {
      const result = await supabase.from('budgets').insert({
        household_id: householdId,
        category_id: categoryId,
        amount,
        month: currentMonth,
        year: currentYear,
        currency,
      })
      error = result.error
    }
    if (!error) await fetchBudgets()
    return { error }
  }

  const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0)

  return { budgets, categories, loading, totalBudget, upsertBudget, refetch: fetchBudgets }
}
