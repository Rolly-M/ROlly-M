'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { SpendingChart } from '@/components/dashboard/SpendingChart'
import { IncomeExpenseChart } from '@/components/dashboard/IncomeExpenseChart'
import { GoalProgressCard } from '@/components/dashboard/GoalProgressCard'
import { SavingsRateCard } from '@/components/dashboard/SavingsRateCard'
import { ExpenseList } from '@/components/expenses/ExpenseList'
import { ExpenseForm } from '@/components/expenses/ExpenseForm'
import { useAuth } from '@/hooks/useAuth'
import { useIncome } from '@/hooks/useIncome'
import { useExpenses } from '@/hooks/useExpenses'
import { useBudget } from '@/hooks/useBudget'
import { useGoals } from '@/hooks/useGoals'
import { formatCurrency, getCurrentMonth, getCurrentYear, getMonthName } from '@/lib/utils'
import { Currency, InvestmentGoal, Expense, ExpenseCategory } from '@/types'
import { TrendingUp, TrendingDown, PlusCircle, DollarSign, Receipt, Target, PiggyBank } from 'lucide-react'
import Link from 'next/link'

// Mock data for demo/initial state
const MOCK_GOALS: InvestmentGoal[] = [
  { id: '1', household_id: 'demo', created_by: 'demo', name: 'Emergency Fund', description: '6 months of expenses', target_amount: 15000, current_amount: 8500, currency: 'USD', deadline: '2026-12-31', status: 'active', created_at: '' },
  { id: '2', household_id: 'demo', created_by: 'demo', name: 'House Down Payment', description: null, target_amount: 50000, current_amount: 18500, currency: 'USD', deadline: '2027-06-30', status: 'active', created_at: '' },
  { id: '3', household_id: 'demo', created_by: 'demo', name: 'Vacation Fund', description: 'Europe trip', target_amount: 5000, current_amount: 2200, currency: 'USD', deadline: '2026-08-15', status: 'active', created_at: '' },
]

const MOCK_EXPENSES: Expense[] = [
  { id: '1', household_id: 'demo', created_by: 'demo', category_id: '1', amount: 142.50, currency: 'USD', description: 'Weekly groceries', date: '2026-06-08', notes: null, created_at: '', category: { id: '1', name: 'Food & Dining', icon: '🍽️', color: '#f59e0b', is_default: true, household_id: null } },
  { id: '2', household_id: 'demo', created_by: 'partner', category_id: '2', amount: 89.99, currency: 'USD', description: 'Electric bill', date: '2026-06-07', notes: null, created_at: '', category: { id: '2', name: 'Utilities', icon: '⚡', color: '#3b82f6', is_default: true, household_id: null } },
  { id: '3', household_id: 'demo', created_by: 'demo', category_id: '3', amount: 55.00, currency: 'USD', description: 'Netflix & Spotify', date: '2026-06-06', notes: null, created_at: '', category: { id: '3', name: 'Entertainment', icon: '🎬', color: '#8b5cf6', is_default: true, household_id: null } },
  { id: '4', household_id: 'demo', created_by: 'demo', category_id: '4', amount: 240.00, currency: 'USD', description: 'Car insurance', date: '2026-06-05', notes: null, created_at: '', category: { id: '4', name: 'Insurance', icon: '🛡️', color: '#10b981', is_default: true, household_id: null } },
  { id: '5', household_id: 'demo', created_by: 'partner', category_id: '5', amount: 78.20, currency: 'USD', description: 'Gas station', date: '2026-06-04', notes: null, created_at: '', category: { id: '5', name: 'Transportation', icon: '🚗', color: '#6366f1', is_default: true, household_id: null } },
]

const MOCK_CHART_DATA = [
  { month: 'Jan', income: 8200, expenses: 5800 },
  { month: 'Feb', income: 8200, expenses: 6100 },
  { month: 'Mar', income: 8500, expenses: 5600 },
  { month: 'Apr', income: 8500, expenses: 6300 },
  { month: 'May', income: 9000, expenses: 5900 },
  { month: 'Jun', income: 9000, expenses: 5780 },
]

const MOCK_CATEGORY_DATA = [
  { name: 'Housing', value: 1800, color: '#6366f1' },
  { name: 'Food', value: 620, color: '#f59e0b' },
  { name: 'Transport', value: 380, color: '#10b981' },
  { name: 'Utilities', value: 220, color: '#3b82f6' },
  { name: 'Entertainment', value: 180, color: '#8b5cf6' },
  { name: 'Other', value: 580, color: '#ec4899' },
]

const MOCK_CATEGORIES: ExpenseCategory[] = [
  { id: '1', name: 'Food & Dining', icon: '🍽️', color: '#f59e0b', is_default: true, household_id: null },
  { id: '2', name: 'Utilities', icon: '⚡', color: '#3b82f6', is_default: true, household_id: null },
  { id: '3', name: 'Entertainment', icon: '🎬', color: '#8b5cf6', is_default: true, household_id: null },
  { id: '4', name: 'Insurance', icon: '🛡️', color: '#10b981', is_default: true, household_id: null },
  { id: '5', name: 'Transportation', icon: '🚗', color: '#6366f1', is_default: true, household_id: null },
  { id: '6', name: 'Housing', icon: '🏠', color: '#ec4899', is_default: true, household_id: null },
  { id: '7', name: 'Healthcare', icon: '💊', color: '#14b8a6', is_default: true, household_id: null },
  { id: '8', name: 'Shopping', icon: '🛍️', color: '#f97316', is_default: true, household_id: null },
]

export default function DashboardPage() {
  const { profile } = useAuth()
  const householdId = profile?.household_id
  const currency = (profile?.currency as Currency) ?? 'USD'
  const currentMonth = getCurrentMonth()
  const currentYear = getCurrentYear()

  const [addExpenseOpen, setAddExpenseOpen] = useState(false)
  const [addExpenseLoading, setAddExpenseLoading] = useState(false)

  const { totalMonthlyIncome } = useIncome(householdId)
  const { expenses, totalExpenses, addExpense } = useExpenses(householdId, currentMonth, currentYear)
  const { budgets } = useBudget(householdId, currentMonth, currentYear)
  const { goals } = useGoals(householdId)

  // Use real data if available, fallback to mock
  const isDemo = !householdId
  const displayIncome = isDemo ? 9000 : totalMonthlyIncome
  const displayExpenses = isDemo ? 5780 : totalExpenses
  const displayGoals = isDemo ? MOCK_GOALS : goals.filter(g => g.status === 'active').slice(0, 3)
  const displayExpenseList = isDemo ? MOCK_EXPENSES : expenses.slice(0, 5)

  const netSavings = displayIncome - displayExpenses
  const savingsRate = displayIncome > 0 ? (netSavings / displayIncome) * 100 : 0

  const totalBudget = isDemo ? 7000 : budgets.reduce((sum, b) => sum + b.amount, 0)
  const budgetUtilization = totalBudget > 0 ? (displayExpenses / totalBudget) * 100 : 0

  const handleAddExpense = async (data: { description: string; amount: string; category_id: string; date: string; currency: string; notes?: string }) => {
    if (!householdId || !profile) return
    setAddExpenseLoading(true)
    await addExpense({
      household_id: householdId,
      created_by: profile.id,
      description: data.description,
      amount: parseFloat(data.amount),
      category_id: data.category_id,
      date: data.date,
      currency: data.currency as Currency,
      notes: data.notes ?? null,
    })
    setAddExpenseLoading(false)
    setAddExpenseOpen(false)
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            {profile?.full_name ? `Hey, ${profile.full_name.split(' ')[0]}` : 'Dashboard'}
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            {getMonthName(currentMonth)} {currentYear} · Financial Overview
            {isDemo && <span className="ml-2 text-indigo-400">(Demo Mode)</span>}
          </p>
        </div>
        <Dialog open={addExpenseOpen} onOpenChange={setAddExpenseOpen}>
          <DialogTrigger asChild>
            <Button className="bg-indigo-600 hover:bg-indigo-700 gap-2">
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Add Expense</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-900 border-slate-800 max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Expense</DialogTitle>
            </DialogHeader>
            <ExpenseForm
              categories={MOCK_CATEGORIES}
              onSubmit={handleAddExpense}
              onCancel={() => setAddExpenseOpen(false)}
              loading={addExpenseLoading}
              defaultCurrency={currency}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-green-600/20 rounded-lg flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-green-400" />
              </div>
              <div>
                <p className="text-slate-400 text-xs">Monthly Income</p>
                <p className="text-white font-bold text-lg">{formatCurrency(displayIncome, currency)}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2 text-xs text-green-400">
              <TrendingUp className="w-3 h-3" />
              <span>+5.9% vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-pink-600/20 rounded-lg flex items-center justify-center">
                <Receipt className="w-4 h-4 text-pink-400" />
              </div>
              <div>
                <p className="text-slate-400 text-xs">Total Expenses</p>
                <p className="text-white font-bold text-lg">{formatCurrency(displayExpenses, currency)}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2 text-xs text-red-400">
              <TrendingDown className="w-3 h-3" />
              <span>-2.1% vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-indigo-600/20 rounded-lg flex items-center justify-center">
                <PiggyBank className="w-4 h-4 text-indigo-400" />
              </div>
              <div>
                <p className="text-slate-400 text-xs">Net Savings</p>
                <p className="text-white font-bold text-lg">{formatCurrency(netSavings, currency)}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2 text-xs text-indigo-400">
              <span>{savingsRate.toFixed(1)}% savings rate</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-yellow-600/20 rounded-lg flex items-center justify-center">
                <Target className="w-4 h-4 text-yellow-400" />
              </div>
              <div>
                <p className="text-slate-400 text-xs">Budget Used</p>
                <p className={`font-bold text-lg ${budgetUtilization > 90 ? 'text-red-400' : 'text-white'}`}>
                  {budgetUtilization.toFixed(0)}%
                </p>
              </div>
            </div>
            <div className="mt-2 h-1.5 bg-slate-700 rounded-full">
              <div
                className={`h-1.5 rounded-full ${budgetUtilization > 90 ? 'bg-red-500' : budgetUtilization > 75 ? 'bg-yellow-500' : 'bg-green-500'}`}
                style={{ width: `${Math.min(budgetUtilization, 100)}%` }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-slate-300">Income vs Expenses (6 months)</CardTitle>
          </CardHeader>
          <CardContent>
            <SpendingChart data={MOCK_CHART_DATA} currency={currency} />
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-slate-300">Spending by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <IncomeExpenseChart data={MOCK_CATEGORY_DATA} currency={currency} />
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Savings Rate */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-slate-300">This Month&apos;s Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <SavingsRateCard
              income={displayIncome}
              expenses={displayExpenses}
              currency={currency}
              lastMonthSavingsRate={27.5}
            />
          </CardContent>
        </Card>

        {/* Goals */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-base text-slate-300">Active Goals</CardTitle>
            <Link href="/goals" className="text-indigo-400 text-xs hover:text-indigo-300">View all</Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {displayGoals.map(goal => (
              <GoalProgressCard key={goal.id} goal={goal} />
            ))}
            {displayGoals.length === 0 && (
              <div className="text-center py-4 text-slate-500 text-sm">
                No active goals yet.{' '}
                <Link href="/goals" className="text-indigo-400 hover:underline">Create one</Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Expenses */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-base text-slate-300">Recent Expenses</CardTitle>
            <Link href="/expenses" className="text-indigo-400 text-xs hover:text-indigo-300">View all</Link>
          </CardHeader>
          <CardContent>
            <ExpenseList
              expenses={displayExpenseList}
              onDelete={() => {}}
              currentUserId={profile?.id ?? 'demo'}
              limit={5}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
