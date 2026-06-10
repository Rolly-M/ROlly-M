'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { CURRENCIES } from '@/types'

const goalSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  target_amount: z.string().min(1, 'Target amount is required'),
  currency: z.string().min(1),
  deadline: z.string().optional(),
})

type GoalFormData = z.infer<typeof goalSchema>

interface GoalFormProps {
  onSubmit: (data: GoalFormData) => Promise<void>
  onCancel: () => void
  loading?: boolean
  defaultCurrency?: string
}

export function GoalForm({ onSubmit, onCancel, loading, defaultCurrency = 'USD' }: GoalFormProps) {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<GoalFormData>({
    resolver: zodResolver(goalSchema),
    defaultValues: { currency: defaultCurrency },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="name">Goal Name</Label>
        <Input
          id="name"
          {...register('name')}
          placeholder="e.g., Emergency Fund, House Down Payment"
          className="mt-1 bg-slate-800 border-slate-700"
        />
        {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
      </div>

      <div>
        <Label htmlFor="description">Description (optional)</Label>
        <Textarea
          id="description"
          {...register('description')}
          placeholder="What is this goal for?"
          className="mt-1 bg-slate-800 border-slate-700"
          rows={2}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="target_amount">Target Amount</Label>
          <Input
            id="target_amount"
            type="number"
            step="0.01"
            min="0"
            {...register('target_amount')}
            placeholder="0.00"
            className="mt-1 bg-slate-800 border-slate-700"
          />
          {errors.target_amount && <p className="text-red-400 text-xs mt-1">{errors.target_amount.message}</p>}
        </div>

        <div>
          <Label>Currency</Label>
          <Select onValueChange={v => setValue('currency', v)} defaultValue={defaultCurrency}>
            <SelectTrigger className="mt-1 bg-slate-800 border-slate-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CURRENCIES.map(c => (
                <SelectItem key={c.value} value={c.value}>{c.symbol} {c.value}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="deadline">Target Date (optional)</Label>
        <Input
          id="deadline"
          type="date"
          {...register('deadline')}
          className="mt-1 bg-slate-800 border-slate-700"
        />
      </div>

      <div className="flex gap-3 justify-end pt-2">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-700">
          {loading ? 'Saving...' : 'Create Goal'}
        </Button>
      </div>
    </form>
  )
}
