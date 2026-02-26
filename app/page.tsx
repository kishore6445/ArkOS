import Link from "next/link"

export default function HomePage() {
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
        {/* HERO - You Deserve Growth That Is Earned */}
        <section className="bg-gradient-to-br from-slate-950 to-slate-900 px-6 py-32">
          <div className="mx-auto max-w-4xl space-y-12">
            <div className="space-y-8">
              <h1 className="text-5xl lg:text-6xl font-black text-white leading-tight">
                You Deserve Growth That Is Earned — Not Negotiated.
              </h1>
              <div className="space-y-6 text-lg text-slate-300">
                <p>When ArkMedis reaches 30 clients,</p>
                <p>you receive a 30% Salary Hike.</p>
              </div>
            </div>

            <div className="space-y-4 pt-8 border-t border-slate-800">
              <div className="flex items-start gap-4">
                <span className="text-2xl font-black text-orange-500 mt-1">✓</span>
                <p className="text-lg text-slate-300">No approvals.</p>
              </div>
              <div className="flex items-start gap-4">
                <span className="text-2xl font-black text-orange-500 mt-1">✓</span>
                <p className="text-lg text-slate-300">No politics.</p>
              </div>
              <div className="flex items-start gap-4">
                <span className="text-2xl font-black text-orange-500 mt-1">✓</span>
                <p className="text-lg text-slate-300">No waiting.</p>
              </div>
              <div className="flex items-start gap-4">
                <span className="text-2xl font-black text-orange-500 mt-1">✓</span>
                <p className="text-xl font-bold text-white">Just results.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Here's The Plan */}
        <section className="bg-white px-6 py-24">
          <div className="mx-auto max-w-4xl space-y-16">
            <h2 className="text-4xl lg:text-5xl font-black text-slate-900">Here's The Plan</h2>
            <div className="space-y-8">
              <div className="space-y-2">
                <p className="text-xl font-bold text-slate-900">You choose one measurable Power Move.</p>
                <p className="text-slate-600">Define one outcome you're responsible for that helps us reach 30 clients.</p>
              </div>
              <div className="space-y-2">
                <p className="text-xl font-bold text-slate-900">You execute daily.</p>
                <p className="text-slate-600">Track your progress on the dashboard. Stay focused. Keep moving.</p>
              </div>
              <div className="space-y-2">
                <p className="text-xl font-bold text-slate-900">You help us reach 30 clients.</p>
                <p className="text-slate-600">Your execution, combined with the team's, gets us there.</p>
              </div>
            </div>
            <div className="pt-8 border-t border-slate-200 space-y-4">
              <p className="text-2xl font-bold text-slate-900">When we win,</p>
              <p className="text-2xl font-bold text-slate-900">your 30% Salary Hike is applied.</p>
              <p className="text-3xl font-black text-orange-500">Automatically.</p>
            </div>
          </div>
        </section>

        {/* Why This Exists */}
        <section className="bg-slate-50 px-6 py-24">
          <div className="mx-auto max-w-4xl space-y-12">
            <h2 className="text-4xl lg:text-5xl font-black text-slate-900">Why This Exists</h2>
            <div className="grid gap-12 lg:grid-cols-2">
              <div className="space-y-6">
                <div>
                  <p className="text-sm uppercase tracking-widest font-bold text-slate-600 mb-3">Most companies say:</p>
                  <div className="space-y-2 pl-6 border-l-4 border-slate-300">
                    <p className="text-lg text-slate-600">"Work hard.</p>
                    <p className="text-lg text-slate-600">We'll see."</p>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <p className="text-sm uppercase tracking-widest font-bold text-orange-600 mb-3">We say:</p>
                  <div className="space-y-2 pl-6 border-l-4 border-orange-500">
                    <p className="text-lg font-bold text-slate-900">"Help us reach 30 clients.</p>
                    <p className="text-lg font-bold text-slate-900">You earn 30%."</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid gap-8 pt-8 border-t border-slate-200 lg:grid-cols-2">
              <div className="space-y-2">
                <p className="text-lg font-bold text-slate-900">Clear target.</p>
                <p className="text-slate-600">30 clients across 3 brands.</p>
              </div>
              <div className="space-y-2">
                <p className="text-lg font-bold text-slate-900">Clear reward.</p>
                <p className="text-slate-600">30% Salary Hike when we get there.</p>
              </div>
            </div>
          </div>
        </section>

        {/* This Is Alignment */}
        <section className="bg-gradient-to-br from-slate-950 to-slate-900 px-6 py-24">
          <div className="mx-auto max-w-4xl space-y-12 text-center">
            <h2 className="text-4xl lg:text-5xl font-black text-white">This Is Alignment</h2>
            <div className="space-y-8">
              <div className="space-y-3">
                <p className="text-lg text-slate-300">Your growth is not a promise.</p>
                <p className="text-lg text-slate-300">It's a formula.</p>
              </div>
              <div className="space-y-4 py-8">
                <p className="text-2xl font-black text-white">Execution</p>
                <p className="text-3xl text-slate-500">→</p>
                <p className="text-2xl font-black text-white">Clients</p>
                <p className="text-3xl text-slate-500">→</p>
                <p className="text-2xl font-black text-orange-500">Salary Hike</p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="bg-white px-6 py-24">
          <div className="mx-auto max-w-4xl text-center space-y-12">
            <h2 className="text-4xl lg:text-5xl font-black text-slate-900">Ready?</h2>
            <div className="space-y-6">
              <p className="text-xl text-slate-600">Define your Power Move.</p>
              <p className="text-xl text-slate-600">Start building your 30%.</p>
            </div>
            <Link
              href="/signin"
              className="inline-flex items-center justify-center rounded-lg bg-orange-500 px-12 py-5 text-lg font-bold text-white transition hover:bg-orange-600"
            >
              Enter Dashboard
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
