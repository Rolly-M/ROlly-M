import Link from 'next/link'
import { Heart, TrendingUp, Target, Shield, BarChart3, Users, ArrowRight, CheckCircle } from 'lucide-react'

const features = [
  {
    icon: BarChart3,
    title: 'Smart Dashboard',
    description: 'Real-time overview of your combined finances — income, expenses, savings rate, and goal progress all in one place.',
  },
  {
    icon: Users,
    title: 'Built for Two',
    description: 'Track who added what, split expenses, and see each partner\'s contribution to your shared financial goals.',
  },
  {
    icon: Target,
    title: 'Investment Goals',
    description: 'Set financial goals together, track monthly contributions, and visualize your path to reaching each milestone.',
  },
  {
    icon: TrendingUp,
    title: 'Market Insights',
    description: 'Discover top dividend ETFs and get financial insights to grow your wealth together.',
  },
  {
    icon: Shield,
    title: 'Budget Control',
    description: 'Set monthly category budgets, get alerts when overspending, and see exactly where your money goes.',
  },
  {
    icon: BarChart3,
    title: 'PDF Reports',
    description: 'Generate beautiful quarterly and yearly PDF reports summarizing your financial journey.',
  },
]

const benefits = [
  'No more financial surprises between partners',
  'Track multiple income sources and currencies',
  'Investment goal tracking with deadline projections',
  'Beautiful charts and spending analytics',
  'Works offline as a mobile app (PWA)',
  'Bank-grade security with Supabase Auth',
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <header className="border-b border-slate-800 px-4 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Heart className="w-4 h-4 text-white" fill="currentColor" />
            </div>
            <span className="text-white font-bold text-lg">CouplesBudget</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-slate-400 hover:text-white text-sm transition-colors">
              Sign in
            </Link>
            <Link
              href="/register"
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-4 py-2 rounded-lg transition-colors"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="px-4 py-20 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-indigo-600/10 border border-indigo-600/30 rounded-full px-4 py-1.5 text-indigo-400 text-sm mb-6">
            <Heart className="w-3.5 h-3.5" fill="currentColor" />
            <span>Built for couples who plan together</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            Your Money,{' '}
            <span className="text-indigo-400">Your Future</span>,<br />
            Together
          </h1>
          <p className="text-slate-400 text-lg mb-8 max-w-2xl mx-auto">
            The all-in-one budget app designed for couples. Track income, manage expenses,
            set investment goals, and build wealth — as a team.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3.5 rounded-xl font-semibold text-lg transition-colors"
            >
              Start for Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-8 py-3.5 rounded-xl font-semibold text-lg transition-colors border border-slate-700"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 py-16 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-white text-center mb-4">Everything you need to manage finances together</h2>
        <p className="text-slate-400 text-center mb-12 max-w-2xl mx-auto">
          From daily expense tracking to long-term investment goals — CouplesBudget keeps you both on the same page.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(feature => {
            const Icon = feature.icon
            return (
              <div key={feature.title} className="bg-slate-900 rounded-xl border border-slate-800 p-6 hover:border-indigo-600/50 transition-colors">
                <div className="w-10 h-10 bg-indigo-600/20 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-indigo-400" />
                </div>
                <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* Benefits */}
      <section className="px-4 py-16 bg-slate-900/50">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">Why couples love CouplesBudget</h2>
              <div className="space-y-3">
                {benefits.map(benefit => (
                  <div key={benefit} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 shrink-0" />
                    <span className="text-slate-300">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-sm">Monthly Savings Rate</span>
                <span className="text-green-400 font-bold text-2xl">32%</span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full">
                <div className="h-2 bg-green-500 rounded-full w-1/3" />
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="bg-slate-800 rounded-lg p-3">
                  <p className="text-slate-500 text-xs">Combined Income</p>
                  <p className="text-white font-bold">$8,500/mo</p>
                </div>
                <div className="bg-slate-800 rounded-lg p-3">
                  <p className="text-slate-500 text-xs">Total Expenses</p>
                  <p className="text-pink-400 font-bold">$5,780/mo</p>
                </div>
              </div>
              <div className="bg-indigo-600/10 border border-indigo-600/30 rounded-lg p-3">
                <p className="text-indigo-400 text-xs font-medium">House Down Payment Goal</p>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-white text-sm font-semibold">$18,500 / $50,000</p>
                  <span className="text-indigo-400 text-xs">37%</span>
                </div>
                <div className="h-1.5 bg-indigo-900 rounded-full mt-2">
                  <div className="h-1.5 bg-indigo-500 rounded-full w-[37%]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-20 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to get financially fit together?</h2>
          <p className="text-slate-400 mb-8">Join thousands of couples who manage their finances smarter with CouplesBudget.</p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3.5 rounded-xl font-semibold text-lg transition-colors"
          >
            Create Your Free Account
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 px-4 py-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-indigo-400" fill="currentColor" />
            <span className="text-slate-400 text-sm">CouplesBudget &copy; {new Date().getFullYear()}</span>
          </div>
          <p className="text-slate-600 text-xs">Not financial advice. For educational purposes only.</p>
        </div>
      </footer>
    </div>
  )
}
