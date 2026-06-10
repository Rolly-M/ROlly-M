import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const searchParams = request.nextUrl.searchParams
  const period = searchParams.get('period') ?? 'Q2-2026'

  // Parse period
  let months: number[]
  let year: number

  if (period.startsWith('Q')) {
    const [q, y] = period.split('-')
    year = parseInt(y)
    const quarterMap: Record<string, number[]> = {
      Q1: [1, 2, 3],
      Q2: [4, 5, 6],
      Q3: [7, 8, 9],
      Q4: [10, 11, 12],
    }
    months = quarterMap[q] ?? [1, 2, 3]
  } else {
    year = parseInt(period.split('-')[1] ?? new Date().getFullYear().toString())
    months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  }

  // Get profile for household
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (!profile?.household_id) {
    return NextResponse.json({ error: 'No household' }, { status: 400 })
  }

  const startDate = `${year}-${String(Math.min(...months)).padStart(2, '0')}-01`
  const endDate = `${year}-${String(Math.max(...months)).padStart(2, '0')}-31`

  const [{ data: expenses }, { data: income }, { data: goals }] = await Promise.all([
    supabase.from('expenses')
      .select('*, category:expense_categories(*)')
      .eq('household_id', profile.household_id)
      .gte('date', startDate)
      .lte('date', endDate),
    supabase.from('income_sources')
      .select('*')
      .eq('household_id', profile.household_id)
      .eq('is_active', true),
    supabase.from('investment_goals')
      .select('*')
      .eq('household_id', profile.household_id),
  ])

  const totalExpenses = (expenses ?? []).reduce((sum, e) => sum + e.amount, 0)
  const totalIncome = (income ?? []).reduce((sum, s) => {
    const monthlyAmount = s.frequency === 'weekly' ? s.amount * 52 / 12
      : s.frequency === 'biweekly' ? s.amount * 26 / 12
      : s.frequency === 'annually' ? s.amount / 12
      : s.amount
    return sum + monthlyAmount * months.length
  }, 0)

  return NextResponse.json({
    period,
    year,
    months,
    totalIncome,
    totalExpenses,
    netSavings: totalIncome - totalExpenses,
    savingsRate: totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0,
    expenses: expenses ?? [],
    goals: goals ?? [],
  })
}
