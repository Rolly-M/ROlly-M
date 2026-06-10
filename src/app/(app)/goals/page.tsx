'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { GoalForm } from '@/components/goals/GoalForm'
import { GoalCard } from '@/components/goals/GoalCard'
import { ContributionForm } from '@/components/goals/ContributionForm'
import { useAuth } from '@/hooks/useAuth'
import { useGoals } from '@/hooks/useGoals'
import { formatCurrency } from '@/lib/utils'
import { Currency, InvestmentGoal } from '@/types'
import { PlusCircle, Target, TrendingUp, CheckCircle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

const MOCK_GOALS: InvestmentGoal[] = [
  { id: '1', household_id: 'demo', created_by: 'demo', name: 'Emergency Fund', description: '6 months of living expenses', target_amount: 15000, current_amount: 8500, currency: 'USD', deadline: '2026-12-31', status: 'active', created_at: '' },
  { id: '2', household_id: 'demo', created_by: 'demo', name: 'House Down Payment', description: 'Save for our first home', target_amount: 50000, current_amount: 18500, currency: 'USD', deadline: '2027-06-30', status: 'active', created_at: '' },
  { id: '3', household_id: 'demo', created_by: 'demo', name: 'Europe Vacation', description: '3-week trip to Europe', target_amount: 5000, current_amount: 2200, currency: 'USD', deadline: '2026-08-15', status: 'active', created_at: '' },
  { id: '4', household_id: 'demo', created_by: 'demo', name: 'New Car Fund', description: 'Electric vehicle', target_amount: 12000, current_amount: 12000, currency: 'USD', deadline: '2026-03-01', status: 'completed', created_at: '' },
]

export default function GoalsPage() {
  const { profile } = useAuth()
  const householdId = profile?.household_id
  const currency = (profile?.currency as Currency) ?? 'USD'
  const { toast } = useToast()

  const [addGoalOpen, setAddGoalOpen] = useState(false)
  const [addGoalLoading, setAddGoalLoading] = useState(false)
  const [contributingGoal, setContributingGoal] = useState<InvestmentGoal | null>(null)
  const [contributionLoading, setContributionLoading] = useState(false)

  const { goals, addGoal, deleteGoal, updateGoal, addContribution } = useGoals(householdId)

  const isDemo = !householdId
  const displayGoals = isDemo ? MOCK_GOALS : goals

  const activeGoals = displayGoals.filter(g => g.status === 'active')
  const completedGoals = displayGoals.filter(g => g.status === 'completed')
  const totalTargeted = activeGoals.reduce((sum, g) => sum + g.target_amount, 0)
  const totalSaved = activeGoals.reduce((sum, g) => sum + g.current_amount, 0)

  const handleAddGoal = async (data: { name: string; description?: string; target_amount: string; currency: string; deadline?: string }) => {
    if (!householdId || !profile) {
      toast({ title: 'Demo mode', description: 'Connect Supabase to add real goals.' })
      setAddGoalOpen(false)
      return
    }
    setAddGoalLoading(true)
    const { error } = await addGoal({
      household_id: householdId,
      created_by: profile.id,
      name: data.name,
      description: data.description ?? null,
      target_amount: parseFloat(data.target_amount),
      current_amount: 0,
      currency: data.currency as Currency,
      deadline: data.deadline ?? null,
      status: 'active',
    })
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' })
    } else {
      toast({ title: 'Goal created!' })
      setAddGoalOpen(false)
    }
    setAddGoalLoading(false)
  }

  const handleAddContribution = async (data: { amount: string; date: string; notes?: string }) => {
    if (!householdId || !profile || !contributingGoal) return
    setContributionLoading(true)
    const { error } = await addContribution({
      goal_id: contributingGoal.id,
      household_id: householdId,
      contributed_by: profile.id,
      amount: parseFloat(data.amount),
      date: data.date,
      notes: data.notes ?? null,
    })
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' })
    } else {
      toast({ title: 'Contribution added!' })
      setContributingGoal(null)
    }
    setContributionLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (isDemo) {
      toast({ title: 'Demo mode' })
      return
    }
    const { error } = await deleteGoal(id)
    if (error) toast({ title: 'Error', description: error.message, variant: 'destructive' })
    else toast({ title: 'Goal deleted' })
  }

  const handleToggleStatus = async (id: string, status: 'active' | 'paused') => {
    if (isDemo) {
      toast({ title: 'Demo mode' })
      return
    }
    await updateGoal(id, { status })
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Investment Goals</h1>
          <p className="text-slate-400 text-sm mt-1">Track your financial milestones</p>
        </div>
        <Dialog open={addGoalOpen} onOpenChange={setAddGoalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-indigo-600 hover:bg-indigo-700 gap-2">
              <PlusCircle className="w-4 h-4" />
              New Goal
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-900 border-slate-800 max-w-md">
            <DialogHeader>
              <DialogTitle>Create Investment Goal</DialogTitle>
            </DialogHeader>
            <GoalForm onSubmit={handleAddGoal} onCancel={() => setAddGoalOpen(false)} loading={addGoalLoading} defaultCurrency={currency} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-1">
              <Target className="w-5 h-5 text-indigo-400" />
              <p className="text-slate-400 text-sm">Active Goals</p>
            </div>
            <p className="text-white font-bold text-2xl">{activeGoals.length}</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-1">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <p className="text-slate-400 text-sm">Total Saved</p>
            </div>
            <p className="text-white font-bold text-2xl">{formatCurrency(totalSaved, currency)}</p>
            <p className="text-slate-500 text-xs mt-1">of {formatCurrency(totalTargeted, currency)}</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-1">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <p className="text-slate-400 text-sm">Completed</p>
            </div>
            <p className="text-white font-bold text-2xl">{completedGoals.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Overall Progress */}
      {totalTargeted > 0 && (
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-5">
            <div className="flex justify-between items-center mb-2">
              <p className="text-slate-400 text-sm">Overall Progress</p>
              <p className="text-white font-semibold">{((totalSaved / totalTargeted) * 100).toFixed(1)}%</p>
            </div>
            <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-700"
                style={{ width: `${Math.min((totalSaved / totalTargeted) * 100, 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>Saved: {formatCurrency(totalSaved, currency)}</span>
              <span>Target: {formatCurrency(totalTargeted, currency)}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Goals Grid */}
      {activeGoals.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">Active Goals</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {activeGoals.map(goal => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onAddContribution={g => setContributingGoal(g)}
                onDelete={handleDelete}
                onToggleStatus={handleToggleStatus}
              />
            ))}
          </div>
        </div>
      )}

      {/* Completed Goals */}
      {completedGoals.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">Completed Goals 🎉</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {completedGoals.map(goal => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onAddContribution={() => {}}
                onDelete={handleDelete}
                onToggleStatus={handleToggleStatus}
              />
            ))}
          </div>
        </div>
      )}

      {displayGoals.length === 0 && (
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-12 text-center">
            <Target className="w-12 h-12 mx-auto mb-3 text-slate-600" />
            <p className="text-slate-400">No goals yet.</p>
            <p className="text-slate-600 text-sm">Create your first investment goal to start tracking your progress.</p>
            <Button
              onClick={() => setAddGoalOpen(true)}
              className="mt-4 bg-indigo-600 hover:bg-indigo-700"
            >
              Create First Goal
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Contribution Dialog */}
      <Dialog open={!!contributingGoal} onOpenChange={open => !open && setContributingGoal(null)}>
        <DialogContent className="bg-slate-900 border-slate-800 max-w-md">
          <DialogHeader>
            <DialogTitle>Add Contribution</DialogTitle>
          </DialogHeader>
          {contributingGoal && (
            <ContributionForm
              goal={contributingGoal}
              onSubmit={handleAddContribution}
              onCancel={() => setContributingGoal(null)}
              loading={contributionLoading}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
