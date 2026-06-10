'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { InvestmentGoal, GoalContribution } from '@/types'

export function useGoals(householdId: string | null | undefined) {
  const [goals, setGoals] = useState<InvestmentGoal[]>([])
  const [contributions, setContributions] = useState<GoalContribution[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchGoals = useCallback(async () => {
    if (!householdId) {
      setLoading(false)
      return
    }
    const [{ data: gData }, { data: cData }] = await Promise.all([
      supabase.from('investment_goals').select('*').eq('household_id', householdId).order('created_at', { ascending: false }),
      supabase.from('goal_contributions').select('*').eq('household_id', householdId).order('date', { ascending: false }),
    ])
    setGoals(gData ?? [])
    setContributions(cData ?? [])
    setLoading(false)
  }, [householdId])

  useEffect(() => {
    fetchGoals()
  }, [fetchGoals])

  const addGoal = async (data: Omit<InvestmentGoal, 'id' | 'created_at'>) => {
    const { error } = await supabase.from('investment_goals').insert(data)
    if (!error) await fetchGoals()
    return { error }
  }

  const updateGoal = async (id: string, data: Partial<InvestmentGoal>) => {
    const { error } = await supabase.from('investment_goals').update(data).eq('id', id)
    if (!error) await fetchGoals()
    return { error }
  }

  const deleteGoal = async (id: string) => {
    const { error } = await supabase.from('investment_goals').delete().eq('id', id)
    if (!error) await fetchGoals()
    return { error }
  }

  const addContribution = async (data: Omit<GoalContribution, 'id' | 'created_at' | 'contributor'>) => {
    const { error } = await supabase.from('goal_contributions').insert(data)
    if (!error) {
      // Update goal current_amount
      const goal = goals.find(g => g.id === data.goal_id)
      if (goal) {
        await supabase.from('investment_goals')
          .update({ current_amount: goal.current_amount + data.amount })
          .eq('id', data.goal_id)
      }
      await fetchGoals()
    }
    return { error }
  }

  const getGoalContributions = (goalId: string) => contributions.filter(c => c.goal_id === goalId)

  return { goals, contributions, loading, addGoal, updateGoal, deleteGoal, addContribution, getGoalContributions, refetch: fetchGoals }
}
