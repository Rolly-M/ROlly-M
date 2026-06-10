'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { ExpenseCategory, CURRENCIES } from '@/types'
import { format } from 'date-fns'

const expenseSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  amount: z.string().min(1, 'Amount is required'),
  category_id: z.string().min(1, 'Category is required'),
  date: z.string().min(1, 'Date is required'),
  currency: z.string().min(1),
  notes: z.string().optional(),
})

type ExpenseFormData = z.infer<typeof expenseSchema>

interface ExpenseFormProps {
  categories: ExpenseCategory[]
  onSubmit: (data: ExpenseFormData) => Promise<void>
  onCancel: () => void
  loading?: boolean
  defaultCurrency?: string
}

export function ExpenseForm({ categories, onSubmit, onCancel, loading, defaultCurrency = 'USD' }: ExpenseFormProps) {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      currency: defaultCurrency,
      date: format(new Date(), 'yyyy-MM-dd'),
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            {...register('description')}
            placeholder="e.g., Grocery shopping"
            className="mt-1 bg-slate-800 border-slate-700"
          />
          {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description.message}</p>}
        </div>

        <div>
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            min="0"
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
                <SelectItem key={c.value} value={c.value}>{c.symbol} {c.value}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Category</Label>
          <Select onValueChange={v => setValue('category_id', v)} defaultValue="">
            <SelectTrigger className="mt-1 bg-slate-800 border-slate-700">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(cat => (
                <SelectItem key={cat.id} value={cat.id}>
                  <span>{cat.icon} {cat.name}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category_id && <p className="text-red-400 text-xs mt-1">{errors.category_id.message}</p>}
        </div>

        <div>
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            {...register('date')}
            className="mt-1 bg-slate-800 border-slate-700"
          />
          {errors.date && <p className="text-red-400 text-xs mt-1">{errors.date.message}</p>}
        </div>

        <div className="col-span-2">
          <Label htmlFor="notes">Notes (optional)</Label>
          <Textarea
            id="notes"
            {...register('notes')}
            placeholder="Additional notes..."
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
          {loading ? 'Saving...' : 'Add Expense'}
        </Button>
      </div>
    </form>
  )
}
