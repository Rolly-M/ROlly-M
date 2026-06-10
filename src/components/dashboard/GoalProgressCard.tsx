'use client'

import { InvestmentGoal } from '@/types'
import { formatCurrency } from '@/lib/utils'
import { Target } from 'lucide-react'

interface GoalProgressCardProps {
  goal: InvestmentGoal
}

export function GoalProgressCard({ goal }: GoalProgressCardProps) {
  const progress = Math.min((goal.current_amount / goal.target_amount) * 100, 100)
  const remaining = goal.target_amount - goal.current_amount

  return (
    <div className="bg-slate-800 rounded-lg p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600/20 rounded-lg flex items-center justify-center">
            <Target className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <p className="text-white text-sm font-medium">{goal.name}</p>
            {goal.deadline && (
              <p className="text-slate-500 text-xs">
                Due {new Date(goal.deadline).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              </p>
            )}
          </div>
        </div>
        <span className="text-indigo-400 text-sm font-semibold">{progress.toFixed(1)}%</span>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs text-slate-400">
          <span>{formatCurrency(goal.current_amount, goal.currency)}</span>
          <span>{formatCurrency(goal.target_amount, goal.currency)}</span>
        </div>
        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-500 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-slate-500 text-xs">
          {formatCurrency(remaining, goal.currency)} remaining
        </p>
      </div>
    </div>
  )
}
