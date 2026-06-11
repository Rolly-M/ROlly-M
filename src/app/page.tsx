import Link from 'next/link'
import { Heart, TrendingUp, Target, Shield, BarChart3, Users, ArrowRight, CheckCircle, Sparkles, Zap, Globe } from 'lucide-react'

const features = [
  { icon: BarChart3, title: 'Smart Dashboard', desc: 'Real-time overview of your combined finances — income, expenses, savings rate and goals all in one place.', color: 'from-violet-500 to-fuchsia-500' },
  { icon: Users,    title: 'Built for Two',   desc: 'See who paid what, split expenses fairly, and track each partner\'s contribution to shared goals.',        color: 'from-cyan-500 to-blue-500' },
  { icon: Target,   title: 'Investment Goals', desc: 'Set financial milestones together, track monthly contributions and visualize your path to each goal.',        color: 'from-amber-500 to-orange-500' },
  { icon: TrendingUp, title: 'Market Insights', desc: 'Discover top high-dividend ETFs and curated financial insights to grow your wealth intelligently.',          color: 'from-emerald-500 to-teal-500' },
  { icon: Shield,   title: 'Budget Control',   desc: 'Set monthly category limits, get instant alerts when overspending, and see exactly where money goes.',       color: 'from-rose-500 to-pink-500' },
  { icon: Sparkles, title: 'PDF Reports',      desc: 'Generate beautiful quarterly and yearly reports summarizing your financial journey as a couple.',              color: 'from-indigo-500 to-violet-500' },
]

const steps = [
  { num: '01', title: 'Create your household', desc: 'Sign up and invite your partner with a single email. You\'re connected in seconds.' },
  { num: '02', title: 'Set up income & budget', desc: 'Add all your income sources and set monthly spending limits per category.' },
  { num: '03', title: 'Track & grow together',  desc: 'Log expenses, hit your goals, and watch your net worth grow month over month.' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen text-white" style={{ background: '#050C18' }}>
      {/* Ambient orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      {/* Nav */}
      <header className="relative z-10 flex items-center justify-between max-w-7xl mx-auto px-6 py-5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center gradient-bg shadow-lg shadow-violet-500/30">
            <Heart className="w-4 h-4 text-white" fill="currentColor" />
          </div>
          <span className="font-bold text-lg tracking-tight text-white">CouplesBudget</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-slate-400 hover:text-white transition-colors px-4 py-2">
            Sign in
          </Link>
          <Link href="/register" className="btn-gradient text-sm px-5 py-2.5 rounded-xl">
            Get Started Free
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-20 grid lg:grid-cols-2 gap-16 items-center">
        {/* Left */}
        <div className="animate-fade-in">
          <div className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full mb-8"
            style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(168,85,247,0.3)', color: '#C4B5FD' }}>
            <Zap className="w-3 h-3" />
            Free for couples · No credit card needed
          </div>
          <h1 className="text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight mb-6">
            Build Wealth<br />
            <span className="gradient-text">Together.</span>
          </h1>
          <p className="text-lg text-slate-400 leading-relaxed mb-10 max-w-lg">
            The only budget app designed for couples. Track income, crush expenses,
            set investment goals, and watch your net worth climb — as a team.
          </p>
          <div className="flex flex-wrap gap-4 mb-12">
            <Link href="/register" className="btn-gradient inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-semibold">
              Start for Free <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/login"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-semibold text-slate-300 hover:text-white transition-all"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
              Sign In
            </Link>
          </div>
          <div className="flex items-center gap-6 text-sm text-slate-500">
            {['2,000+ Couples', '$4.2M Tracked', '100% Free'].map(s => (
              <span key={s} className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Right — floating mock dashboard */}
        <div className="relative animate-slide-up hidden lg:block">
          {/* Main card */}
          <div className="glass-strong rounded-3xl p-6 shadow-2xl shadow-violet-500/10">
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-xs text-slate-500 mb-1">Monthly Net Worth</p>
                <p className="text-3xl font-extrabold gradient-text">+$2,720</p>
              </div>
              <div className="px-3 py-1.5 rounded-full text-xs font-semibold"
                style={{ background: 'rgba(16,185,129,0.15)', color: '#34D399', border: '1px solid rgba(16,185,129,0.3)' }}>
                ↑ 12.4%
              </div>
            </div>
            {/* Income/Expense row */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="rounded-2xl p-4" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.15)' }}>
                <p className="text-xs text-slate-500 mb-1">Combined Income</p>
                <p className="text-xl font-bold text-emerald-400">$9,000</p>
                <p className="text-xs text-slate-600 mt-1">↑ from $8,500</p>
              </div>
              <div className="rounded-2xl p-4" style={{ background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.15)' }}>
                <p className="text-xs text-slate-500 mb-1">Total Expenses</p>
                <p className="text-xl font-bold text-rose-400">$6,280</p>
                <p className="text-xs text-slate-600 mt-1">↓ from $6,580</p>
              </div>
            </div>
            {/* Goal */}
            <div className="rounded-2xl p-4 mb-4" style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(168,85,247,0.2)' }}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-slate-300 font-medium">🏠 House Down Payment</span>
                <span className="text-xs text-violet-400 font-semibold">37%</span>
              </div>
              <div className="h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <div className="h-2 rounded-full w-[37%]" style={{ background: 'linear-gradient(90deg, #7C3AED, #A855F7)' }} />
              </div>
              <p className="text-xs text-slate-600 mt-2">$18,500 of $50,000 · On track for Jun 2027</p>
            </div>
            {/* Savings rate */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Savings Rate</span>
              <span className="font-bold text-emerald-400 text-lg">30.2%</span>
            </div>
          </div>

          {/* Floating tag */}
          <div className="absolute -top-4 -right-4 glass rounded-2xl px-4 py-3 text-xs shadow-xl">
            <p className="text-slate-400">Partner added</p>
            <p className="text-white font-semibold">Grocery run · $142</p>
          </div>
          <div className="absolute -bottom-4 -left-4 glass rounded-2xl px-4 py-3 text-xs shadow-xl">
            <p className="text-emerald-400 font-semibold">🎯 Goal reached!</p>
            <p className="text-slate-400">Emergency Fund · $15k</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Everything you need to win with money
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            From daily tracking to long-term wealth building — all in one beautiful app.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map(f => {
            const Icon = f.icon
            return (
              <div key={f.title}
                className="rounded-2xl p-6 group hover:scale-[1.02] transition-all duration-300 cursor-default"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-5 shadow-lg`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-white font-semibold mb-2">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* How it works */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold mb-4">Up and running in minutes</h2>
          <p className="text-slate-400">Three simple steps to take control of your finances.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map(s => (
            <div key={s.num} className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl font-black text-xl gradient-text mb-5"
                style={{ background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(168,85,247,0.2)' }}>
                {s.num}
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">{s.title}</h3>
              <p className="text-slate-500 text-sm">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits / Preview */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="rounded-3xl p-10 lg:p-16 grid lg:grid-cols-2 gap-12 items-center"
          style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(168,85,247,0.15)' }}>
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-6"
              style={{ background: 'rgba(124,58,237,0.2)', color: '#C4B5FD', border: '1px solid rgba(168,85,247,0.3)' }}>
              <Globe className="w-3.5 h-3.5" /> Available in English, French & Spanish
            </div>
            <h2 className="text-3xl font-bold mb-6">Why couples choose us</h2>
            <div className="space-y-3">
              {[
                'No more financial surprises between partners',
                'Recurring expenses tracked automatically',
                'Live net worth updates as you add data',
                'Connect your bank for automatic imports',
                'Beautiful charts and spending analytics',
                'Works offline — installable as a mobile app',
                'Bank-grade security with Supabase Auth',
              ].map(b => (
                <div key={b} className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-slate-300 text-sm">{b}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Mini demo */}
          <div className="glass rounded-2xl p-6 space-y-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Live Preview</p>
            <div className="space-y-3">
              {[
                { label: 'Housing',       val: '$1,800', pct: 90, color: '#A855F7' },
                { label: 'Food & Dining', val: '$620',   pct: 62, color: '#10B981' },
                { label: 'Transport',     val: '$380',   pct: 76, color: '#F59E0B' },
                { label: 'Entertainment', val: '$180',   pct: 36, color: '#06B6D4' },
              ].map(row => (
                <div key={row.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">{row.label}</span>
                    <span className="text-white font-medium">{row.val}</span>
                  </div>
                  <div className="h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <div className="h-1.5 rounded-full transition-all" style={{ width: `${row.pct}%`, background: row.color }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="pt-2 flex justify-between items-center" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <span className="text-sm text-slate-400">Monthly Budget Left</span>
              <span className="font-bold text-emerald-400">$2,720</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20 text-center">
        <h2 className="text-4xl font-extrabold mb-4">
          Ready to get financially fit <span className="gradient-text">together?</span>
        </h2>
        <p className="text-slate-400 mb-10 max-w-md mx-auto">
          Join couples who manage their money smarter. Free forever, no credit card needed.
        </p>
        <Link href="/register" className="btn-gradient inline-flex items-center gap-2 px-10 py-4 rounded-xl text-lg font-semibold">
          Create Your Free Account <ArrowRight className="w-5 h-5" />
        </Link>
      </section>

      {/* Footer */}
      <footer className="relative z-10 max-w-7xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-2 text-slate-500 text-sm">
          <Heart className="w-3.5 h-3.5 text-violet-400" fill="currentColor" />
          CouplesBudget &copy; {new Date().getFullYear()}
        </div>
        <p className="text-slate-700 text-xs">Not financial advice. For educational purposes only.</p>
      </footer>
    </div>
  )
}
