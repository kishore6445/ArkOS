"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronDown, Plus, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"

interface PowerMove {
  id: string
  name: string
  frequency: string
  progress: number
  target: number
  status: "On Track" | "At Risk" | "Behind"
}

interface PowerMovesRefinedProps {
  powerMoves: PowerMove[]
  onAddPowerMove?: () => void
  onIncrementPowerMove?: (id: string) => void
}

export function PowerMovesRefined({
  powerMoves,
  onAddPowerMove,
  onIncrementPowerMove,
}: PowerMovesRefinedProps) {
  const [expandedId, setExpandedId] = useState<string | null>(powerMoves[0]?.id ?? null)
  const [showAllMoves, setShowAllMoves] = useState(false)

  // Sort by priority: At Risk → Behind → On Track
  const prioritySortedMoves = [...powerMoves].sort((a, b) => {
    const priorityMap = { "At Risk": 0, "Behind": 1, "On Track": 2 }
    return priorityMap[a.status] - priorityMap[b.status]
  })

  // Show top 3-5, rest collapsible
  const displayedMoves = showAllMoves ? prioritySortedMoves : prioritySortedMoves.slice(0, 3)
  const hiddenCount = Math.max(0, prioritySortedMoves.length - 3)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "On Track":
        return "bg-green-50 border-green-200"
      case "At Risk":
        return "bg-amber-50 border-amber-200"
      case "Behind":
        return "bg-red-50 border-red-200"
      default:
        return "bg-slate-50 border-slate-200"
    }
  }

  const getStatusIndicatorColor = (status: string) => {
    switch (status) {
      case "On Track":
        return "bg-green-500"
      case "At Risk":
        return "bg-amber-500"
      case "Behind":
        return "bg-red-500"
      default:
        return "bg-slate-400"
    }
  }

  const getProgressPercentage = (move: PowerMove) => {
    return move.target > 0 ? Math.round((move.progress / move.target) * 100) : 0
  }

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-orange-100 flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-orange-600" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900">Power Moves</h2>
            <p className="text-sm text-slate-600">{powerMoves.length} active {powerMoves.length === 1 ? "move" : "moves"}</p>
          </div>
        </div>
        {powerMoves.length > 0 && (
          <Button
            onClick={onAddPowerMove}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Power Move
          </Button>
        )}
      </div>

      {/* Power Moves Grid */}
      <div className="space-y-4">
        {displayedMoves.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-slate-300 rounded-xl bg-slate-50">
            <p className="text-slate-600 mb-4">No power moves yet</p>
            <Button onClick={onAddPowerMove} className="bg-orange-500 hover:bg-orange-600">
              Create Your First Power Move
            </Button>
          </div>
        ) : (
          displayedMoves.map((move) => (
            <div
              key={move.id}
              className={cn(
                "border rounded-xl p-6 transition-all duration-200 cursor-pointer hover:shadow-md",
                getStatusColor(move.status),
              )}
              onClick={() => setExpandedId(expandedId === move.id ? null : move.id)}
            >
              {/* Main Content */}
              <div className="space-y-4">
                {/* Header Row */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-slate-900 text-balance">{move.name}</h3>
                    <p className="text-sm text-slate-600 mt-1">{move.frequency}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setExpandedId(expandedId === move.id ? null : move.id)
                    }}
                    className="flex-shrink-0 p-2 hover:bg-white/50 rounded-lg transition-colors"
                  >
                    <span className={cn(
                      "text-sm font-semibold transition-all",
                      move.status === "On Track" ? "text-green-600" : 
                      move.status === "At Risk" ? "text-amber-600" : 
                      "text-red-600"
                    )}>
                      {move.status}
                    </span>
                  </button>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-700 font-semibold">{move.progress}/{move.target}</span>
                    <span className="text-slate-600 font-medium">{getProgressPercentage(move)}%</span>
                  </div>
                  <div className="h-2.5 bg-white/70 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-300",
                        move.status === "On Track" ? "bg-green-500" :
                        move.status === "At Risk" ? "bg-amber-500" :
                        "bg-red-500"
                      )}
                      style={{ width: `${Math.min(getProgressPercentage(move), 100)}%` }}
                    />
                  </div>
                </div>

                {/* Expanded Content */}
                {expandedId === move.id && (
                  <div className="pt-4 border-t border-white/40 space-y-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onIncrementPowerMove?.(move.id)
                      }}
                      className="w-full py-2.5 px-4 bg-white/50 hover:bg-white rounded-lg font-semibold text-slate-900 transition-colors"
                    >
                      Log Progress
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}

        {/* Show All Moves Toggle */}
        {hiddenCount > 0 && !showAllMoves && (
          <button
            onClick={() => setShowAllMoves(true)}
            className="w-full py-3 px-4 border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors text-slate-700 font-semibold flex items-center justify-center gap-2"
          >
            <ChevronDown className="h-4 w-4" />
            Show {hiddenCount} more {hiddenCount === 1 ? "move" : "moves"}
          </button>
        )}
      </div>
    </section>
  )
}
