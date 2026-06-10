'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/hooks/useAuth'
import { useBudget } from '@/hooks/useBudget'
import { useExpenses } from '@/hooks/useExpenses'
import { formatCurrency, getCurrentMonth, getCurrentYear, getFullMonthName } from '@/lib/utils'
import { Currency, ExpenseCategory } from '@/types'
import { PiggyBank, AlertTriangle, CheckCircle, Save } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const MOCK_CATEGORIES: ExpenseCategory[] = [
  { id: '1', name: 'Housing', icon: '🏠', color: '#ec4899', is_default: true, household_id: null },
  { id: '2', name: 'Food & Dining', icon: '🍽️', color: '#f59e0b', is_default: true, household_id: null },
  { id: '3', name: 'Transportation', icon: '🚗', color: '#6366f1', is_default: true, household_id: null },
  { id: '4', name: 'Utilities', icon: '⚡', color: '#3b82f6', is_default: true, household_id: null },
  { id: '5', name: 'Entertainment', icon: '🎬', color: '#8b5cf6', is_default: true, household_id: null },
  { id: '6', name: 'Healthcare', icon: '💊', color: '#14b8a6', is_default: true, household_id: null },
  { id: '7', name: 'Shopping', icon: '🛍️', color: '#f97316', is_default: true, household_id: null },
  { id: '8', name: 'Insurance', icon: '🛡️', color: '#10b981', is_default: true, household_id: null },
  { id: '9', name: 'Education', icon: '📚', color: '#06b6d4', is_default: true, household_id: null },
  { id: '10', name: 'Personal Care', icon: '💅', color: '#f43f5e', is_default: true, household_id: null },
  { id: '11', name: 'Travel', icon: '✈️', color: '#84cc16', is_default: true, household_id: null },
  { id: '12', name: 'Savings', icon: '💰', color: '#a855f7', is_default: true, household_id: null },
  { id: '13', name: 'Gifts', icon: '🎁', color: '#fb923c', is_default: true, household_id: null },
  { id: '14', name: 'Other', icon: '📌', color: '#64748b', is_default: true, household_id: null },
]

const MOCK_BUDGETS: Record<string, number> = {
  '1': 1900, '2': 800, '3': 500, '4': 200, '5': 200,
  '6': 150, '7': 300, '8': 250, '9': 100, '10': 100,
  '11': 300, '12': 400, '13': 100, '14': 200,
}

const MOCK_ACTUALS: Record<string, number> = {
  '1': 1800, '2': 637.90, '3': 78.20, '4': 89.99, '5': 55.00,
  '6': 45.00, '7': 0, '8': 240, '9': 0, '10': 0,
  '11': 0, '12': 0, '13': 0, '14': 0,
}

export default function BudgetPage() {
  const { profile } = useAuth()
  const householdId = profile?.household_id
  const currency = (profile?.currency as Currency) ?? 'USD'
  const { toast } = useToast()
  const currentMonth = getCurrentMonth()
  const currentYear = getCurrentYear()

  const { budgets, categories, upsertBudget } = useBudget(householdId, currentMonth, currentYear)
  const { expensesByCategory } = useExpenses(householdId, currentMonth, currentYear)

  const isDemo = !householdId
  const displayCategories = isDemo ? MOCK_CATEGORIES : (categories.length > 0 ? categories : MOCK_CATEGORIES)

  const [editBudgets, setEditBudgets] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)

  const getBudgetAmount = (catId: string): number => {
    if (isDemo) return MOCK_BUDGETS[catId] ?? 0
    const budget = budgets.find(b => b.category_id === catId)
    return budget?.amount ?? 0
  }

  const getActualAmount = (catName: string): number => {
    if (isDemo) {
      const cat = MOCK_CATEGORIES.find(c => c.name === catName)
      return cat ? MOCK_ACTUALS[cat.id] ?? 0 : 0
    }
    return expensesByCategory[catName] ?? 0
  }

  const handleSaveBudget = async (catId: string) => {
    if (isDemo) {
      toast({ title: 'Demo mode', description: 'Connect Supabase to save budgets.' })
      return
    }
    const amount = parseFloat(editBudgets[catId] ?? '0')
    if (isNaN(amount)) return
    setSaving(true)
    const { error } = await upsertBudget(catId, amount, currency)
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' })
    } else {
      toast({ title: 'Budget updated!' })
      setEditBudgets(prev => {
        const next = { ...prev }
        delete next[catId]
        return next
      })
    }
    setSaving(false)
  }

  const totalBudget = displayCategories.reduce((sum, cat) => sum + getBudgetAmount(cat.id), 0)
  const totalActual = displayCategories.reduce((sum, cat) => sum + getActualAmount(cat.name), 0)
  const overBudgetCategories = displayCategories.filter(cat => getActualAmount(cat.name) > getBudgetAmount(cat.id) && getBudgetAmount(cat.id) > 0)

  const chartData = displayCategories
    .filter(cat => getBudgetAmount(cat.id) > 0 || getActualAmount(cat.name) > 0)
    .map(cat => ({
      name: cat.icon + ' ' + cat.name.split(' ')[0],
      budget: getBudgetAmount(cat.id),
      actual: getActualAmount(cat.name),
      color: cat.color,
    }))

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white">Budget</h1>
        <p className="text-slate-400 text-sm mt-1">{getFullMonthName(currentMonth)} {currentYear}</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-2">
              <PiggyBank className="w-5 h-5 text-indigo-400" />
              <p className="text-slate-400 text-sm">Total Budget</p>
            </div>
            <p className="text-white font-bold text-2xl">{formatCurrency(totalBudget, currency)}</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <p className="text-slate-400 text-sm">Total Spent</p>
            </div>
            <p className="text-white font-bold text-2xl">{formatCurrency(totalActual, currency)}</p>
            <p className="text-slate-500 text-xs mt-1">{totalBudget > 0 ? ((totalActual / totalBudget) * 100).toFixed(0) : 0}% of budget</p>
          </CardContent>
        </Card>
        <Card className={`border-slate-800 ${overBudgetCategories.length > 0 ? 'bg-red-950/30' : 'bg-slate-900'}`}>
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-2">
              <AlertTriangle className={`w-5 h-5 ${overBudgetCategories.length > 0 ? 'text-red-400' : 'text-slate-500'}`} />
              <p className="text-slate-400 text-sm">Over Budget</p>
            </div>
            <p className={`font-bold text-2xl ${overBudgetCategories.length > 0 ? 'text-red-400' : 'text-white'}`}>
              {overBudgetCategories.length} {overBudgetCategories.length === 1 ? 'category' : 'categories'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-base text-slate-300">Budget vs Actual</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 10 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 10 }} tickFormatter={v => `$${v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v}`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                formatter={(value) => [formatCurrency(Number(value ?? 0), currency), '']}
              />
              <Bar dataKey="budget" name="Budget" fill="#6366f1" radius={[3, 3, 0, 0]} opacity={0.5} />
              <Bar dataKey="actual" name="Actual" radius={[3, 3, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={entry.actual > entry.budget ? '#ef4444' : '#22c55e'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Category Budgets */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-base text-slate-300">Category Budgets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {displayCategories.map(cat => {
              const budgetAmount = getBudgetAmount(cat.id)
              const actualAmount = getActualAmount(cat.name)
              const percentage = budgetAmount > 0 ? Math.min((actualAmount / budgetAmount) * 100, 100) : 0
              const isOverBudget = actualAmount > budgetAmount && budgetAmount > 0
              const editValue = editBudgets[cat.id]
              const displayBudget = editValue !== undefined ? editValue : budgetAmount.toString()

              return (
                <div key={cat.id} className={`p-4 rounded-lg border ${isOverBudget ? 'bg-red-950/20 border-red-800/50' : 'bg-slate-800 border-slate-700'}`}>
                  <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{cat.icon}</span>
                      <span className="text-white font-medium text-sm">{cat.name}</span>
                      {isOverBudget && (
                        <span className="text-red-400 text-xs flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          Over by {formatCurrency(actualAmount - budgetAmount, currency)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 text-sm">{formatCurrency(actualAmount, currency)} spent</span>
                      <span className="text-slate-600">/</span>
                      <div className="flex items-center gap-1">
                        <span className="text-slate-400 text-sm">{currency === 'USD' ? '$' : ''}</span>
                        <Input
                          type="number"
                          value={displayBudget}
                          onChange={e => setEditBudgets(prev => ({ ...prev, [cat.id]: e.target.value }))}
                          className="w-24 h-7 text-sm bg-slate-700 border-slate-600 text-white py-0 px-2"
                          min="0"
                        />
                        {editBudgets[cat.id] !== undefined && (
                          <Button
                            size="sm"
                            onClick={() => handleSaveBudget(cat.id)}
                            disabled={saving}
                            className="h-7 w-7 p-0 bg-green-600 hover:bg-green-700"
                          >
                            <Save className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  {budgetAmount > 0 ? (
                    <div className="space-y-1">
                      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${isOverBudget ? 'bg-red-500' : percentage > 80 ? 'bg-yellow-500' : 'bg-indigo-500'}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-slate-500">
                        <span>{percentage.toFixed(0)}% used</span>
                        <span>{formatCurrency(Math.max(0, budgetAmount - actualAmount), currency)} remaining</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-slate-600 text-xs">No budget set — enter an amount above</p>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
