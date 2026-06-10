'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ETFCard } from '@/components/investments/ETFCard'
import { FinancialInsights } from '@/components/investments/FinancialInsights'
import { ETFData, FinancialInsight } from '@/types'
import { TrendingUp, BookOpen, AlertCircle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function InvestmentsPage() {
  const [etfs, setEtfs] = useState<ETFData[]>([])
  const [insights, setInsights] = useState<FinancialInsight[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<string>('')

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/market-data')
      const data = await res.json()
      setEtfs(data.etfs ?? [])
      setInsights(data.insights ?? [])
      setLastUpdated(data.lastUpdated ?? '')
    } catch {
      // Use empty arrays if fetch fails
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Investments</h1>
          <p className="text-slate-400 text-sm mt-1">High Dividend Growth ETFs & Market Insights</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={fetchData}
          disabled={loading}
          className="text-slate-400 hover:text-white gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Disclaimer */}
      <div className="bg-yellow-950/30 border border-yellow-800/50 rounded-lg p-4 flex items-start gap-3">
        <AlertCircle className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
        <p className="text-yellow-200/80 text-xs">
          <span className="font-semibold">Disclaimer:</span> The information on this page is for educational purposes only and does not constitute financial advice. Past performance is not indicative of future results. Always do your own research before investing.
        </p>
      </div>

      {/* ETF Grid */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-indigo-400" />
          <h2 className="text-lg font-semibold text-white">Top High Dividend Growth ETFs</h2>
          {lastUpdated && <span className="text-slate-500 text-xs ml-auto">Updated: {lastUpdated}</span>}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-slate-800 rounded-xl h-52 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {etfs.map(etf => (
              <ETFCard key={etf.ticker} etf={etf} />
            ))}
          </div>
        )}
      </div>

      {/* Why ETFs section */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-400" />
            <CardTitle className="text-base text-slate-300">Why Dividend ETFs for Couples?</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="text-white font-semibold text-sm mb-1">Diversification in One Click</h4>
                <p className="text-slate-400 text-sm">ETFs hold hundreds of stocks, providing instant diversification without requiring you to pick individual winners. Lower risk, broader exposure.</p>
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm mb-1">Passive Income Stream</h4>
                <p className="text-slate-400 text-sm">Dividend ETFs pay regular income (quarterly or monthly), which can supplement your household income or be reinvested to compound your wealth.</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="text-white font-semibold text-sm mb-1">Ultra-Low Costs</h4>
                <p className="text-slate-400 text-sm">Many top dividend ETFs (VYM, SCHD, VIG) charge only 0.06% per year — that&apos;s $6 per $10,000 invested, vs 1-2% for actively managed funds.</p>
              </div>
              <div>
                <h4 className="text-white font-semibold text-sm mb-1">Tax Efficiency</h4>
                <p className="text-slate-400 text-sm">Qualified dividends from ETFs are taxed at preferential rates. Holding in tax-advantaged accounts (IRA, 401k) maximizes after-tax returns for your household.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Financial Insights */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-5 h-5 text-indigo-400" />
          <h2 className="text-lg font-semibold text-white">Financial Insights</h2>
        </div>
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-slate-800 rounded-xl h-28 animate-pulse" />
            ))}
          </div>
        ) : (
          <FinancialInsights insights={insights} />
        )}
      </div>
    </div>
  )
}
