'use client'

import { ETFData } from '@/types'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface ETFCardProps {
  etf: ETFData
}

export function ETFCard({ etf }: ETFCardProps) {
  const isPositiveReturn = etf.oneYearReturn >= 0

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-5 hover:border-indigo-600/50 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-indigo-400 font-bold text-lg">{etf.ticker}</span>
            <Badge variant="secondary" className="text-xs">ETF</Badge>
          </div>
          <p className="text-slate-300 text-sm mt-0.5 font-medium">{etf.name}</p>
        </div>
        <div className="text-right">
          <p className="text-white font-bold text-xl">${etf.price.toFixed(2)}</p>
          <div className={`flex items-center gap-1 justify-end text-sm ${isPositiveReturn ? 'text-green-400' : 'text-red-400'}`}>
            {isPositiveReturn ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            <span>{isPositiveReturn ? '+' : ''}{etf.oneYearReturn.toFixed(2)}% (1yr)</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-slate-900 rounded-lg p-2.5">
          <p className="text-slate-500 text-xs mb-1">Div. Yield</p>
          <p className="text-green-400 font-semibold text-sm">{etf.dividendYield.toFixed(2)}%</p>
        </div>
        <div className="bg-slate-900 rounded-lg p-2.5">
          <p className="text-slate-500 text-xs mb-1">Expense</p>
          <p className="text-white font-semibold text-sm">{etf.expenseRatio.toFixed(2)}%</p>
        </div>
        <div className="bg-slate-900 rounded-lg p-2.5">
          <p className="text-slate-500 text-xs mb-1">AUM</p>
          <p className="text-white font-semibold text-sm">{etf.aum}</p>
        </div>
      </div>

      <p className="text-slate-500 text-xs leading-relaxed">{etf.description}</p>
    </div>
  )
}
