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
        {/* HERO - 30% Salary Growth as Dominant Message */}
        <section className="bg-gradient-to-br from-slate-950 to-slate-900 px-6 py-48">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-20 lg:grid-cols-2 items-center">
              {/* Left: The Promise */}
              <div className="space-y-10">
                <div className="space-y-6">
                  <div className="space-y-3">
                    <p className="text-sm uppercase tracking-[0.2em] text-orange-500 font-bold">Mission 30 Alignment</p>
                    <h2 className="text-3xl lg:text-4xl font-black text-white leading-tight">
                      When We Get 30 Clients,<br />You Get a 30% Salary Hike.
                    </h2>
                    <p className="text-lg text-slate-300">Clear. Simple. Measurable.</p>
                  </div>
                  <p className="text-base text-slate-400 leading-relaxed max-w-lg">
                    30 active clients across our 3 brands. When that target is achieved, every eligible team member earns a 30% Salary Hike. No politics. No favoritism. No guessing. Only execution.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/signin"
                    className="inline-flex items-center justify-center rounded-lg bg-orange-500 px-8 py-4 text-base font-bold text-white transition hover:bg-orange-600"
                  >
                    Define your Power Move
                  </Link>
                  <Link
                    href="/signin"
                    className="inline-flex items-center justify-center rounded-lg border-2 border-slate-700 px-8 py-4 text-base font-bold text-white transition hover:border-slate-600 hover:bg-slate-900"
                  >
                    Learn more
                  </Link>
                </div>
              </div>

              {/* Right: The Equation */}
              <div className="space-y-8">
                <div className="space-y-4 bg-slate-900 rounded-xl p-8 border border-slate-800">
                  <h3 className="text-sm uppercase tracking-widest text-slate-400 font-bold">The Equation</h3>
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-lg bg-orange-500 flex items-center justify-center text-white font-black text-lg">1</div>
                      <div>
                        <p className="text-sm text-slate-400">Your Power Move</p>
                        <p className="font-semibold text-white">One measurable outcome you're responsible for</p>
                      </div>
                    </div>
                    <div className="flex justify-center text-slate-500 text-xl">↓</div>
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-lg bg-orange-500 flex items-center justify-center text-white font-black text-lg">2</div>
                      <div>
                        <p className="text-sm text-slate-400">More Clients</p>
                        <p className="font-semibold text-white">Your impact helps us reach 30 clients</p>
                      </div>
                    </div>
                    <div className="flex justify-center text-slate-500 text-xl">↓</div>
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-lg bg-green-500 flex items-center justify-center text-white font-black text-lg">3</div>
                      <div>
                        <p className="text-sm text-slate-400">30% Salary Hike</p>
                        <p className="font-semibold text-white">When the company grows, you grow</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-center text-sm text-slate-500 border-t border-slate-800 pt-6">
                  <p>Transparent. Automatic. Fair.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works - Simple 3-Step Flow */}
        <section className="bg-white px-6 py-24">
          <div className="mx-auto max-w-6xl space-y-16">
            <div className="text-center space-y-4">
              <h2 className="text-5xl font-black text-slate-900">How It Works</h2>
              <p className="text-xl text-slate-600">Three simple steps to execution and growth.</p>
            </div>
            <div className="grid gap-8 lg:grid-cols-3">
              {[
                {
                  num: "1",
                  title: "You Define One Power Move",
                  desc: "One measurable outcome you are responsible for. Something that directly helps us reach 30 clients."
                },
                {
                  num: "2",
                  title: "We Track Everything",
                  desc: "Your impact is visible on the dashboard. Numbers don't lie."
                },
                {
                  num: "3",
                  title: "Mission 30 Hits Target",
                  desc: "We reach 30 clients. You receive a 30% Salary Hike. Transparent. Automatic. Fair."
                }
              ].map((item) => (
                <div key={item.num} className="space-y-4 bg-slate-50 rounded-lg p-8 border border-slate-200">
                  <div className="text-5xl font-black text-orange-500">{item.num}</div>
                  <h3 className="text-xl font-black text-slate-900">{item.title}</h3>
                  <p className="text-slate-700 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* This Is Real Alignment */}
        <section className="bg-slate-950 px-6 py-24">
          <div className="mx-auto max-w-6xl">
            <div className="space-y-16 text-center">
              <div className="space-y-4 max-w-3xl mx-auto">
                <h2 className="text-5xl font-black text-white">
                  This Is Real Alignment
                </h2>
                <p className="text-xl text-slate-300">
                  When the company grows, you grow. When Mission 30 wins, you win.
                </p>
                <p className="text-lg text-slate-400 leading-relaxed">
                  Not someday. Not maybe. Not based on mood. Based on results.
                </p>
              </div>
              <div className="grid gap-8 lg:grid-cols-3">
                {[
                  { icon: "✓", label: "Clear", detail: "Mission 30 means 30 clients across 3 brands" },
                  { icon: "✓", label: "Transparent", detail: "Your impact is visible on the dashboard" },
                  { icon: "✓", label: "Earned", detail: "Your 30% Salary Hike is automatic when we win" }
                ].map((item) => (
                  <div key={item.label} className="space-y-2">
                    <p className="text-3xl font-black text-orange-500">{item.icon}</p>
                    <p className="text-lg font-bold text-white">{item.label}</p>
                    <p className="text-slate-400">{item.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA - Action Oriented */}
        <section className="bg-white px-6 py-24">
          <div className="mx-auto max-w-4xl text-center space-y-12">
            <div className="space-y-6">
              <h2 className="text-5xl font-black text-slate-900">
                Ready?
              </h2>
              <div className="space-y-4 text-lg text-slate-600">
                <p>Define your Power Move.</p>
                <p>Start executing.</p>
                <p>Help us reach 30 clients.</p>
                <p className="font-semibold text-slate-900">And earn your 30% Salary Hike.</p>
              </div>
            </div>
            <Link
              href="/signin"
              className="inline-flex items-center justify-center rounded-lg bg-orange-500 px-12 py-5 text-lg font-bold text-white transition hover:bg-orange-600"
            >
              Enter Dashboard
            </Link>
            <div className="pt-8 border-t border-slate-200 space-y-2">
              <p className="text-sm text-slate-600">Already have an account?</p>
              <Link href="/signin" className="text-orange-500 hover:text-orange-600 font-bold">
                Sign in here
              </Link>
            </div>
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
