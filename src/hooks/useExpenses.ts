'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Expense } from '@/types'

export function useExpenses(householdId: string | null | undefined, month?: number, year?: number) {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchExpenses = useCallback(async () => {
    if (!householdId) {
      setLoading(false)
      return
    }
    let query = supabase
      .from('expenses')
      .select('*, category:expense_categories(*)')
      .eq('household_id', householdId)
      .order('date', { ascending: false })

    if (month && year) {
      const startDate = `${year}-${String(month).padStart(2, '0')}-01`
      const endDate = new Date(year, month, 0)
      const endDateStr = `${year}-${String(month).padStart(2, '0')}-${endDate.getDate()}`
      query = query.gte('date', startDate).lte('date', endDateStr)
    }

    const { data } = await query
    setExpenses(data ?? [])
    setLoading(false)
  }, [householdId, month, year])

  useEffect(() => {
    fetchExpenses()
  }, [fetchExpenses])

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0)

  const expensesByCategory = expenses.reduce((acc, expense) => {
    const catName = expense.category?.name ?? 'Other'
    acc[catName] = (acc[catName] ?? 0) + expense.amount
    return acc
  }, {} as Record<string, number>)

  const addExpense = async (data: Omit<Expense, 'id' | 'created_at' | 'category' | 'creator'>) => {
    const { error } = await supabase.from('expenses').insert(data)
    if (!error) await fetchExpenses()
    return { error }
  }

  const deleteExpense = async (id: string) => {
    const { error } = await supabase.from('expenses').delete().eq('id', id)
    if (!error) await fetchExpenses()
    return { error }
  }

  return { expenses, loading, totalExpenses, expensesByCategory, addExpense, deleteExpense, refetch: fetchExpenses }
}
