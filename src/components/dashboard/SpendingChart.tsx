'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { formatCurrency } from '@/lib/utils'
import { Currency } from '@/types'

interface SpendingData {
  month: string
  income: number
  expenses: number
}

interface SpendingChartProps {
  data: SpendingData[]
  currency: Currency
}

export function SpendingChart({ data, currency }: SpendingChartProps) {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
        <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 12 }} />
        <YAxis
          stroke="#64748b"
          tick={{ fontSize: 11 }}
          tickFormatter={v => formatCurrency(v, currency).replace(/\.\d+$/, '')}
        />
        <Tooltip
          contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
          labelStyle={{ color: '#f1f5f9' }}
          formatter={(value) => [formatCurrency(Number(value ?? 0), currency), '']}
        />
        <Legend wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }} />
        <Bar dataKey="income" fill="#6366f1" radius={[4, 4, 0, 0]} name="Income" />
        <Bar dataKey="expenses" fill="#ec4899" radius={[4, 4, 0, 0]} name="Expenses" />
      </BarChart>
    </ResponsiveContainer>
  )
}
