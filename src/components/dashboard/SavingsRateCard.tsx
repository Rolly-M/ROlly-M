'use client'

import { TrendingUp, TrendingDown } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { Currency } from '@/types'

interface SavingsRateCardProps {
  income: number
  expenses: number
  currency: Currency
  lastMonthSavingsRate?: number
}

export function SavingsRateCard({ income, expenses, currency, lastMonthSavingsRate }: SavingsRateCardProps) {
  const netSavings = income - expenses
  const savingsRate = income > 0 ? (netSavings / income) * 100 : 0
  const isPositive = savingsRate >= 0
  const rateDiff = lastMonthSavingsRate !== undefined ? savingsRate - lastMonthSavingsRate : undefined

  const getColor = () => {
    if (savingsRate >= 20) return 'text-green-400'
    if (savingsRate >= 10) return 'text-yellow-400'
    if (savingsRate >= 0) return 'text-orange-400'
    return 'text-red-400'
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-400 text-sm">Net Savings</p>
          <p className={`text-2xl font-bold ${isPositive ? 'text-white' : 'text-red-400'}`}>
            {formatCurrency(Math.abs(netSavings), currency)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-slate-400 text-sm">Savings Rate</p>
          <p className={`text-2xl font-bold ${getColor()}`}>
            {savingsRate.toFixed(1)}%
          </p>
        </div>
      </div>

      {rateDiff !== undefined && (
        <div className="flex items-center gap-1 text-sm">
          {rateDiff >= 0 ? (
            <TrendingUp className="w-4 h-4 text-green-400" />
          ) : (
            <TrendingDown className="w-4 h-4 text-red-400" />
          )}
          <span className={rateDiff >= 0 ? 'text-green-400' : 'text-red-400'}>
            {Math.abs(rateDiff).toFixed(1)}% vs last month
          </span>
        </div>
      )}

      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            savingsRate >= 20 ? 'bg-green-500' :
            savingsRate >= 10 ? 'bg-yellow-500' :
            savingsRate >= 0 ? 'bg-orange-500' : 'bg-red-500'
          }`}
          style={{ width: `${Math.max(0, Math.min(100, savingsRate))}%` }}
        />
      </div>

      <div className="grid grid-cols-2 gap-3 pt-1">
        <div className="bg-slate-800 rounded-lg p-3">
          <p className="text-slate-400 text-xs mb-1">Income</p>
          <p className="text-green-400 font-semibold text-sm">{formatCurrency(income, currency)}</p>
        </div>
        <div className="bg-slate-800 rounded-lg p-3">
          <p className="text-slate-400 text-xs mb-1">Expenses</p>
          <p className="text-pink-400 font-semibold text-sm">{formatCurrency(expenses, currency)}</p>
        </div>
      </div>
    </div>
  )
}
