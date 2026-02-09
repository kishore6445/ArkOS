"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Target, TrendingUp, Plus, ArrowRight } from "lucide-react"
import type { PowerMove } from "./department-page"
import { getBPRStatus, getProgressPercentage } from "@/lib/bpr-status"
import { MicroCelebration } from "@/components/micro-celebration"
import { cn } from "@/lib/utils"

interface PowerMovesTableProps {
  powerMoves: PowerMove[]
  title?: string
  description?: string
  onAddPowerMove?: () => void
  isComplete?: boolean
  onIncrementPowerMove?: (id: string, nextProgress: number) => void
}

export function PowerMovesTable({
  powerMoves: initialPowerMoves,
  title,
  description,
  onAddPowerMove,
  isComplete = false,
  onIncrementPowerMove,
}: PowerMovesTableProps) {
  const [powerMoves, setPowerMoves] = useState(initialPowerMoves)
  const [celebration, setCelebration] = useState<{ show: boolean; message: string }>({
    show: false,
    message: "",
  })
  const [completionCount, setCompletionCount] = useState(0)

  useEffect(() => {
    setPowerMoves(initialPowerMoves)
    setCompletionCount(initialPowerMoves.filter((pm) => pm.progress >= pm.targetPerCycle).length)
  }, [initialPowerMoves])

  const incrementProgress = (id: string) => {
    setPowerMoves((prev) =>
      prev.map((pm) => {
        const targetPerCycle = Math.max(pm.targetPerCycle || 0, 1)
        if (pm.id === id && pm.progress < targetPerCycle) {
          const newProgress = pm.progress + 1
          const isNowComplete = newProgress >= targetPerCycle

          setCompletionCount((c) => c + 1)

          if (isNowComplete) {
            setCelebration({
              show: true,
              message: `${pm.name} Complete!`,
            })
          } else if (newProgress === Math.floor(targetPerCycle / 2)) {
            setCelebration({
              show: true,
              message: `Halfway there! ${newProgress}/${targetPerCycle}`,
            })
          } else if ((completionCount + 1) % 5 === 0) {
            setCelebration({
              show: true,
              message: `That's #${completionCount + 1} today!`,
            })
          }

          onIncrementPowerMove?.(pm.id, newProgress)

          return { ...pm, progress: newProgress }
        }
        return pm
      }),
    )
  }

  const [showCompleted, setShowCompleted] = useState(false)
  
  const activePowerMoves = powerMoves.filter((pm) => pm.progress < pm.targetPerCycle)
  const completedPowerMoves = powerMoves.filter((pm) => pm.progress >= pm.targetPerCycle)
  
  const totalProgress = powerMoves.reduce((sum, pm) => sum + pm.progress, 0)
  const totalTarget = powerMoves.reduce((sum, pm) => sum + pm.targetPerCycle, 0)
  const allComplete = totalProgress >= totalTarget && totalTarget > 0

  return (
    <>
      <MicroCelebration
        show={celebration.show}
        message={celebration.message}
        onComplete={() => setCelebration({ show: false, message: "" })}
      />

      <div className="border rounded-lg overflow-hidden bg-white">
        {/* SECTION HEADER - Clear hierarchy */}
        <div className="px-4 py-4 border-b bg-stone-50 space-y-1">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-5 w-5 text-stone-600" />
            <h3 className="text-lg font-bold text-stone-900">{title || "Power Moves"}</h3>
            {powerMoves.length > 0 && (
              <span className="text-xs font-semibold px-2 py-1 rounded-full bg-stone-100 text-stone-600">
                {totalProgress} of {totalTarget} This Week
              </span>
            )}
          </div>
          <p className="text-sm text-stone-500 ml-8">{description || "Lead measures that drive Victory Targets"}</p>
          {onAddPowerMove && (
            <Button onClick={onAddPowerMove} variant="ghost" size="sm" className="h-7 gap-1 text-stone-600 -ml-2 mt-2">
              <Plus className="h-4 w-4" />
              Add Power Move
            </Button>
          )}
        </div>

        {allComplete && powerMoves.length > 0 && (
          <div className="px-4 py-2 bg-stone-50 border-b">
            <p className="text-xs text-stone-500 italic">These Power Moves created this result.</p>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[640px]">
            <thead>
              <tr className="border-b bg-white">
                <th className="text-left py-3 px-4 font-medium text-xs text-stone-500 uppercase tracking-wider">
                  Power move
                </th>
                <th className="text-center py-3 px-3 font-medium text-xs text-stone-500 uppercase tracking-wider">
                  Frequency
                </th>
                <th className="text-center py-3 px-3 font-medium text-xs text-stone-500 uppercase tracking-wider">
                  Target
                </th>
                <th className="text-center py-3 px-3 font-medium text-xs text-stone-500 uppercase tracking-wider">
                  Actual
                </th>
                <th className="text-center py-3 px-3 font-medium text-xs text-stone-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-center py-3 px-3 font-medium text-xs text-stone-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {activePowerMoves.map((pm) => {
                const targetPerCycle = Math.max(pm.targetPerCycle || 0, 1)
                const progress = getProgressPercentage(pm.progress, targetPerCycle)
                const status = getBPRStatus(pm.progress, targetPerCycle)
                const isRowComplete = pm.progress >= targetPerCycle
                const completionLabel = isRowComplete ? "COMPLETED" : "IN PROGRESS"

                return (
                  <tr
                    key={pm.id}
                    className={cn(
                      "border-b last:border-b-0 hover:bg-stone-50 transition-colors",
                      "border-l-4",
                      status === "green" && "border-l-emerald-500 bg-emerald-50/30",
                      status === "yellow" && "border-l-amber-400 bg-amber-50/30",
                      status === "red" && "border-l-rose-400 bg-rose-50/30",
                    )}
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div>
                          <p className="font-medium text-sm text-stone-800">{pm.name}</p>
                          <p className="text-xs text-stone-400 mt-0.5">{pm.owner}</p>
                        </div>
                        {pm.linkedVictoryTarget && (
                          <div className="flex items-center gap-1 text-stone-300" title="Drives Victory Target">
                            <ArrowRight className="h-3 w-3" />
                            <Target className="h-3 w-3" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <Badge variant="secondary" className="text-sm font-bold px-3 py-1.5 bg-stone-100 text-stone-700 border border-stone-300">
                        {pm.frequency}
                      </Badge>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <p className="text-xl font-bold tabular-nums text-stone-800">{pm.targetPerCycle}</p>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <p className="text-3xl font-bold tabular-nums text-stone-800">{pm.progress}</p>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <Badge
                        className={cn(
                          "font-bold text-xs px-3 py-1",
                          isRowComplete
                            ? "bg-emerald-100 text-emerald-700 border-emerald-300"
                            : "bg-stone-100 text-stone-700 border-stone-300",
                        )}
                      >
                        {completionLabel}
                      </Badge>
                      <p className="text-xs text-stone-500 mt-1 tabular-nums">{progress}%</p>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => incrementProgress(pm.id)}
                        disabled={isRowComplete}
                        className={cn(
                          "h-10 w-10 p-0 text-sm font-semibold transition-all",
                          isRowComplete
                            ? "bg-stone-100 text-stone-400 border-stone-200"
                            : "hover:bg-stone-100 border-stone-300 text-stone-700",
                        )}
                        aria-label={`Mark one ${pm.name} complete`}
                      >
                        {isRowComplete ? "✓" : "+1"}
                      </Button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Completed Power Moves - Collapsible */}
        {completedPowerMoves.length > 0 && (
          <div className="border-t bg-stone-50">
            <button
              onClick={() => setShowCompleted(!showCompleted)}
              className="w-full px-4 py-3 text-left text-sm font-semibold text-stone-600 hover:bg-stone-100 transition-colors flex items-center justify-between"
            >
              <span>Show {completedPowerMoves.length} Completed Power Move{completedPowerMoves.length !== 1 ? 's' : ''}</span>
              <span className="text-stone-400">{showCompleted ? '▼' : '▶'}</span>
            </button>
            {showCompleted && (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse min-w-[640px]">
                  <tbody>
                    {completedPowerMoves.map((pm) => {
                      const targetPerCycle = Math.max(pm.targetPerCycle || 0, 1)
                      const progress = getProgressPercentage(pm.progress, targetPerCycle)

                      return (
                        <tr
                          key={pm.id}
                          className="border-b last:border-b-0 border-l-4 border-l-emerald-500 bg-emerald-50/20"
                        >
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <div>
                                <p className="font-medium text-sm text-stone-700 line-through">{pm.name}</p>
                                <p className="text-xs text-stone-400 mt-0.5">{pm.owner}</p>
                              </div>
                              {pm.linkedVictoryTarget && (
                                <div className="flex items-center gap-1 text-stone-300" title="Drives Victory Target">
                                  <ArrowRight className="h-3 w-3" />
                                  <Target className="h-3 w-3" />
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-3 text-center">
                            <Badge variant="secondary" className="text-sm font-bold px-3 py-1.5 bg-stone-100 text-stone-700 border border-stone-300">
                              {pm.frequency}
                            </Badge>
                          </td>
                          <td className="py-3 px-3 text-center">
                            <p className="text-xl font-bold tabular-nums text-stone-600">{pm.targetPerCycle}</p>
                          </td>
                          <td className="py-3 px-3 text-center">
                            <p className="text-3xl font-bold tabular-nums text-emerald-600">{pm.progress}</p>
                          </td>
                          <td className="py-3 px-3 text-center">
                            <Badge className="font-bold text-xs px-3 py-1 bg-emerald-100 text-emerald-700 border-emerald-300">
                              COMPLETED
                            </Badge>
                            <p className="text-xs text-stone-500 mt-1 tabular-nums">{progress}%</p>
                          </td>
                          <td className="py-3 px-3 text-center">
                            <div className="h-10 w-10 mx-auto rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold">
                              ✓
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {powerMoves.length === 0 && (
          <div className="text-center py-12 bg-white">
            <TrendingUp className="h-10 w-10 mx-auto text-stone-300 mb-3" />
            <p className="text-sm font-medium text-stone-500">Execution visibility is incomplete.</p>
            <p className="text-xs text-stone-400 mt-1">Add Power Moves to track lead measures.</p>
          </div>
        )}
      </div>
    </>
  )
}
