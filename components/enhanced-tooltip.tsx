"use client"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { HelpCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface EnhancedTooltipProps {
  content: string
  children: React.ReactNode
  side?: "top" | "right" | "bottom" | "left"
  asIcon?: boolean
  className?: string
}

export function EnhancedTooltip({
  content,
  children,
  side = "top",
  asIcon = false,
  className,
}: EnhancedTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild className={cn("cursor-help", className)}>
          {asIcon ? (
            <HelpCircle className="h-4 w-4 text-slate-400 hover:text-slate-600 transition-colors" />
          ) : (
            <>{children}</>
          )}
        </TooltipTrigger>
        <TooltipContent side={side} className="animate-fade-in-up">
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
