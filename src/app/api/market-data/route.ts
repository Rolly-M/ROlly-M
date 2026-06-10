import { NextResponse } from 'next/server'
import { HARDCODED_ETF_DATA, FINANCIAL_INSIGHTS, fetchETFData } from '@/lib/api/market-data'
import { ETFData } from '@/types'

export async function GET() {
  const etfs: ETFData[] = [...HARDCODED_ETF_DATA]

  // Try to enrich with live data if API key is available
  const apiKey = process.env.ALPHA_VANTAGE_API_KEY
  if (apiKey && apiKey !== 'your_alpha_vantage_key') {
    // Only fetch a few to avoid rate limits on free tier (5/min)
    const tickers = ['VYM', 'SCHD']
    const liveDataPromises = tickers.map(ticker => fetchETFData(ticker))
    const liveResults = await Promise.allSettled(liveDataPromises)

    liveResults.forEach((result, index) => {
      if (result.status === 'fulfilled' && result.value) {
        const ticker = tickers[index]
        const etfIndex = etfs.findIndex(e => e.ticker === ticker)
        if (etfIndex >= 0) {
          etfs[etfIndex] = { ...etfs[etfIndex], ...result.value }
        }
      }
    })
  }

  return NextResponse.json({
    etfs,
    insights: FINANCIAL_INSIGHTS,
    lastUpdated: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
    source: apiKey && apiKey !== 'your_alpha_vantage_key' ? 'hybrid' : 'static',
  })
}
