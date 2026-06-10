'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { IncomeForm } from '@/components/income/IncomeForm'
import { IncomeList } from '@/components/income/IncomeList'
import { useAuth } from '@/hooks/useAuth'
import { useIncome } from '@/hooks/useIncome'
import { formatCurrency, getMonthlyAmount, getMonthName, getCurrentMonth, getCurrentYear } from '@/lib/utils'
import { Currency, IncomeSource, IncomeType, IncomeFrequency } from '@/types'
import { PlusCircle, DollarSign, Users } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const MOCK_INCOME: IncomeSource[] = [
  { id: '1', household_id: 'demo', created_by: 'me', name: 'Software Engineer Salary', type: 'salary', amount: 5500, frequency: 'monthly', currency: 'USD', is_active: true, notes: null, created_at: '' },
  { id: '2', household_id: 'demo', created_by: 'partner', name: 'Teacher Salary', type: 'salary', amount: 3500, frequency: 'monthly', currency: 'USD', is_active: true, notes: null, created_at: '' },
  { id: '3', household_id: 'demo', created_by: 'me', name: 'Freelance Design', type: 'freelance', amount: 1200, frequency: 'monthly', currency: 'USD', is_active: true, notes: 'Variable month to month', created_at: '' },
  { id: '4', household_id: 'demo', created_by: 'partner', name: 'Rental Property', type: 'rental', amount: 800, frequency: 'monthly', currency: 'USD', is_active: false, notes: 'Paused while renovating', created_at: '' },
]

const MOCK_CHART_DATA = [
  { month: 'Jan', income: 8200 },
  { month: 'Feb', income: 8200 },
  { month: 'Mar', income: 8500 },
  { month: 'Apr', income: 8500 },
  { month: 'May', income: 9000 },
  { month: 'Jun', income: 9000 },
]

export default function IncomePage() {
  const { profile } = useAuth()
  const householdId = profile?.household_id
  const currency = (profile?.currency as Currency) ?? 'USD'
  const { toast } = useToast()
  const [addOpen, setAddOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const { incomeSources, totalMonthlyIncome, addIncomeSource, toggleActive, deleteIncomeSource } = useIncome(householdId)
  const isDemo = !householdId
  const displaySources = isDemo ? MOCK_INCOME : incomeSources
  const displayTotal = isDemo ? 9000 : totalMonthlyIncome

  const myTotal = displaySources
    .filter(s => s.is_active && s.created_by === (isDemo ? 'me' : profile?.id))
    .reduce((sum, s) => sum + getMonthlyAmount(s.amount, s.frequency), 0)

  const partnerTotal = displaySources
    .filter(s => s.is_active && s.created_by !== (isDemo ? 'me' : profile?.id))
    .reduce((sum, s) => sum + getMonthlyAmount(s.amount, s.frequency), 0)

  const handleAdd = async (data: { name: string; type: string; amount: string; frequency: string; currency: string; notes?: string }) => {
    if (!householdId || !profile) {
      toast({ title: 'Demo mode', description: 'Connect Supabase to add real data.' })
      setAddOpen(false)
      return
    }
    setLoading(true)
    const { error } = await addIncomeSource({
      household_id: householdId,
      created_by: profile.id,
      name: data.name,
      type: data.type as IncomeType,
      amount: parseFloat(data.amount),
      frequency: data.frequency as IncomeFrequency,
      currency: data.currency as Currency,
      is_active: true,
      notes: data.notes ?? null,
    })
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' })
    } else {
      toast({ title: 'Income source added!' })
      setAddOpen(false)
    }
    setLoading(false)
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Income</h1>
          <p className="text-slate-400 text-sm mt-1">{getMonthName(getCurrentMonth())} {getCurrentYear()}</p>
        </div>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button className="bg-indigo-600 hover:bg-indigo-700 gap-2">
              <PlusCircle className="w-4 h-4" />
              Add Source
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-900 border-slate-800 max-w-lg">
            <DialogHeader>
              <DialogTitle>Add Income Source</DialogTitle>
            </DialogHeader>
            <IncomeForm onSubmit={handleAdd} onCancel={() => setAddOpen(false)} loading={loading} defaultCurrency={currency} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-1">
              <DollarSign className="w-5 h-5 text-green-400" />
              <p className="text-slate-400 text-sm">Total Monthly</p>
            </div>
            <p className="text-white font-bold text-2xl">{formatCurrency(displayTotal, currency)}</p>
            <p className="text-slate-500 text-xs mt-1">{displaySources.filter(s => s.is_active).length} active sources</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-1">
              <Users className="w-5 h-5 text-indigo-400" />
              <p className="text-slate-400 text-sm">Your Income</p>
            </div>
            <p className="text-white font-bold text-2xl">{formatCurrency(myTotal, currency)}</p>
            <p className="text-slate-500 text-xs mt-1">{displayTotal > 0 ? ((myTotal / displayTotal) * 100).toFixed(0) : 0}% of household</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-1">
              <Users className="w-5 h-5 text-purple-400" />
              <p className="text-slate-400 text-sm">Partner&apos;s Income</p>
            </div>
            <p className="text-white font-bold text-2xl">{formatCurrency(partnerTotal, currency)}</p>
            <p className="text-slate-500 text-xs mt-1">{displayTotal > 0 ? ((partnerTotal / displayTotal) * 100).toFixed(0) : 0}% of household</p>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-base text-slate-300">Income Trend (6 months)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={MOCK_CHART_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 12 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} tickFormatter={v => `$${v / 1000}k`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                formatter={(value) => [formatCurrency(Number(value ?? 0), currency), 'Income']}
              />
              <Bar dataKey="income" fill="#22c55e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Income List */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-base text-slate-300">Income Sources</CardTitle>
        </CardHeader>
        <CardContent>
          <IncomeList
            sources={displaySources}
            onToggle={isDemo ? () => {} : (id, active) => toggleActive(id, active)}
            onDelete={isDemo ? () => {} : deleteIncomeSource}
            currentUserId={isDemo ? 'me' : (profile?.id ?? '')}
          />
        </CardContent>
      </Card>
    </div>
  )
}
