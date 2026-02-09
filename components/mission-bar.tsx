"use client"

import { useMission } from "@/lib/mission-context"
import { cn } from "@/lib/utils"

export function MissionBar() {
  const { mission, getProgress } = useMission()
  const progress = getProgress()

  return (
    <div className="bg-slate-100 text-slate-900 px-6 sm:px-8 lg:px-12 py-3 border-b border-slate-200">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between gap-6">
          {/* Mission Info - Compact */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="flex-shrink-0">
              <div className="h-7 w-7 rounded-full bg-orange-500 flex items-center justify-center text-sm font-black text-white">
                🎯
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold uppercase tracking-wide text-orange-600 mb-0">
                {mission.name}
              </p>
            </div>
          </div>

          {/* Progress Display - Compact */}
          <div className="flex items-center gap-4 flex-shrink-0">
            {/* Metric */}
            <div className="text-right">
              <div className="text-sm font-black text-slate-900">
                {mission.totalAchieved}
                <span className="text-slate-400 text-xs mx-0.5">/</span>
                <span className="text-xs font-semibold text-slate-600">{mission.totalTarget}</span>
              </div>
              <p className="text-xs text-slate-500 font-semibold mt-0">
                {Math.round(progress)}%
              </p>
            </div>

            {/* Progress Bar */}
            <div className="w-32 h-1.5 bg-slate-300 rounded-full overflow-hidden flex-shrink-0">
              <div
                className={cn(
                  "h-full transition-all duration-500 rounded-full",
                  progress >= 70 ? "bg-green-500" :
                  progress >= 50 ? "bg-amber-500" :
                  "bg-red-500"
                )}
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
