'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAuth } from '@/hooks/useAuth'
import { formatCurrency } from '@/lib/utils'
import { Currency } from '@/types'
import { FileText, Download, BarChart2, DollarSign, Target, PiggyBank } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

const MOCK_STATS = {
  totalIncome: 27000,
  totalExpenses: 17340,
  netSavings: 9660,
  savingsRate: 35.8,
  topCategory: 'Housing',
  topCategoryAmount: 5400,
  goalsCount: 3,
  goalsProgress: 48.3,
}

export default function ReportsPage() {
  const { profile } = useAuth()
  const currency = (profile?.currency as Currency) ?? 'USD'
  const { toast } = useToast()
  const [period, setPeriod] = useState('Q2-2026')
  const [generating, setGenerating] = useState(false)

  const periods = [
    { value: 'Q1-2026', label: 'Q1 2026 (Jan–Mar)' },
    { value: 'Q2-2026', label: 'Q2 2026 (Apr–Jun)' },
    { value: 'Q3-2026', label: 'Q3 2026 (Jul–Sep)' },
    { value: 'Q4-2026', label: 'Q4 2026 (Oct–Dec)' },
    { value: 'YEAR-2026', label: 'Full Year 2026' },
    { value: 'Q1-2025', label: 'Q1 2025' },
    { value: 'Q2-2025', label: 'Q2 2025' },
    { value: 'Q3-2025', label: 'Q3 2025' },
    { value: 'Q4-2025', label: 'Q4 2025' },
    { value: 'YEAR-2025', label: 'Full Year 2025' },
  ]

  const generatePDF = async () => {
    setGenerating(true)
    try {
      const { default: jsPDF } = await import('jspdf')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { default: autoTable } = await import('jspdf-autotable') as any

      const doc = new jsPDF()
      const periodLabel = periods.find(p => p.value === period)?.label ?? period

      // Cover page
      doc.setFillColor(15, 23, 42) // slate-950
      doc.rect(0, 0, 210, 297, 'F')

      doc.setTextColor(99, 102, 241) // indigo
      doc.setFontSize(28)
      doc.setFont('helvetica', 'bold')
      doc.text('CouplesBudget', 105, 80, { align: 'center' })

      doc.setTextColor(241, 245, 249) // slate-100
      doc.setFontSize(18)
      doc.text('Financial Report', 105, 100, { align: 'center' })

      doc.setTextColor(148, 163, 184) // slate-400
      doc.setFontSize(12)
      doc.text(periodLabel, 105, 116, { align: 'center' })

      if (profile?.full_name) {
        doc.text(`Prepared for: ${profile.full_name}`, 105, 130, { align: 'center' })
      }

      doc.text(`Generated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, 105, 145, { align: 'center' })

      // Page 2 - Summary
      doc.addPage()
      doc.setFillColor(15, 23, 42)
      doc.rect(0, 0, 210, 297, 'F')

      doc.setTextColor(99, 102, 241)
      doc.setFontSize(16)
      doc.setFont('helvetica', 'bold')
      doc.text('Financial Summary', 20, 30)

      doc.setTextColor(148, 163, 184)
      doc.setFontSize(10)
      doc.text(periodLabel, 20, 42)

      // Summary table
      autoTable(doc, {
        startY: 50,
        head: [['Metric', 'Amount']],
        body: [
          ['Total Income', formatCurrency(MOCK_STATS.totalIncome, currency)],
          ['Total Expenses', formatCurrency(MOCK_STATS.totalExpenses, currency)],
          ['Net Savings', formatCurrency(MOCK_STATS.netSavings, currency)],
          ['Savings Rate', `${MOCK_STATS.savingsRate}%`],
          ['Top Expense Category', `${MOCK_STATS.topCategory} (${formatCurrency(MOCK_STATS.topCategoryAmount, currency)})`],
          ['Active Goals', MOCK_STATS.goalsCount.toString()],
          ['Avg Goal Progress', `${MOCK_STATS.goalsProgress}%`],
        ],
        theme: 'grid',
        headStyles: { fillColor: [99, 102, 241], textColor: [255, 255, 255] },
        bodyStyles: { fillColor: [30, 41, 59], textColor: [241, 245, 249] },
        alternateRowStyles: { fillColor: [51, 65, 85] },
      })

      // Page 3 - Expenses
      doc.addPage()
      doc.setFillColor(15, 23, 42)
      doc.rect(0, 0, 210, 297, 'F')

      doc.setTextColor(99, 102, 241)
      doc.setFontSize(16)
      doc.setFont('helvetica', 'bold')
      doc.text('Expense Breakdown', 20, 30)

      autoTable(doc, {
        startY: 45,
        head: [['Category', 'Amount', '% of Total']],
        body: [
          ['Housing', '$5,400', '31.1%'],
          ['Food & Dining', '$1,872', '10.8%'],
          ['Transportation', '$945', '5.4%'],
          ['Utilities', '$675', '3.9%'],
          ['Healthcare', '$450', '2.6%'],
          ['Entertainment', '$540', '3.1%'],
          ['Shopping', '$720', '4.2%'],
          ['Insurance', '$738', '4.3%'],
          ['Other', '$6,000', '34.6%'],
        ],
        theme: 'grid',
        headStyles: { fillColor: [236, 72, 153], textColor: [255, 255, 255] },
        bodyStyles: { fillColor: [30, 41, 59], textColor: [241, 245, 249] },
        alternateRowStyles: { fillColor: [51, 65, 85] },
      })

      // Page 4 - Goals
      doc.addPage()
      doc.setFillColor(15, 23, 42)
      doc.rect(0, 0, 210, 297, 'F')

      doc.setTextColor(99, 102, 241)
      doc.setFontSize(16)
      doc.setFont('helvetica', 'bold')
      doc.text('Investment Goals Progress', 20, 30)

      autoTable(doc, {
        startY: 45,
        head: [['Goal', 'Target', 'Saved', 'Progress', 'Deadline']],
        body: [
          ['Emergency Fund', '$15,000', '$8,500', '56.7%', 'Dec 2026'],
          ['House Down Payment', '$50,000', '$18,500', '37.0%', 'Jun 2027'],
          ['Europe Vacation', '$5,000', '$2,200', '44.0%', 'Aug 2026'],
        ],
        theme: 'grid',
        headStyles: { fillColor: [16, 185, 129], textColor: [255, 255, 255] },
        bodyStyles: { fillColor: [30, 41, 59], textColor: [241, 245, 249] },
        alternateRowStyles: { fillColor: [51, 65, 85] },
      })

      // Disclaimer
      const pageCount = doc.getNumberOfPages()
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        doc.setTextColor(71, 85, 105)
        doc.setFontSize(7)
        doc.text('This report is for personal budgeting purposes only and does not constitute financial advice.', 105, 288, { align: 'center' })
        doc.text(`Page ${i} of ${pageCount}`, 190, 288, { align: 'right' })
      }

      doc.save(`CouplesBudget-Report-${period}.pdf`)
      toast({ title: 'Report downloaded!', description: `${periodLabel} report saved.` })
    } catch (error) {
      console.error('PDF generation error:', error)
      toast({ title: 'Error generating PDF', variant: 'destructive' })
    }
    setGenerating(false)
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white">Reports</h1>
        <p className="text-slate-400 text-sm mt-1">Generate PDF financial reports</p>
      </div>

      {/* Generator */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-base text-slate-300 flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-400" />
            Generate Report
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex-1 min-w-48">
              <p className="text-slate-400 text-sm mb-2">Select Period</p>
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger className="bg-slate-800 border-slate-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {periods.map(p => (
                    <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col justify-end">
              <p className="text-slate-400 text-sm mb-2 opacity-0">Action</p>
              <Button
                onClick={generatePDF}
                disabled={generating}
                className="bg-indigo-600 hover:bg-indigo-700 gap-2"
              >
                <Download className="w-4 h-4" />
                {generating ? 'Generating...' : 'Download PDF'}
              </Button>
            </div>
          </div>

          <div className="bg-slate-800 rounded-lg p-4 text-sm text-slate-400">
            <p className="font-medium text-slate-300 mb-1">Report includes:</p>
            <ul className="space-y-1 text-xs">
              <li>• Cover page with period and household info</li>
              <li>• Financial summary (income, expenses, savings rate)</li>
              <li>• Category-by-category expense breakdown</li>
              <li>• Budget performance vs actuals</li>
              <li>• Investment goals progress table</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Summary Preview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-4 text-center">
            <DollarSign className="w-6 h-6 text-green-400 mx-auto mb-2" />
            <p className="text-slate-400 text-xs mb-1">Total Income</p>
            <p className="text-white font-bold">{formatCurrency(MOCK_STATS.totalIncome, currency)}</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-4 text-center">
            <BarChart2 className="w-6 h-6 text-pink-400 mx-auto mb-2" />
            <p className="text-slate-400 text-xs mb-1">Total Expenses</p>
            <p className="text-white font-bold">{formatCurrency(MOCK_STATS.totalExpenses, currency)}</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-4 text-center">
            <PiggyBank className="w-6 h-6 text-indigo-400 mx-auto mb-2" />
            <p className="text-slate-400 text-xs mb-1">Net Savings</p>
            <p className="text-white font-bold">{formatCurrency(MOCK_STATS.netSavings, currency)}</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-4 text-center">
            <Target className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
            <p className="text-slate-400 text-xs mb-1">Savings Rate</p>
            <p className="text-white font-bold">{MOCK_STATS.savingsRate}%</p>
          </CardContent>
        </Card>
      </div>

      {/* Expense Breakdown Preview */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-base text-slate-300">Expense Breakdown Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: 'Housing', amount: 5400, pct: 31.1, color: '#ec4899', icon: '🏠' },
              { name: 'Food & Dining', amount: 1872, pct: 10.8, color: '#f59e0b', icon: '🍽️' },
              { name: 'Transportation', amount: 945, pct: 5.4, color: '#6366f1', icon: '🚗' },
              { name: 'Entertainment', amount: 540, pct: 3.1, color: '#8b5cf6', icon: '🎬' },
              { name: 'Utilities', amount: 675, pct: 3.9, color: '#3b82f6', icon: '⚡' },
              { name: 'Insurance', amount: 738, pct: 4.3, color: '#10b981', icon: '🛡️' },
            ].map(cat => (
              <div key={cat.name} className="flex items-center gap-3">
                <span className="text-sm w-6 text-center">{cat.icon}</span>
                <span className="text-slate-300 text-sm w-32">{cat.name}</span>
                <div className="flex-1 h-2 bg-slate-700 rounded-full">
                  <div className="h-2 rounded-full" style={{ width: `${cat.pct * 2}%`, backgroundColor: cat.color }} />
                </div>
                <span className="text-white text-sm font-medium w-20 text-right">{formatCurrency(cat.amount, currency)}</span>
                <span className="text-slate-500 text-xs w-12 text-right">{cat.pct}%</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
