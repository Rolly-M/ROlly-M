'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { INCOME_TYPES, INCOME_FREQUENCIES, CURRENCIES } from '@/types'

const incomeSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: z.string().min(1, 'Type is required'),
  amount: z.string().min(1, 'Amount is required'),
  frequency: z.string().min(1, 'Frequency is required'),
  currency: z.string().min(1, 'Currency is required'),
  notes: z.string().optional(),
})

type IncomeFormData = z.infer<typeof incomeSchema>

interface IncomeFormProps {
  onSubmit: (data: IncomeFormData) => Promise<void>
  onCancel: () => void
  loading?: boolean
  defaultCurrency?: string
}

export function IncomeForm({ onSubmit, onCancel, loading, defaultCurrency = 'USD' }: IncomeFormProps) {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<IncomeFormData>({
    resolver: zodResolver(incomeSchema),
    defaultValues: { currency: defaultCurrency, frequency: 'monthly' },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <Label htmlFor="name">Source Name</Label>
          <Input
            id="name"
            {...register('name')}
            placeholder="e.g., Main Job Salary"
            className="mt-1 bg-slate-800 border-slate-700"
          />
          {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <Label>Type</Label>
          <Select onValueChange={v => setValue('type', v)} defaultValue="">
            <SelectTrigger className="mt-1 bg-slate-800 border-slate-700">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {INCOME_TYPES.map(t => (
                <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.type && <p className="text-red-400 text-xs mt-1">{errors.type.message}</p>}
        </div>

        <div>
          <Label>Frequency</Label>
          <Select onValueChange={v => setValue('frequency', v)} defaultValue="monthly">
            <SelectTrigger className="mt-1 bg-slate-800 border-slate-700">
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent>
              {INCOME_FREQUENCIES.map(f => (
                <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            {...register('amount')}
            placeholder="0.00"
            className="mt-1 bg-slate-800 border-slate-700"
          />
          {errors.amount && <p className="text-red-400 text-xs mt-1">{errors.amount.message}</p>}
        </div>

        <div>
          <Label>Currency</Label>
          <Select onValueChange={v => setValue('currency', v)} defaultValue={defaultCurrency}>
            <SelectTrigger className="mt-1 bg-slate-800 border-slate-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CURRENCIES.map(c => (
                <SelectItem key={c.value} value={c.value}>{c.symbol} {c.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="col-span-2">
          <Label htmlFor="notes">Notes (optional)</Label>
          <Textarea
            id="notes"
            {...register('notes')}
            placeholder="Any additional notes..."
            className="mt-1 bg-slate-800 border-slate-700"
            rows={2}
          />
        </div>
      </div>

      <div className="flex gap-3 justify-end pt-2">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-700">
          {loading ? 'Saving...' : 'Add Income Source'}
        </Button>
      </div>
    </form>
  )
}
