"use client"

import Link from "next/link"
import { COMPANY_MISSION } from "@/lib/mission-context"

export default function HomePage() {
  // Safely calculate progress with default values
  const totalAchieved = COMPANY_MISSION?.totalAchieved ?? 0
  const totalTarget = COMPANY_MISSION?.totalTarget ?? 30
  const progress = totalTarget > 0 ? (totalAchieved / totalTarget) * 100 : 0
  const clientsRemaining = Math.max(0, totalTarget - totalAchieved)
  
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      {/* Header - Sticky for accessibility */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="group flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 rounded">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500 text-lg font-bold text-white">
              ✦
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-slate-600 font-bold">ArkMedis</p>
              <p className="text-base font-bold text-slate-900">Mission 30</p>
            </div>
          </Link>
          <nav className="flex items-center gap-6">
            <Link
              href="/signin"
              className="text-sm font-semibold text-slate-600 transition hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded px-3 py-2"
            >
              Sign in
            </Link>
          </nav>
        </div>
      </header>

      <main className="space-y-0">
        {/* HERO - Main value proposition */}
        <section className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-900 px-6 py-24 lg:py-32">
          <div className="mx-auto max-w-4xl space-y-12">
            <div className="space-y-8">
              <div className="space-y-4">
                <p className="text-orange-400 font-bold uppercase tracking-widest text-sm" role="status" aria-label="Mission 30">Mission 30</p>
                <h1 className="text-5xl lg:text-6xl font-black text-white leading-tight text-balance">
                  Increase Your Salary by 30%
                </h1>
              </div>
              <div className="space-y-6 text-lg text-slate-300 leading-relaxed">
                <div className="space-y-3">
                  <p>Most companies make salary growth uncertain.</p>
                  <p>You work hard.</p>
                  <p>You wait for reviews.</p>
                  <p>You hope for approval.</p>
                </div>
                <div className="pt-4 border-t border-slate-700">
                  <p className="text-lg font-semibold text-orange-300">At ArkMedis, growth is not based on politics or tenure.</p>
                  <p className="text-xl font-bold text-orange-400 pt-3">It is based on measurable impact.</p>
                </div>
              </div>
            </div>

            {/* Progress indicator */}
            <div className="pt-8 border-t border-slate-700 space-y-3">
              <p className="text-sm font-semibold text-orange-300">Progress: {totalAchieved}/30 clients • {Math.round(progress)}% complete</p>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden" role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100} aria-label="Mission 30 progress">
                <div className="h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full transition-all duration-500 ease-out" style={{ width: `${Math.max(2, progress)}%` }}></div>
              </div>
            </div>
          </div>
        </section>

        {/* The Goal - Clear expectations */}
        <section className="bg-white px-6 py-20 lg:py-24">
          <div className="mx-auto max-w-4xl space-y-12">
            <h2 className="text-4xl lg:text-5xl font-black text-slate-900 text-balance">The Goal</h2>
            <div className="space-y-8">
              <p className="text-2xl font-bold text-slate-900 leading-tight">Reach <span className="text-orange-500">30 active clients</span> across 3 brands.</p>
              
              <div className="space-y-4 pt-8 border-t border-slate-200">
                <p className="text-lg font-semibold text-slate-700">When we reach 30 clients:</p>
              </div>

              <div className="space-y-6 bg-slate-50 rounded-xl border border-slate-200 p-8 shadow-sm">
                <p className="text-xl lg:text-2xl font-bold text-slate-900">Every core team member earns a <span className="text-orange-500">30% salary increase.</span></p>
                <ul className="space-y-3 pt-4 border-t border-slate-200">
                  <li className="flex items-center gap-3">
                    <span className="text-orange-500 font-bold">✓</span>
                    <span className="font-semibold text-slate-900">Automatically</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-orange-500 font-bold">✓</span>
                    <span className="font-semibold text-slate-900">No negotiation</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-orange-500 font-bold">✓</span>
                    <span className="font-semibold text-slate-900">No approval loop</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-orange-500 font-bold">✓</span>
                    <span className="font-semibold text-slate-900">No delay</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* The Plan - 3-step process */}
        <section className="bg-slate-50 px-6 py-20 lg:py-24">
          <div className="mx-auto max-w-4xl space-y-16">
            <h2 className="text-4xl lg:text-5xl font-black text-slate-900 text-balance">The Plan</h2>
            <ol className="space-y-12">
              {[
                {
                  number: 1,
                  title: "Choose One Power Move",
                  description: "Select one measurable outcome that helps us reach 30 clients.",
                  highlights: ["Not tasks.", "Not activity.", "A result."]
                },
                {
                  number: 2,
                  title: "Execute and Track Daily",
                  description: "Update your progress.",
                  highlights: ["Use the dashboard.", "Measure your impact.", "Stay accountable."]
                },
                {
                  number: 3,
                  title: "Reach 30 Clients",
                  description: "When ArkMedis reaches 30 active clients,",
                  highlights: ["Your 30% salary increase is applied.", "Automatically."]
                }
              ].map((step) => (
                <li key={step.number} className="space-y-4">
                  <div className="flex items-baseline gap-4">
                    <span className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-orange-500 text-white font-black">{step.number}</span>
                    <h3 className="text-2xl font-black text-slate-900">{step.title}</h3>
                  </div>
                  <div className="space-y-2 ml-14">
                    <p className="text-slate-700 leading-relaxed">{step.description}</p>
                    <ul className="space-y-1">
                      {step.highlights.map((item, idx) => (
                        <li key={idx} className="text-slate-700 font-semibold">{item}</li>
                      ))}
                    </ul>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Why This Exists - Foundation */}
        <section className="bg-white px-6 py-20 lg:py-24">
          <div className="mx-auto max-w-4xl space-y-12">
            <h2 className="text-4xl lg:text-5xl font-black text-slate-900 text-balance">Why This Exists</h2>
            
            <div className="space-y-6 leading-relaxed">
              <p className="text-xl font-semibold text-slate-900">Salary growth should not be vague.</p>
              <p className="text-xl font-semibold text-slate-900">It should be tied to outcomes.</p>
              
              <div className="space-y-6 pt-8 border-t border-slate-200">
                <p className="text-lg text-slate-700">When the company grows because of your contribution, your income should grow with it.</p>
                <p className="text-2xl font-black text-orange-500">Mission 30 aligns your effort with company growth.</p>
              </div>
            </div>
          </div>
        </section>

        {/* What Success Looks Like */}
        <section className="bg-slate-50 px-6 py-20 lg:py-24">
          <div className="mx-auto max-w-4xl space-y-16">
            <h2 className="text-4xl lg:text-5xl font-black text-slate-900 text-balance">What Success Looks Like</h2>
            <ul className="space-y-6">
              {[
                {
                  title: "30 active clients",
                  description: "Across all 3 brands, operating consistently."
                },
                {
                  title: "Stronger company stability",
                  description: "Revenue scaling. Repeatable processes. Growth momentum."
                },
                {
                  title: "30% higher salary for every core team member",
                  description: "Applied automatically. No negotiation. No delay."
                }
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-4">
                  <span className="flex-shrink-0 text-2xl text-orange-500 font-bold mt-1">✓</span>
                  <div className="space-y-1">
                    <p className="text-xl font-bold text-slate-900">{item.title}</p>
                    <p className="text-slate-600 leading-relaxed">{item.description}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="pt-8 border-t border-slate-200 mt-8">
              <p className="text-lg font-bold text-slate-900">Clear target. <span className="text-orange-500">Clear reward.</span></p>
            </div>
          </div>
        </section>

        {/* Where We Stand - Current Status */}
        <section className="bg-white px-6 py-20 lg:py-24">
          <div className="mx-auto max-w-4xl space-y-12">
            <h2 className="text-4xl lg:text-5xl font-black text-slate-900 text-balance">Where We Stand</h2>
            <div className="space-y-8">
              <div className="bg-slate-50 rounded-xl border border-slate-200 p-8 shadow-sm space-y-6">
                <div className="space-y-3">
                  <p className="text-sm font-bold uppercase tracking-widest text-slate-600">Current Progress</p>
                  <p className="text-5xl font-black text-slate-900">{totalAchieved} <span className="text-2xl text-slate-400">/ 30</span></p>
                  <p className="text-lg text-slate-700"><span className="font-semibold">Clients Needed:</span> <span className="font-bold text-orange-500">{clientsRemaining}</span></p>
                </div>
                <div className="pt-6 border-t border-slate-200 space-y-3">
                  <div className="h-3 bg-slate-200 rounded-full overflow-hidden" role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100} aria-label="Mission 30 progress details">
                    <div className="h-full bg-orange-500 rounded-full transition-all duration-500 ease-out" style={{ width: `${Math.max(2, progress)}%` }}></div>
                  </div>
                  <p className="text-sm font-semibold text-slate-600">{Math.round(progress)}% complete</p>
                </div>
              </div>

              <div className="space-y-4 pt-8 border-t border-slate-200">
                <p className="text-lg text-slate-700"><span className="font-semibold">When we reach 30,</span> we scale.</p>
                <p className="text-lg text-slate-700"><span className="font-semibold">If we don't,</span> nothing changes.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA - Clear next step */}
        <section className="bg-gradient-to-br from-orange-50 to-slate-50 px-6 py-24 lg:py-32">
          <div className="mx-auto max-w-4xl text-center space-y-12">
            <div className="space-y-4">
              <h2 className="text-4xl lg:text-5xl font-black text-slate-900 text-balance">
                Your Next Step
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">Take action now and define your Power Move to help ArkMedis reach 30 active clients.</p>
            </div>
            <div className="space-y-4 text-lg">
              <p className="font-bold text-slate-900">Define your Power Move.</p>
              <p className="font-bold text-slate-900">Track your execution.</p>
              <p className="font-bold text-slate-900">Help us reach 30.</p>
              <p className="text-2xl lg:text-3xl font-black text-orange-500 pt-2">Build your 30%.</p>
            </div>
            <Link
              href="/signin"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-orange-500 px-8 lg:px-12 py-4 lg:py-5 text-lg font-bold text-white transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600 focus-visible:ring-offset-2 hover:bg-orange-600 active:scale-95"
            >
              Get Started
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 px-6 py-8 bg-white">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-600">
          <p>© 2026 ArkMedis. All rights reserved.</p>
          <Link href="/signin" className="font-semibold text-slate-600 hover:text-slate-900 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded px-3 py-2">
            Sign in
          </Link>
        </div>
      </footer>
    </div>
  )
}
