import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { Currency, CURRENCIES } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getCurrencySymbol(currency: Currency): string {
  const found = CURRENCIES.find(c => c.value === currency)
  return found?.symbol ?? '$'
}

export function formatCurrency(amount: number, currency: Currency = 'USD'): string {
  const symbol = getCurrencySymbol(currency)
  if (currency === 'JPY' || currency === 'KRW') {
    return `${symbol}${Math.round(amount).toLocaleString()}`
  }
  return `${symbol}${amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
}

export function formatNumber(amount: number): string {
  if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)}M`
  if (amount >= 1_000) return `${(amount / 1_000).toFixed(1)}K`
  return amount.toFixed(0)
}

export function getMonthlyAmount(amount: number, frequency: string): number {
  switch (frequency) {
    case 'weekly': return amount * 52 / 12
    case 'biweekly': return amount * 26 / 12
    case 'annually': return amount / 12
    case 'monthly':
    default:
      return amount
  }
}

export function getMonthName(month: number): string {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return months[month - 1] ?? 'Unknown'
}

export function getFullMonthName(month: number): string {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  return months[month - 1] ?? 'Unknown'
}

export function getCurrentMonth(): number {
  return new Date().getMonth() + 1
}

export function getCurrentYear(): number {
  return new Date().getFullYear()
}

export function getDaysUntilDeadline(deadline: string): number {
  const now = new Date()
  const target = new Date(deadline)
  const diff = target.getTime() - now.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export function getMonthsUntilDeadline(deadline: string): number {
  const now = new Date()
  const target = new Date(deadline)
  const months = (target.getFullYear() - now.getFullYear()) * 12 + (target.getMonth() - now.getMonth())
  return Math.max(0, months)
}

export function calculateMonthlyNeeded(target: number, current: number, deadline: string): number {
  const months = getMonthsUntilDeadline(deadline)
  if (months <= 0) return target - current
  return (target - current) / months
}

export function getProgressColor(percentage: number): string {
  if (percentage >= 100) return 'text-green-400'
  if (percentage >= 75) return 'text-blue-400'
  if (percentage >= 50) return 'text-yellow-400'
  return 'text-orange-400'
}

export function getBudgetStatusColor(percentage: number): string {
  if (percentage >= 100) return 'bg-red-500'
  if (percentage >= 80) return 'bg-yellow-500'
  return 'bg-indigo-500'
}

export function generateInviteToken(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

export function truncate(str: string, n: number): string {
  return str.length > n ? str.slice(0, n - 1) + '...' : str
}
