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
    <div className="min-h-screen bg-white text-slate-900">
      {/* Header */}
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6 border-b border-slate-200">
        <Link href="/dashboard" className="flex items-center gap-3 hover:opacity-80 transition">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500 text-lg font-bold text-white">
            ✦
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.15em] text-slate-600 font-bold">ArkMedis</p>
            <p className="text-base font-bold text-slate-900">Mission 30</p>
          </div>
        </Link>
        <nav className="flex items-center gap-3">
          <Link
            href="/signin"
            className="rounded px-4 py-2 text-sm font-bold text-slate-600 transition hover:text-slate-900"
          >
            Sign in
          </Link>
        </nav>
      </header>

      <main className="space-y-0">
        {/* HERO - Increase Your Salary by 30% */}
        <section className="bg-gradient-to-br from-slate-950 to-slate-900 px-6 py-32">
          <div className="mx-auto max-w-4xl space-y-12">
            <div className="space-y-8">
              <div className="space-y-4">
                <p className="text-orange-400 font-bold uppercase tracking-widest text-sm">Mission 30</p>
                <h1 className="text-5xl lg:text-6xl font-black text-white leading-tight">
                  Increase Your Salary by 30%
                </h1>
              </div>
              <div className="space-y-6 text-lg text-slate-300">
                <div className="space-y-3">
                  <p>Most companies make salary growth uncertain.</p>
                  <p>You work hard.</p>
                  <p>You wait for reviews.</p>
                  <p>You hope for approval.</p>
                </div>
                <div className="pt-4 border-t border-slate-700">
                  <p className="text-lg font-bold text-orange-300">At ArkMedis, growth is not based on politics or tenure.</p>
                  <p className="text-xl font-bold text-orange-500 pt-2">It is based on measurable impact.</p>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-slate-800">
              <p className="text-sm font-semibold text-orange-400">Progress: {totalAchieved}/30 clients • {Math.round(progress)}% complete</p>
              <div className="mt-3 h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-orange-500 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
              </div>
            </div>
          </div>
        </section>

        {/* The Goal */}
        <section className="bg-white px-6 py-24">
          <div className="mx-auto max-w-4xl space-y-12">
            <h2 className="text-4xl lg:text-5xl font-black text-slate-900">The Goal</h2>
            <div className="space-y-8">
              <p className="text-2xl font-bold text-slate-900">Reach <span className="text-orange-500">30 active clients across 3 brands.</span></p>
              
              <div className="space-y-4 pt-8 border-t border-slate-200">
                <p className="text-lg text-slate-700">When we reach 30 clients:</p>
              </div>

              <div className="space-y-6 bg-slate-50 rounded-lg p-8">
                <p className="text-2xl font-bold text-slate-900">Every core team member earns a <span className="text-orange-500">30% salary increase.</span></p>
                <div className="space-y-3 pt-4 border-t border-slate-200">
                  <p className="font-bold text-slate-900">Automatically.</p>
                  <p className="font-bold text-slate-900">No negotiation.</p>
                  <p className="font-bold text-slate-900">No approval loop.</p>
                  <p className="font-bold text-slate-900">No delay.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* The Plan - The 3 Steps */}
        <section className="bg-slate-50 px-6 py-24">
          <div className="mx-auto max-w-4xl space-y-16">
            <h2 className="text-4xl lg:text-5xl font-black text-slate-900">The Plan</h2>
            <div className="space-y-12">
              <div className="space-y-4">
                <div className="flex items-baseline gap-4">
                  <span className="text-3xl font-black text-orange-500">1</span>
                  <h3 className="text-2xl font-black text-slate-900">Choose One Power Move</h3>
                </div>
                <div className="space-y-3 ml-16">
                  <p className="text-slate-700">Select one measurable outcome that helps us reach 30 clients.</p>
                  <p className="text-slate-700 font-semibold">Not tasks.</p>
                  <p className="text-slate-700 font-semibold">Not activity.</p>
                  <p className="text-slate-700 font-semibold">A result.</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-baseline gap-4">
                  <span className="text-3xl font-black text-orange-500">2</span>
                  <h3 className="text-2xl font-black text-slate-900">Execute and Track Daily</h3>
                </div>
                <div className="space-y-3 ml-16">
                  <p className="text-slate-700">Update your progress.</p>
                  <p className="text-slate-700">Use the dashboard.</p>
                  <p className="text-slate-700">Measure your impact.</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-baseline gap-4">
                  <span className="text-3xl font-black text-orange-500">3</span>
                  <h3 className="text-2xl font-black text-slate-900">Reach 30 Clients</h3>
                </div>
                <div className="space-y-3 ml-16">
                  <p className="text-slate-700">When ArkMedis reaches 30 active clients,</p>
                  <p className="text-slate-700">your 30% salary increase is applied.</p>
                  <p className="text-2xl font-black text-orange-500 pt-2">Automatically.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why This Exists */}
        <section className="bg-white px-6 py-24">
          <div className="mx-auto max-w-4xl space-y-12">
            <h2 className="text-4xl lg:text-5xl font-black text-slate-900">Why This Exists</h2>
            
            <div className="space-y-8">
              <p className="text-xl text-slate-700">Salary growth should not be vague.</p>
              <p className="text-xl text-slate-700">It should be tied to outcomes.</p>
              
              <div className="space-y-6 pt-8 border-t border-slate-200">
                <p className="text-lg text-slate-700">When the company grows because of your contribution,</p>
                <p className="text-lg text-slate-700">your income should grow with it.</p>
                <p className="text-2xl font-black text-orange-500 pt-4">Mission 30 aligns your effort with company growth.</p>
              </div>
            </div>
          </div>
        </section>

        {/* What Success Looks Like */}
        <section className="bg-slate-50 px-6 py-24">
          <div className="mx-auto max-w-4xl space-y-16">
            <h2 className="text-4xl lg:text-5xl font-black text-slate-900">What Success Looks Like</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <span className="flex-shrink-0 text-2xl font-black text-orange-500">✓</span>
                <div className="space-y-2">
                  <p className="text-xl font-bold text-slate-900">30 active clients</p>
                  <p className="text-slate-600">Across all 3 brands, operating consistently.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="flex-shrink-0 text-2xl font-black text-orange-500">✓</span>
                <div className="space-y-2">
                  <p className="text-xl font-bold text-slate-900">Stronger company stability</p>
                  <p className="text-slate-600">Revenue scaling. Repeatable processes. Growth momentum.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="flex-shrink-0 text-2xl font-black text-orange-500">✓</span>
                <div className="space-y-2">
                  <p className="text-xl font-bold text-slate-900">30% higher salary for every core team member</p>
                  <p className="text-slate-600">Applied automatically. No negotiation. No delay.</p>
                </div>
              </div>
              <div className="pt-8 border-t border-slate-200 mt-8">
                <p className="text-lg font-bold text-slate-900">Clear target. <span className="text-orange-500">Clear reward.</span></p>
              </div>
            </div>
          </div>
        </section>

        {/* Where We Stand */}
        <section className="bg-white px-6 py-24">
          <div className="mx-auto max-w-4xl space-y-12">
            <h2 className="text-4xl lg:text-5xl font-black text-slate-900">Where We Stand</h2>
            <div className="space-y-8">
              <div className="bg-slate-50 rounded-lg border border-slate-200 p-8 space-y-4">
                <div className="space-y-2">
                  <p className="text-sm font-bold uppercase tracking-widest text-slate-600">Current Progress</p>
                  <p className="text-4xl font-black text-slate-900">{totalAchieved} <span className="text-slate-400">/ 30</span></p>
                  <p className="text-lg text-slate-600">Clients Needed: <span className="font-bold">{clientsRemaining}</span></p>
                </div>
                <div className="pt-4 border-t border-slate-200">
                  <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                  </div>
                  <p className="text-sm text-slate-600 mt-2">{Math.round(progress)}% complete</p>
                </div>
              </div>

              <div className="space-y-4 pt-8 border-t border-slate-200">
                <p className="text-lg text-slate-700">When we reach 30, we scale.</p>
                <p className="text-lg text-slate-700">If we don't, nothing changes.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Your Next Step */}
        <section className="bg-slate-50 px-6 py-24">
          <div className="mx-auto max-w-4xl text-center space-y-12">
            <h2 className="text-4xl lg:text-5xl font-black text-slate-900">
              Your Next Step
            </h2>
            <div className="space-y-6 text-lg">
              <p className="text-xl font-bold text-slate-900">Define your Power Move.</p>
              <p className="text-xl font-bold text-slate-900">Track your execution.</p>
              <p className="text-xl font-bold text-slate-900">Help us reach 30.</p>
              <p className="text-2xl font-black text-orange-500 pt-2">Build your 30%.</p>
            </div>
            <Link
              href="/signin"
              className="inline-flex items-center justify-center rounded-lg bg-orange-500 px-12 py-5 text-lg font-bold text-white transition hover:bg-orange-600 hover:scale-105 active:scale-95"
            >
              Get Started
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 px-6 py-8 bg-slate-50">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-600">
          <p>© 2026 ArkMedis. All rights reserved.</p>
          <Link href="/signin" className="hover:text-slate-900 transition font-semibold">
            Sign in
          </Link>
        </div>
      </footer>
    </div>
  )
}
