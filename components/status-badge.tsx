"use client"

import { cn } from "@/lib/utils"
import { CheckCircle, AlertCircle, XCircle } from "lucide-react"

type StatusType = "complete" | "pending" | "behind"

interface StatusBadgeProps {
  status: StatusType
  label: string
  className?: string
  showIcon?: boolean
}

export function StatusBadge({ status, label, className, showIcon = true }: StatusBadgeProps) {
  const getStyles = () => {
    switch (status) {
      case "complete":
        return {
          container: "bg-green-100 text-green-700 border border-green-200",
          icon: CheckCircle,
        }
      case "pending":
        return {
          container: "bg-slate-100 text-slate-700 border border-slate-200",
          icon: AlertCircle,
        }
      case "behind":
        return {
          container: "bg-red-100 text-red-700 border border-red-200",
          icon: XCircle,
        }
    }
  }

  const styles = getStyles()
  const Icon = styles.icon

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold transition-all duration-200",
        styles.container,
        className,
      )}
      role="status"
      aria-label={`${label}: ${status}`}
    >
      {showIcon && <Icon className="h-3.5 w-3.5" aria-hidden="true" />}
      {label}
    </span>
  )
}
