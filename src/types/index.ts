export type Currency = 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD' | 'CHF' | 'JPY' | 'NZD' | 'SEK' | 'NOK' | 'DKK' | 'SGD' | 'HKD' | 'INR' | 'BRL' | 'MXN' | 'ZAR' | 'KRW' | 'CNY' | 'AED'

export const CURRENCIES: { value: Currency; label: string; symbol: string }[] = [
  { value: 'USD', label: 'US Dollar', symbol: '$' },
  { value: 'EUR', label: 'Euro', symbol: '€' },
  { value: 'GBP', label: 'British Pound', symbol: '£' },
  { value: 'CAD', label: 'Canadian Dollar', symbol: 'CA$' },
  { value: 'AUD', label: 'Australian Dollar', symbol: 'A$' },
  { value: 'CHF', label: 'Swiss Franc', symbol: 'Fr' },
  { value: 'JPY', label: 'Japanese Yen', symbol: '¥' },
  { value: 'NZD', label: 'New Zealand Dollar', symbol: 'NZ$' },
  { value: 'SEK', label: 'Swedish Krona', symbol: 'kr' },
  { value: 'NOK', label: 'Norwegian Krone', symbol: 'kr' },
  { value: 'SGD', label: 'Singapore Dollar', symbol: 'S$' },
  { value: 'HKD', label: 'Hong Kong Dollar', symbol: 'HK$' },
  { value: 'INR', label: 'Indian Rupee', symbol: '₹' },
  { value: 'BRL', label: 'Brazilian Real', symbol: 'R$' },
  { value: 'ZAR', label: 'South African Rand', symbol: 'R' },
  { value: 'AED', label: 'UAE Dirham', symbol: 'د.إ' },
]

export type IncomeType = 'salary' | 'freelance' | 'rental' | 'dividends' | 'business' | 'side_hustle' | 'investment' | 'benefits' | 'pension' | 'other'
export type IncomeFrequency = 'monthly' | 'weekly' | 'biweekly' | 'annually'

export const INCOME_TYPES: { value: IncomeType; label: string }[] = [
  { value: 'salary', label: 'Salary' },
  { value: 'freelance', label: 'Freelance' },
  { value: 'rental', label: 'Rental Income' },
  { value: 'dividends', label: 'Dividends' },
  { value: 'business', label: 'Business Revenue' },
  { value: 'side_hustle', label: 'Side Hustle' },
  { value: 'investment', label: 'Investment Returns' },
  { value: 'benefits', label: 'Government Benefits' },
  { value: 'pension', label: 'Pension' },
  { value: 'other', label: 'Other' },
]

export const INCOME_FREQUENCIES: { value: IncomeFrequency; label: string }[] = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'biweekly', label: 'Bi-Weekly' },
  { value: 'annually', label: 'Annually' },
]

export type GoalStatus = 'active' | 'completed' | 'paused'
export type InviteStatus = 'pending' | 'accepted' | 'declined'

export interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  currency: Currency
  household_id: string | null
  created_at: string
}

export interface Household {
  id: string
  name: string
  owner_id: string
  invite_token: string
  created_at: string
}

export interface HouseholdInvite {
  id: string
  household_id: string
  invitee_email: string
  inviter_id: string
  status: InviteStatus
  created_at: string
}

export interface IncomeSource {
  id: string
  household_id: string
  created_by: string
  name: string
  type: IncomeType
  amount: number
  frequency: IncomeFrequency
  currency: Currency
  is_active: boolean
  notes: string | null
  created_at: string
}

export interface ExpenseCategory {
  id: string
  name: string
  icon: string
  color: string
  is_default: boolean
  household_id: string | null
}

export interface Expense {
  id: string
  household_id: string
  created_by: string
  category_id: string
  amount: number
  currency: Currency
  description: string
  date: string
  notes: string | null
  created_at: string
  category?: ExpenseCategory
  creator?: Profile
}

export interface Budget {
  id: string
  household_id: string
  category_id: string
  amount: number
  month: number
  year: number
  currency: Currency
  created_at: string
  category?: ExpenseCategory
}

export interface InvestmentGoal {
  id: string
  household_id: string
  created_by: string
  name: string
  description: string | null
  target_amount: number
  current_amount: number
  currency: Currency
  deadline: string | null
  status: GoalStatus
  created_at: string
}

export interface GoalContribution {
  id: string
  goal_id: string
  household_id: string
  contributed_by: string
  amount: number
  date: string
  notes: string | null
  created_at: string
  contributor?: Profile
}

export interface ETFData {
  ticker: string
  name: string
  price: number
  dividendYield: number
  expenseRatio: number
  oneYearReturn: number
  aum: string
  description: string
}

export interface FinancialInsight {
  title: string
  content: string
  type: 'tip' | 'news' | 'analysis'
  date: string
}

export interface DashboardStats {
  totalIncome: number
  totalExpenses: number
  netSavings: number
  savingsRate: number
  budgetUtilization: number
  lastMonthIncome: number
  lastMonthExpenses: number
}
