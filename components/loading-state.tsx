"use client"

import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface LoadingStateProps {
  isLoading: boolean
  loadingText?: string
  children: React.ReactNode
  className?: string
}

export function LoadingState({
  isLoading,
  loadingText = "Loading...",
  children,
  className,
}: LoadingStateProps) {
  if (!isLoading) return <>{children}</>

  return (
    <div className={cn("flex items-center justify-center min-h-[200px]", className)}>
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-6 w-6 text-orange-500 animate-spin" aria-hidden="true" />
        <p className="text-sm text-slate-600">{loadingText}</p>
      </div>
    </div>
  )
}
