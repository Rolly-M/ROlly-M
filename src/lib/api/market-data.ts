import { ETFData, FinancialInsight } from '@/types'

export const HARDCODED_ETF_DATA: ETFData[] = [
  {
    ticker: 'VYM',
    name: 'Vanguard High Dividend Yield ETF',
    price: 118.45,
    dividendYield: 2.98,
    expenseRatio: 0.06,
    oneYearReturn: 12.3,
    aum: '$52.1B',
    description: 'Tracks the FTSE High Dividend Yield Index. Focuses on large-cap US stocks with high dividend yields, excluding REITs.',
  },
  {
    ticker: 'SCHD',
    name: 'Schwab US Dividend Equity ETF',
    price: 82.17,
    dividendYield: 3.45,
    expenseRatio: 0.06,
    oneYearReturn: 14.8,
    aum: '$56.8B',
    description: 'Tracks the Dow Jones US Dividend 100 Index. Focuses on high-quality dividend payers with strong fundamentals.',
  },
  {
    ticker: 'DVY',
    name: 'iShares Select Dividend ETF',
    price: 124.32,
    dividendYield: 4.12,
    expenseRatio: 0.38,
    oneYearReturn: 8.7,
    aum: '$19.4B',
    description: 'Tracks a dividend-weighted index of 100 US stocks with high dividend yields, offering income-focused exposure.',
  },
  {
    ticker: 'VIG',
    name: 'Vanguard Dividend Appreciation ETF',
    price: 185.67,
    dividendYield: 1.78,
    expenseRatio: 0.06,
    oneYearReturn: 16.2,
    aum: '$87.3B',
    description: 'Tracks the S&P US Dividend Growers Index. Focuses on companies with 10+ consecutive years of dividend increases.',
  },
  {
    ticker: 'DGRO',
    name: 'iShares Core Dividend Growth ETF',
    price: 57.89,
    dividendYield: 2.31,
    expenseRatio: 0.08,
    oneYearReturn: 15.1,
    aum: '$26.7B',
    description: 'Tracks the Morningstar US Dividend Growth Index. Selects stocks with consistent dividend growth and quality fundamentals.',
  },
  {
    ticker: 'JEPI',
    name: 'JPMorgan Equity Premium Income ETF',
    price: 57.23,
    dividendYield: 7.89,
    expenseRatio: 0.35,
    oneYearReturn: 9.4,
    aum: '$34.2B',
    description: 'Generates income through covered call options on S&P 500 stocks. Offers high monthly income with lower volatility.',
  },
  {
    ticker: 'HDV',
    name: 'iShares High Dividend ETF',
    price: 112.45,
    dividendYield: 3.67,
    expenseRatio: 0.08,
    oneYearReturn: 7.9,
    aum: '$10.8B',
    description: 'Tracks the Morningstar Dividend Yield Focus Index. Focuses on financially healthy companies with above-average dividends.',
  },
  {
    ticker: 'SPHD',
    name: 'Invesco S&P 500 High Dividend Low Volatility ETF',
    price: 44.12,
    dividendYield: 4.23,
    expenseRatio: 0.30,
    oneYearReturn: 6.8,
    aum: '$3.9B',
    description: 'Tracks the S&P 500 Low Volatility High Dividend Index. Combines high dividend yield with low price volatility.',
  },
]

export const FINANCIAL_INSIGHTS: FinancialInsight[] = [
  {
    title: 'Dividend Investing: Building Passive Income',
    content: 'High-quality dividend ETFs can provide a reliable income stream that grows over time. Companies that consistently increase dividends typically have strong cash flows and disciplined management. SCHD and VIG have delivered 10%+ annual dividend growth over the past decade.',
    type: 'tip',
    date: '2026-06-10',
  },
  {
    title: 'The Power of Compound Dividends',
    content: 'Reinvesting dividends can dramatically accelerate wealth building. A $10,000 investment in a 3.5% dividend ETF, with dividends reinvested and 8% annual growth, becomes approximately $74,000 over 20 years — compared to $46,000 without reinvestment.',
    type: 'analysis',
    date: '2026-06-09',
  },
  {
    title: 'Low-Cost Funds Outperform Over Time',
    content: 'Expense ratios matter more than most investors realize. A fund with a 0.06% expense ratio versus 1% can result in tens of thousands of dollars in additional returns over a 30-year horizon. VYM and SCHD\'s ultra-low 0.06% fees make them particularly attractive for long-term holders.',
    type: 'tip',
    date: '2026-06-08',
  },
  {
    title: 'Covered Call ETFs: Income vs Growth Tradeoff',
    content: 'JEPI and similar covered call ETFs offer exceptional current income (7-9% yield) but cap upside potential. They shine in flat or declining markets but underperform pure equity ETFs in strong bull markets. Best used as a defensive income allocation for near-retirees or those seeking cash flow.',
    type: 'analysis',
    date: '2026-06-07',
  },
]

export async function fetchETFData(ticker: string): Promise<Partial<ETFData> | null> {
  const apiKey = process.env.ALPHA_VANTAGE_API_KEY
  if (!apiKey || apiKey === 'your_alpha_vantage_key') return null

  try {
    const response = await fetch(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=${apiKey}`,
      { next: { revalidate: 3600 } }
    )
    const data = await response.json()
    const quote = data['Global Quote']
    if (!quote || !quote['05. price']) return null

    return {
      ticker,
      price: parseFloat(quote['05. price']),
      oneYearReturn: parseFloat(quote['10. change percent']?.replace('%', '') ?? '0'),
    }
  } catch {
    return null
  }
}
