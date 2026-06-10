'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { InvestmentGoal } from '@/types'
import { formatCurrency } from '@/lib/utils'
import { format } from 'date-fns'

const contributionSchema = z.object({
  amount: z.string().min(1, 'Amount is required'),
  date: z.string().min(1, 'Date is required'),
  notes: z.string().optional(),
})

type ContributionFormData = z.infer<typeof contributionSchema>

interface ContributionFormProps {
  goal: InvestmentGoal
  onSubmit: (data: ContributionFormData) => Promise<void>
  onCancel: () => void
  loading?: boolean
}

export function ContributionForm({ goal, onSubmit, onCancel, loading }: ContributionFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<ContributionFormData>({
    resolver: zodResolver(contributionSchema),
    defaultValues: { date: format(new Date(), 'yyyy-MM-dd') },
  })

  const remaining = goal.target_amount - goal.current_amount

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="bg-slate-800 rounded-lg p-3 text-sm">
        <p className="text-slate-400">Contributing to: <span className="text-white font-medium">{goal.name}</span></p>
        <p className="text-slate-400 mt-1">
          Remaining: <span className="text-indigo-400 font-medium">{formatCurrency(remaining, goal.currency)}</span>
        </p>
      </div>

      <div>
        <Label htmlFor="amount">Amount ({goal.currency})</Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          min="0"
          max={remaining}
          {...register('amount')}
          placeholder="0.00"
          className="mt-1 bg-slate-800 border-slate-700"
        />
        {errors.amount && <p className="text-red-400 text-xs mt-1">{errors.amount.message}</p>}
      </div>

      <div>
        <Label htmlFor="date">Date</Label>
        <Input
          id="date"
          type="date"
          {...register('date')}
          className="mt-1 bg-slate-800 border-slate-700"
        />
      </div>

      <div>
        <Label htmlFor="notes">Notes (optional)</Label>
        <Textarea
          id="notes"
          {...register('notes')}
          placeholder="e.g., Monthly contribution, bonus"
          className="mt-1 bg-slate-800 border-slate-700"
          rows={2}
        />
      </div>

      <div className="flex gap-3 justify-end pt-2">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-700">
          {loading ? 'Saving...' : 'Add Contribution'}
        </Button>
      </div>
    </form>
  )
}
