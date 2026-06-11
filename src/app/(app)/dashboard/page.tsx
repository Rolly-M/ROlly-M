'use client'

import { useState } from 'react'
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
import { Currency } from '@/types'
import { PlusCircle, Wallet, Receipt, Target, PiggyBank, ArrowRight, Sparkles } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const { profile } = useAuth()
  const householdId = profile?.household_id
  const currency = (profile?.currency as Currency) ?? 'USD'
  const currentMonth = getCurrentMonth()
  const currentYear = getCurrentYear()
  const firstName = profile?.full_name?.split(' ')[0] ?? 'there'

  const [addExpenseOpen, setAddExpenseOpen] = useState(false)
  const [addExpenseLoading, setAddExpenseLoading] = useState(false)

  const { totalMonthlyIncome } = useIncome(householdId)
  const { expenses, totalExpenses, addExpense, categories } = useExpenses(householdId, currentMonth, currentYear)
  const { budgets } = useBudget(householdId, currentMonth, currentYear)
  const { goals } = useGoals(householdId)

  const activeGoals = goals.filter(g => g.status === 'active').slice(0, 3)
  const recentExpenses = expenses.slice(0, 5)

  const netSavings = totalMonthlyIncome - totalExpenses
  const savingsRate = totalMonthlyIncome > 0 ? (netSavings / totalMonthlyIncome) * 100 : 0
  const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0)
  const budgetUtilization = totalBudget > 0 ? (totalExpenses / totalBudget) * 100 : 0

  // 6-month chart: current month with real data, prior months empty until data is loaded
  const chartData = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(currentYear, currentMonth - 1 - (5 - i), 1)
    const isCurrent = d.getMonth() + 1 === currentMonth && d.getFullYear() === currentYear
    return {
      month: d.toLocaleString('default', { month: 'short' }),
      income: isCurrent ? totalMonthlyIncome : 0,
      expenses: isCurrent ? totalExpenses : 0,
    }
  })

  // Category spending data for donut chart
  const categoryData = categories
    .map(cat => {
      const spent = expenses.filter(e => e.category_id === cat.id).reduce((s, e) => s + e.amount, 0)
      return { name: cat.name, value: spent, color: cat.color }
    })
    .filter(c => c.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, 6)

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

  const isEmpty = totalMonthlyIncome === 0 && totalExpenses === 0 && activeGoals.length === 0

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">
            Hey, {firstName} 👋
          </h2>
          <p className="text-sm mt-1" style={{ color: '#64748B' }}>
            {getMonthName(currentMonth)} {currentYear} · Financial Overview
          </p>
        </div>
        <Dialog open={addExpenseOpen} onOpenChange={setAddExpenseOpen}>
          <DialogTrigger asChild>
            <button className="btn-gradient inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold">
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Add Expense</span>
            </button>
          </DialogTrigger>
          <DialogContent className="rounded-2xl" style={{ background: '#0D1829', border: '1px solid rgba(255,255,255,0.1)' }}>
            <DialogHeader>
              <DialogTitle className="text-white">Add Expense</DialogTitle>
            </DialogHeader>
            <ExpenseForm
              categories={categories}
              onSubmit={handleAddExpense}
              onCancel={() => setAddExpenseOpen(false)}
              loading={addExpenseLoading}
              defaultCurrency={currency}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Empty state for new users */}
      {isEmpty && (
        <div className="rounded-3xl p-8 text-center"
          style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(168,85,247,0.15)' }}>
          <div className="w-14 h-14 rounded-2xl gradient-bg flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <h3 className="text-white font-bold text-lg mb-2">Welcome to CouplesBudget!</h3>
          <p className="text-slate-400 text-sm mb-6 max-w-md mx-auto">
            Your dashboard is empty — that&apos;s a good start. Add your income sources, set a budget, and invite your partner to begin tracking your finances together.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/income" className="btn-gradient inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold">
              Add Income <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/settings" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-slate-300"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
              Invite Partner
            </Link>
          </div>
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Monthly Income',  value: formatCurrency(totalMonthlyIncome, currency), icon: Wallet,   color: '#10B981', bg: 'rgba(16,185,129,0.1)',  trend: null },
          { label: 'Total Expenses',  value: formatCurrency(totalExpenses, currency),      icon: Receipt,  color: '#F43F5E', bg: 'rgba(244,63,94,0.1)',   trend: null },
          { label: 'Net Savings',     value: formatCurrency(netSavings, currency),          icon: PiggyBank,color: '#A855F7', bg: 'rgba(168,85,247,0.1)', trend: savingsRate > 0 ? `${savingsRate.toFixed(1)}% rate` : null },
          { label: 'Budget Used',     value: `${budgetUtilization.toFixed(0)}%`,            icon: Target,   color: budgetUtilization > 90 ? '#F43F5E' : '#F59E0B', bg: 'rgba(245,158,11,0.1)', trend: null },
        ].map(stat => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="glass rounded-2xl p-4 hover:bg-white/[0.06] transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: stat.bg }}>
                  <Icon className="w-4 h-4" style={{ color: stat.color }} />
                </div>
              </div>
              <p className="text-xs mb-1" style={{ color: '#64748B' }}>{stat.label}</p>
              <p className="text-xl font-bold text-white">{stat.value}</p>
              {stat.trend && (
                <p className="text-xs mt-1" style={{ color: stat.color }}>{stat.trend}</p>
              )}
              {stat.label === 'Budget Used' && totalBudget > 0 && (
                <div className="mt-2 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <div className="h-1 rounded-full transition-all" style={{
                    width: `${Math.min(budgetUtilization, 100)}%`,
                    background: budgetUtilization > 90 ? '#F43F5E' : '#F59E0B',
                  }} />
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="glass rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Income vs Expenses · 6 months</h3>
          {chartData.every(d => d.income === 0 && d.expenses === 0) ? (
            <div className="flex items-center justify-center h-40 text-slate-600 text-sm">
              No data yet — add income and expenses to see your trend
            </div>
          ) : (
            <SpendingChart data={chartData} currency={currency} />
          )}
        </div>

        <div className="glass rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Spending by Category</h3>
          {categoryData.length === 0 ? (
            <div className="flex items-center justify-center h-40 text-slate-600 text-sm">
              No expenses logged yet this month
            </div>
          ) : (
            <IncomeExpenseChart data={categoryData} currency={currency} />
          )}
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Summary */}
        <div className="glass rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4">This Month</h3>
          <SavingsRateCard income={totalMonthlyIncome} expenses={totalExpenses} currency={currency} lastMonthSavingsRate={0} />
        </div>

        {/* Goals */}
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">Active Goals</h3>
            <Link href="/goals" className="text-xs font-medium transition-colors" style={{ color: '#A855F7' }}>View all →</Link>
          </div>
          {activeGoals.length === 0 ? (
            <div className="text-center py-6">
              <Target className="w-8 h-8 mx-auto mb-2 text-slate-700" />
              <p className="text-slate-600 text-sm mb-3">No goals yet</p>
              <Link href="/goals" className="text-xs font-medium" style={{ color: '#A855F7' }}>Create your first goal →</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {activeGoals.map(goal => <GoalProgressCard key={goal.id} goal={goal} />)}
            </div>
          )}
        </div>

        {/* Recent expenses */}
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">Recent Expenses</h3>
            <Link href="/expenses" className="text-xs font-medium transition-colors" style={{ color: '#A855F7' }}>View all →</Link>
          </div>
          {recentExpenses.length === 0 ? (
            <div className="text-center py-6">
              <Receipt className="w-8 h-8 mx-auto mb-2 text-slate-700" />
              <p className="text-slate-600 text-sm mb-3">No expenses yet</p>
              <button onClick={() => setAddExpenseOpen(true)} className="text-xs font-medium" style={{ color: '#A855F7' }}>
                Add your first expense →
              </button>
            </div>
          ) : (
            <ExpenseList
              expenses={recentExpenses}
              onDelete={() => {}}
              currentUserId={profile?.id ?? ''}
              limit={5}
            />
          )}
        </div>
      </div>
    </div>
  )
}
