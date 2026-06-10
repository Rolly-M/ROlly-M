'use client'

import { Expense } from '@/types'
import { formatCurrency } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Trash2, Receipt } from 'lucide-react'
import { format } from 'date-fns'

interface ExpenseListProps {
  expenses: Expense[]
  onDelete: (id: string) => void
  currentUserId: string
  limit?: number
}

export function ExpenseList({ expenses, onDelete, currentUserId, limit }: ExpenseListProps) {
  const displayExpenses = limit ? expenses.slice(0, limit) : expenses

  if (expenses.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500">
        <Receipt className="w-10 h-10 mx-auto mb-2 opacity-30" />
        <p className="text-sm">No expenses found.</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {displayExpenses.map(expense => {
        const isOwner = expense.created_by === currentUserId
        const categoryColor = expense.category?.color ?? '#6366f1'

        return (
          <div key={expense.id} className="flex items-center justify-between bg-slate-800 rounded-lg p-3 group">
            <div className="flex items-center gap-3 min-w-0">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0"
                style={{ backgroundColor: categoryColor + '20', color: categoryColor }}
              >
                {expense.category?.icon ?? '💰'}
              </div>
              <div className="min-w-0">
                <p className="text-white text-sm font-medium truncate">{expense.description}</p>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span>{expense.category?.name ?? 'Uncategorized'}</span>
                  <span>·</span>
                  <span>{format(new Date(expense.date), 'MMM d, yyyy')}</span>
                  {!isOwner && <span className="text-purple-400">· Partner</span>}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <p className="text-white font-semibold text-sm">
                {formatCurrency(expense.amount, expense.currency)}
              </p>
              {isOwner && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(expense.id)}
                  className="text-slate-600 hover:text-red-400 hover:bg-red-400/10 w-7 h-7 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
