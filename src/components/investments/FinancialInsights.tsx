'use client'

import { FinancialInsight } from '@/types'
import { Lightbulb, TrendingUp, BarChart2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'

const insightIcons = {
  tip: Lightbulb,
  news: TrendingUp,
  analysis: BarChart2,
}

const insightColors = {
  tip: 'text-yellow-400',
  news: 'text-blue-400',
  analysis: 'text-purple-400',
}

interface FinancialInsightsProps {
  insights: FinancialInsight[]
}

export function FinancialInsights({ insights }: FinancialInsightsProps) {
  return (
    <div className="space-y-4">
      {insights.map((insight, index) => {
        const Icon = insightIcons[insight.type]
        const colorClass = insightColors[insight.type]

        return (
          <div key={index} className="bg-slate-800 rounded-xl border border-slate-700 p-5">
            <div className="flex items-start gap-3">
              <div className={`w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center shrink-0 ${colorClass}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <h4 className="text-white font-semibold text-sm">{insight.title}</h4>
                  <Badge variant="outline" className={`text-xs capitalize border-current ${colorClass}`}>
                    {insight.type}
                  </Badge>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed">{insight.content}</p>
                <p className="text-slate-600 text-xs mt-2">
                  {format(new Date(insight.date), 'MMM d, yyyy')}
                </p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
