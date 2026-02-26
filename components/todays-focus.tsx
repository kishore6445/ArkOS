"use client"
import { Button } from "@/components/ui/button"
import { Plus, Target } from "lucide-react"

interface TodaysFocusProps {
  completedToday: number
  totalTarget: number
  onAddPowerMove: () => void
  topPowerMoves?: Array<{ id: string; name: string }>
}

export function TodaysFocus({ completedToday, totalTarget, onAddPowerMove, topPowerMoves = [] }: TodaysFocusProps) {
  const progressPercent = totalTarget > 0 ? (completedToday / totalTarget) * 100 : 0

  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden mt-6">
      <div className="px-6 py-5 border-b border-slate-200 bg-gradient-to-r from-orange-50 to-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Target className="h-5 w-5 text-orange-500" />
            <p className="text-sm font-bold uppercase tracking-wider text-slate-900">Today's Focus</p>
          </div>
          <Button size="sm" onClick={onAddPowerMove} className="bg-orange-500 hover:bg-orange-600 text-white gap-2">
            <Plus className="h-4 w-4" />
            New Move
          </Button>
        </div>
        <p className="text-xs text-slate-600">Your priority power moves for today</p>
      </div>

      <div className="px-6 py-8">
        <div className="space-y-4">
          <div>
            <div className="flex items-end justify-between mb-3">
              <span className="text-xs font-semibold text-slate-600 uppercase">Completed Today</span>
              <span className="text-2xl font-black text-orange-600">{completedToday}</span>
            </div>
            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-orange-500 transition-all duration-500"
                style={{ width: `${Math.min(progressPercent, 100)}%` }}
              />
            </div>
            <p className="text-xs text-slate-500 mt-2">Target: {totalTarget} power moves today</p>
          </div>

          {topPowerMoves.length > 0 && (
            <div className="pt-4 border-t border-slate-200 space-y-2">
              {topPowerMoves.map((move) => (
                <div key={move.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50">
                  <div className="h-2 w-2 rounded-full bg-orange-500" />
                  <p className="text-sm font-medium text-slate-900">{move.name}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
