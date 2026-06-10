'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ExpenseForm } from '@/components/expenses/ExpenseForm'
import { ExpenseList } from '@/components/expenses/ExpenseList'
import { useAuth } from '@/hooks/useAuth'
import { useExpenses } from '@/hooks/useExpenses'
import { useBudget } from '@/hooks/useBudget'
import { formatCurrency, getCurrentMonth, getCurrentYear, getFullMonthName } from '@/lib/utils'
import { Currency, Expense, ExpenseCategory } from '@/types'
import { PlusCircle, Receipt } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

const MOCK_CATEGORIES: ExpenseCategory[] = [
  { id: '1', name: 'Food & Dining', icon: '🍽️', color: '#f59e0b', is_default: true, household_id: null },
  { id: '2', name: 'Utilities', icon: '⚡', color: '#3b82f6', is_default: true, household_id: null },
  { id: '3', name: 'Entertainment', icon: '🎬', color: '#8b5cf6', is_default: true, household_id: null },
  { id: '4', name: 'Insurance', icon: '🛡️', color: '#10b981', is_default: true, household_id: null },
  { id: '5', name: 'Transportation', icon: '🚗', color: '#6366f1', is_default: true, household_id: null },
  { id: '6', name: 'Housing', icon: '🏠', color: '#ec4899', is_default: true, household_id: null },
  { id: '7', name: 'Healthcare', icon: '💊', color: '#14b8a6', is_default: true, household_id: null },
  { id: '8', name: 'Shopping', icon: '🛍️', color: '#f97316', is_default: true, household_id: null },
  { id: '9', name: 'Education', icon: '📚', color: '#06b6d4', is_default: true, household_id: null },
  { id: '10', name: 'Travel', icon: '✈️', color: '#84cc16', is_default: true, household_id: null },
  { id: '11', name: 'Personal Care', icon: '💅', color: '#f43f5e', is_default: true, household_id: null },
  { id: '12', name: 'Savings', icon: '💰', color: '#a855f7', is_default: true, household_id: null },
  { id: '13', name: 'Gifts', icon: '🎁', color: '#fb923c', is_default: true, household_id: null },
  { id: '14', name: 'Other', icon: '📌', color: '#64748b', is_default: true, household_id: null },
]

const MOCK_EXPENSES: Expense[] = [
  { id: '1', household_id: 'demo', created_by: 'me', category_id: '1', amount: 142.50, currency: 'USD', description: 'Weekly groceries', date: '2026-06-08', notes: null, created_at: '', category: MOCK_CATEGORIES[0] },
  { id: '2', household_id: 'demo', created_by: 'partner', category_id: '2', amount: 89.99, currency: 'USD', description: 'Electric bill', date: '2026-06-07', notes: null, created_at: '', category: MOCK_CATEGORIES[1] },
  { id: '3', household_id: 'demo', created_by: 'me', category_id: '3', amount: 55.00, currency: 'USD', description: 'Netflix & Spotify', date: '2026-06-06', notes: null, created_at: '', category: MOCK_CATEGORIES[2] },
  { id: '4', household_id: 'demo', created_by: 'me', category_id: '4', amount: 240.00, currency: 'USD', description: 'Car insurance', date: '2026-06-05', notes: null, created_at: '', category: MOCK_CATEGORIES[3] },
  { id: '5', household_id: 'demo', created_by: 'partner', category_id: '5', amount: 78.20, currency: 'USD', description: 'Gas station', date: '2026-06-04', notes: null, created_at: '', category: MOCK_CATEGORIES[4] },
  { id: '6', household_id: 'demo', created_by: 'me', category_id: '6', amount: 1800, currency: 'USD', description: 'Monthly rent', date: '2026-06-01', notes: null, created_at: '', category: MOCK_CATEGORIES[5] },
  { id: '7', household_id: 'demo', created_by: 'partner', category_id: '1', amount: 95.40, currency: 'USD', description: 'Restaurant dinner', date: '2026-06-03', notes: 'Anniversary dinner', created_at: '', category: MOCK_CATEGORIES[0] },
  { id: '8', household_id: 'demo', created_by: 'me', category_id: '7', amount: 45.00, currency: 'USD', description: 'Pharmacy', date: '2026-06-02', notes: null, created_at: '', category: MOCK_CATEGORIES[6] },
]

export default function ExpensesPage() {
  const { profile } = useAuth()
  const householdId = profile?.household_id
  const currency = (profile?.currency as Currency) ?? 'USD'
  const { toast } = useToast()
  const [addOpen, setAddOpen] = useState(false)
  const [addLoading, setAddLoading] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth().toString())
  const [selectedYear] = useState(getCurrentYear())

  const { expenses, totalExpenses, addExpense, deleteExpense } = useExpenses(householdId, parseInt(selectedMonth), selectedYear)
  const { categories } = useBudget(householdId, parseInt(selectedMonth), selectedYear)

  const isDemo = !householdId
  const displayExpenses = isDemo ? MOCK_EXPENSES : expenses
  const displayTotal = isDemo ? displayExpenses.reduce((s, e) => s + e.amount, 0) : totalExpenses
  const displayCategories = isDemo ? MOCK_CATEGORIES : (categories.length > 0 ? categories : MOCK_CATEGORIES)

  const categorySummary = displayExpenses.reduce((acc, e) => {
    const catName = e.category?.name ?? 'Other'
    acc[catName] = { amount: (acc[catName]?.amount ?? 0) + e.amount, icon: e.category?.icon ?? '📌', color: e.category?.color ?? '#64748b' }
    return acc
  }, {} as Record<string, { amount: number; icon: string; color: string }>)

  const handleAdd = async (data: { description: string; amount: string; category_id: string; date: string; currency: string; notes?: string }) => {
    if (!householdId || !profile) {
      toast({ title: 'Demo mode', description: 'Connect Supabase to add real data.' })
      setAddOpen(false)
      return
    }
    setAddLoading(true)
    const { error } = await addExpense({
      household_id: householdId,
      created_by: profile.id,
      description: data.description,
      amount: parseFloat(data.amount),
      category_id: data.category_id,
      date: data.date,
      currency: data.currency as Currency,
      notes: data.notes ?? null,
    })
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' })
    } else {
      toast({ title: 'Expense added!' })
      setAddOpen(false)
    }
    setAddLoading(false)
  }

  const months = Array.from({ length: 12 }, (_, i) => ({ value: (i + 1).toString(), label: getFullMonthName(i + 1) }))

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Expenses</h1>
          <p className="text-slate-400 text-sm mt-1">Track where your money goes</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-36 bg-slate-800 border-slate-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {months.map(m => (
                <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogTrigger asChild>
              <Button className="bg-indigo-600 hover:bg-indigo-700 gap-2">
                <PlusCircle className="w-4 h-4" />
                Add Expense
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-slate-800 max-w-lg">
              <DialogHeader>
                <DialogTitle>Add New Expense</DialogTitle>
              </DialogHeader>
              <ExpenseForm
                categories={displayCategories}
                onSubmit={handleAdd}
                onCancel={() => setAddOpen(false)}
                loading={addLoading}
                defaultCurrency={currency}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Total */}
      <Card className="bg-slate-900 border-slate-800">
        <CardContent className="p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-pink-600/20 rounded-xl flex items-center justify-center">
              <Receipt className="w-6 h-6 text-pink-400" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">{getFullMonthName(parseInt(selectedMonth))} Total Expenses</p>
              <p className="text-white font-bold text-3xl">{formatCurrency(displayTotal, currency)}</p>
              <p className="text-slate-500 text-xs mt-0.5">{displayExpenses.length} transactions</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Summary */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-base text-slate-300">By Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(categorySummary)
                .sort(([, a], [, b]) => b.amount - a.amount)
                .slice(0, 8)
                .map(([name, data]) => (
                  <div key={name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{data.icon}</span>
                      <span className="text-slate-300 text-sm">{name}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-white text-sm font-medium">{formatCurrency(data.amount, currency)}</p>
                      <div className="h-1 w-24 bg-slate-700 rounded-full mt-1">
                        <div
                          className="h-1 rounded-full"
                          style={{
                            width: `${(data.amount / displayTotal) * 100}%`,
                            backgroundColor: data.color,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Expense List */}
        <Card className="bg-slate-900 border-slate-800 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base text-slate-300">All Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <ExpenseList
              expenses={displayExpenses}
              onDelete={isDemo ? () => {} : deleteExpense}
              currentUserId={isDemo ? 'me' : (profile?.id ?? '')}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
