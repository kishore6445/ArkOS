"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { supabase } from "@/lib/supabase/client"

function getHashParams(hash: string) {
  const trimmed = hash.startsWith("#") ? hash.slice(1) : hash
  const params = new URLSearchParams(trimmed)
  return {
    accessToken: params.get("access_token"),
    refreshToken: params.get("refresh_token"),
    error: params.get("error"),
    errorDescription: params.get("error_description"),
  }
}

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const handleCallback = async () => {
      const hashParams = typeof window !== "undefined" ? getHashParams(window.location.hash) : null
      if (hashParams?.error) {
        const message = hashParams.errorDescription || hashParams.error
        router.replace(`/signin?error=${encodeURIComponent(message)}`)
        return
      }

      if (hashParams?.accessToken && hashParams?.refreshToken) {
        const { error } = await supabase.auth.setSession({
          access_token: hashParams.accessToken,
          refresh_token: hashParams.refreshToken,
        })
        if (error) {
          router.replace(`/signin?error=${encodeURIComponent(error.message)}`)
          return
        }
        router.replace("/set-password")
        return
      }

      const errorParam = searchParams.get("error")
      if (errorParam) {
        router.replace(`/signin?error=${encodeURIComponent(errorParam)}`)
        return
      }

      const code = searchParams.get("code")
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (error) {
          router.replace(`/signin?error=${encodeURIComponent(error.message)}`)
          return
        }
        router.replace("/set-password")
        return
      } else {
        await supabase.auth.getSession()
      }

      router.replace("/signin?invite=success")
    }

    handleCallback()
  }, [router, searchParams])

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
      <p className="text-sm text-slate-300">Activating your account…</p>
    </div>
  )
}
