import Link from "next/link"
import { COMPANY_MISSION } from "@/lib/mission-context"

export default function HomePage() {
  const progress = (COMPANY_MISSION.totalAchieved / COMPANY_MISSION.totalTarget) * 100
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
        {/* HERO - Your Growth Is Not Given. It Is Built. */}
        <section className="bg-gradient-to-br from-slate-950 to-slate-900 px-6 py-32">
          <div className="mx-auto max-w-4xl space-y-12">
            <div className="space-y-8">
              <h1 className="text-5xl lg:text-6xl font-black text-white leading-tight">
                Your Growth Is Not Given.
                <br />
                It Is Built.
              </h1>
              <div className="space-y-8 text-lg text-slate-300">
                <p>When ArkMedis reaches 30 clients,</p>
                <p>you receive a 30% Salary Hike.</p>
                <div className="pt-4 border-t border-slate-700">
                  <p className="text-sm font-semibold text-orange-400">We're at {COMPANY_MISSION.totalAchieved}/30 clients. {Math.round(progress)}% there.</p>
                  <div className="mt-2 h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-8 border-t border-slate-800">
              <div className="space-y-2">
                <p className="text-lg text-slate-300">Not requested.</p>
              </div>
              <div className="space-y-2">
                <p className="text-lg text-slate-300">Not negotiated.</p>
              </div>
              <div className="space-y-2">
                <p className="text-lg text-slate-300">Not delayed.</p>
              </div>
              <div className="space-y-2 pt-2">
                <p className="text-2xl font-black text-orange-500">Earned.</p>
              </div>
            </div>
          </div>
        </section>

        {/* This Is The Deal */}
        <section className="bg-white px-6 py-24">
          <div className="mx-auto max-w-4xl space-y-16">
            <h2 className="text-4xl lg:text-5xl font-black text-slate-900">This Is The Deal</h2>
            <div className="space-y-8">
              <div className="space-y-4">
                <p className="text-2xl font-bold text-slate-900">We reach 30 active clients across 3 brands.</p>
                <p className="text-2xl font-bold text-slate-900">You earn 30% more salary.</p>
              </div>
              <p className="text-2xl font-black text-orange-500 pt-4">Simple.</p>
            </div>
          </div>
        </section>

        {/* How You Win */}
        <section className="bg-slate-50 px-6 py-24">
          <div className="mx-auto max-w-4xl space-y-16">
            <h2 className="text-4xl lg:text-5xl font-black text-slate-900">How You Win</h2>
            <div className="space-y-12">
              <div className="space-y-4">
                <div className="flex items-baseline gap-4">
                  <span className="text-3xl font-black text-orange-500">1</span>
                  <h3 className="text-2xl font-black text-slate-900">Own One Power Move</h3>
                </div>
                <div className="space-y-3 ml-16">
                  <p className="text-slate-700">One measurable outcome.</p>
                  <p className="text-slate-700">One responsibility.</p>
                  <p className="text-slate-700">Something only you can deliver.</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-baseline gap-4">
                  <span className="text-3xl font-black text-orange-500">2</span>
                  <h3 className="text-2xl font-black text-slate-900">Execute Relentlessly</h3>
                </div>
                <div className="space-y-3 ml-16">
                  <p className="text-slate-700">Your impact is tracked daily.</p>
                  <p className="text-slate-700">The dashboard shows the truth.</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-baseline gap-4">
                  <span className="text-3xl font-black text-orange-500">3</span>
                  <h3 className="text-2xl font-black text-slate-900">We Hit 30</h3>
                </div>
                <div className="space-y-3 ml-16">
                  <p className="text-slate-700">When the company wins,</p>
                  <p className="text-slate-700">your 30% Salary Hike is applied.</p>
                  <p className="text-2xl font-black text-orange-500 pt-2">Automatically.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Mission 30 Exists */}
        <section className="bg-white px-6 py-24">
          <div className="mx-auto max-w-4xl space-y-12">
            <h2 className="text-4xl lg:text-5xl font-black text-slate-900">Why Mission 30 Exists</h2>
            <div className="space-y-12">
              <div className="space-y-4">
                <p className="text-slate-600 font-semibold">Because too many companies say:</p>
                <div className="space-y-2 pl-6 border-l-4 border-slate-300">
                  <p className="text-xl text-slate-600">"Work harder. We'll review later."</p>
                </div>
              </div>

              <div className="space-y-4 pt-8 border-t border-slate-200">
                <p className="text-xl font-bold text-slate-900">We don't believe in "later."</p>
                <p className="text-xl font-bold text-slate-900">We believe in alignment.</p>
              </div>

              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <p className="text-lg font-bold text-slate-900">Your execution</p>
                  <p className="text-lg text-slate-600 ml-4">→ brings clients</p>
                  <p className="text-lg text-slate-600 ml-8">→ builds the company</p>
                  <p className="text-lg text-slate-600 ml-12">→ grows your salary.</p>
                </div>
              </div>

              <div className="space-y-3 pt-8 border-t border-slate-200">
                <p className="text-slate-900 font-bold">No politics.</p>
                <p className="text-slate-900 font-bold">No favoritism.</p>
                <p className="text-slate-900 font-bold">No hidden decisions.</p>
                <p className="text-2xl font-black text-orange-500 pt-2">Only results.</p>
              </div>
            </div>
          </div>
        </section>

        {/* This Is Ownership */}
        <section className="bg-gradient-to-br from-slate-950 to-slate-900 px-6 py-24">
          <div className="mx-auto max-w-4xl space-y-12">
            <h2 className="text-4xl lg:text-5xl font-black text-white">This Is Ownership</h2>
            <div className="space-y-8 text-white">
              <div className="space-y-4">
                <p className="text-lg">If we stay at 12 clients — nothing changes.</p>
                <p className="text-lg">If we push to 30 — everything changes.</p>
              </div>

              <div className="space-y-4 pt-8 border-t border-slate-800">
                <p className="text-lg font-bold">The mission is shared.</p>
                <p className="text-lg font-bold">The reward is shared.</p>
              </div>

              <div className="space-y-4 pt-8 border-t border-slate-800">
                <p className="text-lg font-bold text-orange-500">Your effort matters.</p>
                <p className="text-lg font-bold text-orange-500">Your numbers matter.</p>
                <p className="text-2xl font-black text-orange-500">You matter.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Ready To Build Your 30% */}
        <section className="bg-white px-6 py-24">
          <div className="mx-auto max-w-4xl text-center space-y-12">
            <h2 className="text-4xl lg:text-5xl font-black text-slate-900">
              Ready To Build Your 30%?
            </h2>
            <div className="space-y-6 text-lg text-slate-600">
              <p>Define your Power Move.</p>
              <p>Execute daily.</p>
              <p>Help us reach 30 clients.</p>
              <p className="text-xl font-bold text-slate-900">And earn what you deserve.</p>
            </div>
            <Link
              href="/signin"
              className="inline-flex items-center justify-center rounded-lg bg-orange-500 px-12 py-5 text-lg font-bold text-white transition hover:bg-orange-600"
            >
              Build Your 30%
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
