"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/client"

export default function SignInPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  useEffect(() => {
    const inviteStatus = searchParams.get("invite")
    const errorParam = searchParams.get("error")
    if (errorParam) {
      setErrorMessage(errorParam)
      setSuccessMessage(null)
      return
    }
    if (inviteStatus === "success") {
      setSuccessMessage("Your account is activated. Please sign in to continue.")
      setErrorMessage(null)
    }
  }, [searchParams])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage(null)
    setIsLoading(true)

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setErrorMessage(error.message)
      setIsLoading(false)
      return
    }

    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl items-stretch px-6 py-12">
        <div className="flex w-full gap-12">
          {/* Left Column - Sign In Form */}
          <div className="flex w-full flex-col justify-center lg:max-w-md">
            <div className="space-y-6">
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-[0.2em] text-orange-500 font-bold">Welcome back</p>
                <h1 className="text-5xl font-black leading-tight">
                  Let's go.
                </h1>
                <p className="text-base text-slate-400">
                  Sign in to your dashboard.
                </p>
              </div>

              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-200" htmlFor="email">
                    Work email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                    className="w-full rounded-lg border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-200" htmlFor="password">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                    className="w-full rounded-lg border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="h-4 w-4 rounded border-white/20 bg-slate-950" />
                    Remember me
                  </label>
                  <button type="button" className="text-orange-500 hover:text-orange-400 font-semibold">
                    Forgot password?
                  </button>
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-lg bg-orange-500 px-6 py-3 text-base font-bold text-white transition hover:bg-orange-600 disabled:opacity-50"
                >
                  {isLoading ? "Signing in..." : "Continue"}
                </button>
                {errorMessage ? (
                  <p className="text-sm text-rose-300 font-semibold">{errorMessage}</p>
                ) : null}
                {successMessage ? (
                  <p className="text-sm text-emerald-300 font-semibold">{successMessage}</p>
                ) : null}
              </form>

              <div className="text-center text-sm text-slate-400">
                New here?{" "}
                <Link href="/signup" className="font-bold text-orange-500 hover:text-orange-400">
                  Create an account
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column - Motivational Message */}
          <div className="hidden flex-col justify-center lg:flex lg:max-w-md">
            <div className="space-y-6 rounded-xl border-2 border-orange-500 bg-gradient-to-br from-orange-500 to-orange-600 p-8">
              <div className="space-y-4">
                <p className="text-white text-xs uppercase tracking-widest font-bold opacity-90">Your Mission</p>
                <h2 className="text-4xl font-black text-white leading-tight">
                  Execute.<br/>Win Mission 50.<br/>Earn 50% hike.
                </h2>
              </div>

              <div className="space-y-4 bg-white rounded-lg p-6">
                <div className="space-y-2">
                  <p className="text-slate-900 font-bold text-sm">Execute Power Moves</p>
                  <p className="text-slate-600 text-sm">Clear actions. Measurable outcomes. You own them.</p>
                </div>
                <div className="h-1 bg-orange-200 rounded-full"></div>
                <div className="space-y-2">
                  <p className="text-slate-900 font-bold text-sm">Win Mission 50</p>
                  <p className="text-slate-600 text-sm">50 clients. 3 brands. Your execution powers it all.</p>
                </div>
                <div className="h-1 bg-orange-200 rounded-full"></div>
                <div className="space-y-2">
                  <p className="text-slate-900 font-bold text-sm">Earn 50% Hike</p>
                  <p className="text-slate-600 text-sm">Your contribution = your growth. Transparent. Fair.</p>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <p className="text-white font-medium">
                  Execution determines everything.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
