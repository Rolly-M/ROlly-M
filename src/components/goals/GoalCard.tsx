'use client'

import { InvestmentGoal } from '@/types'
import { formatCurrency, getMonthsUntilDeadline, calculateMonthlyNeeded } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Target, Calendar, Trash2, PlusCircle, Pause, Play } from 'lucide-react'

interface GoalCardProps {
  goal: InvestmentGoal
  onAddContribution: (goal: InvestmentGoal) => void
  onDelete: (id: string) => void
  onToggleStatus: (id: string, status: 'active' | 'paused') => void
}

export function GoalCard({ goal, onAddContribution, onDelete, onToggleStatus }: GoalCardProps) {
  const progress = Math.min((goal.current_amount / goal.target_amount) * 100, 100)
  const remaining = goal.target_amount - goal.current_amount
  const monthsLeft = goal.deadline ? getMonthsUntilDeadline(goal.deadline) : null
  const monthlyNeeded = goal.deadline ? calculateMonthlyNeeded(goal.target_amount, goal.current_amount, goal.deadline) : null

  const statusColors = {
    active: 'success',
    completed: 'default',
    paused: 'warning',
  } as const

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-5 space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-indigo-600/20 rounded-xl flex items-center justify-center shrink-0">
            <Target className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold">{goal.name}</h3>
            {goal.description && <p className="text-slate-500 text-sm mt-0.5">{goal.description}</p>}
          </div>
        </div>
        <Badge variant={statusColors[goal.status]}>{goal.status}</Badge>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between items-baseline">
          <span className="text-white font-bold text-lg">{formatCurrency(goal.current_amount, goal.currency)}</span>
          <span className="text-slate-400 text-sm">of {formatCurrency(goal.target_amount, goal.currency)}</span>
        </div>
        <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              progress >= 100 ? 'bg-green-500' : 'bg-indigo-500'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-slate-500">
          <span>{progress.toFixed(1)}% complete</span>
          {remaining > 0 && <span>{formatCurrency(remaining, goal.currency)} remaining</span>}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        {goal.deadline && (
          <div className="bg-slate-900 rounded-lg p-3">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
              <Calendar className="w-3 h-3" />
              <span>Deadline</span>
            </div>
            <p className="text-white text-sm font-medium">
              {new Date(goal.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
            {monthsLeft !== null && (
              <p className="text-slate-500 text-xs">{monthsLeft} months left</p>
            )}
          </div>
        )}
        {monthlyNeeded !== null && monthlyNeeded > 0 && (
          <div className="bg-slate-900 rounded-lg p-3">
            <p className="text-slate-400 text-xs mb-1">Monthly Needed</p>
            <p className="text-white text-sm font-medium">{formatCurrency(monthlyNeeded, goal.currency)}</p>
            <p className="text-slate-500 text-xs">to reach by deadline</p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-1">
        {goal.status !== 'completed' && (
          <Button
            size="sm"
            onClick={() => onAddContribution(goal)}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 h-8 text-xs"
          >
            <PlusCircle className="w-3.5 h-3.5 mr-1.5" />
            Add Contribution
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onToggleStatus(goal.id, goal.status === 'active' ? 'paused' : 'active')}
          className="text-slate-400 hover:text-white h-8 w-8 p-0"
        >
          {goal.status === 'active' ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(goal.id)}
          className="text-slate-400 hover:text-red-400 h-8 w-8 p-0"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  )
}
