'use client'

import { IncomeSource, INCOME_TYPES } from '@/types'
import { formatCurrency, getMonthlyAmount } from '@/lib/utils'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Trash2, Briefcase, TrendingUp, Home, DollarSign } from 'lucide-react'

const typeIcons: Record<string, React.ReactNode> = {
  salary: <Briefcase className="w-4 h-4" />,
  freelance: <TrendingUp className="w-4 h-4" />,
  rental: <Home className="w-4 h-4" />,
  dividends: <DollarSign className="w-4 h-4" />,
}

interface IncomeListProps {
  sources: IncomeSource[]
  onToggle: (id: string, isActive: boolean) => void
  onDelete: (id: string) => void
  currentUserId: string
}

export function IncomeList({ sources, onToggle, onDelete, currentUserId }: IncomeListProps) {
  if (sources.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500">
        <DollarSign className="w-12 h-12 mx-auto mb-3 opacity-30" />
        <p>No income sources added yet.</p>
        <p className="text-sm">Add your first income source above.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {sources.map(source => {
        const monthlyAmount = getMonthlyAmount(source.amount, source.frequency)
        const typeLabel = INCOME_TYPES.find(t => t.value === source.type)?.label ?? source.type
        const isOwner = source.created_by === currentUserId

        return (
          <div
            key={source.id}
            className={`bg-slate-800 rounded-lg p-4 border ${source.is_active ? 'border-slate-700' : 'border-slate-800 opacity-60'}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 bg-indigo-600/20 rounded-lg flex items-center justify-center text-indigo-400 shrink-0">
                  {typeIcons[source.type] ?? <DollarSign className="w-4 h-4" />}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-white font-medium text-sm truncate">{source.name}</p>
                    <Badge variant="secondary" className="text-xs shrink-0">{typeLabel}</Badge>
                    {!isOwner && <Badge variant="outline" className="text-xs shrink-0 text-purple-400 border-purple-600">Partner</Badge>}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-slate-400 text-xs capitalize">{source.frequency}</p>
                    <span className="text-slate-600">·</span>
                    <p className="text-slate-400 text-xs">
                      {formatCurrency(monthlyAmount, source.currency)}/mo
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right">
                  <p className="text-white font-semibold text-sm">
                    {formatCurrency(source.amount, source.currency)}
                  </p>
                  <p className="text-slate-500 text-xs capitalize">{source.frequency}</p>
                </div>
                <Switch
                  checked={source.is_active}
                  onCheckedChange={checked => onToggle(source.id, checked)}
                />
                {isOwner && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(source.id)}
                    className="text-slate-500 hover:text-red-400 hover:bg-red-400/10 w-8 h-8"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                )}
              </div>
            </div>

            {source.notes && (
              <p className="text-slate-500 text-xs mt-2 pl-12">{source.notes}</p>
            )}
          </div>
        )
      })}
    </div>
  )
}
