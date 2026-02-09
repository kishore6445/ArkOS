"use client"

import { useMission } from "@/lib/mission-context"
import { CheckCircle, AlertCircle, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export function CompanyDashboard() {
  const { mission, getProgress } = useMission()
  const progress = getProgress()

  return (
    <section className="pb-8">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white px-6 sm:px-8 lg:px-12 py-12">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl font-black tracking-tight mb-2">{mission.name}</h1>
          <p className="text-lg font-semibold text-slate-200">{mission.description}</p>
        </div>
      </div>

      {/* OVERALL PROGRESS */}
      <div className="px-6 sm:px-8 lg:px-12 py-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <div className="flex items-baseline gap-2 mb-6">
              <div className="text-8xl font-black text-slate-900 leading-none">
                {mission.totalAchieved}
              </div>
              <div>
                <div className="text-2xl font-black text-slate-500">/ {mission.totalTarget}</div>
                <p className="text-sm text-slate-600 font-semibold mt-1">clients onboarded</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-3 bg-slate-300 rounded-full overflow-hidden mb-4">
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

            {/* Status */}
            <div className="flex items-center gap-3">
              {progress >= 70 ? <CheckCircle className="h-6 w-6 text-green-600" /> :
               progress >= 50 ? <AlertCircle className="h-6 w-6 text-amber-600" /> :
               <XCircle className="h-6 w-6 text-red-600" />}
              <span className="text-lg font-bold">
                {progress >= 70 ? "On Track" :
                 progress >= 50 ? "At Risk" :
                 "Behind Target"}
              </span>
              <span className="text-lg font-semibold text-slate-600 ml-2">
                ({Math.round(progress)}% complete)
              </span>
            </div>
          </div>

          {/* BRAND BREAKDOWN */}
          <div className="mt-12 pt-12 border-t border-slate-200">
            <h2 className="text-2xl font-black text-slate-900 mb-8">Contribution by Brand</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {mission.brandBreakdown.map((brand) => {
                const brandProgress = (brand.achieved / brand.target) * 100
                return (
                  <div
                    key={brand.name}
                    className="rounded-xl border-2 border-slate-200 p-8 hover:border-slate-300 hover:bg-slate-50 transition-all duration-300"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div
                        className="h-10 w-10 rounded-full"
                        style={{ backgroundColor: brand.color }}
                      />
                      <h3 className="text-lg font-black text-slate-900">{brand.name}</h3>
                    </div>

                    <div className="mb-6">
                      <div className="flex items-baseline gap-2 mb-2">
                        <div className="text-5xl font-black text-slate-900">
                          {brand.achieved}
                        </div>
                        <div className="text-xl font-bold text-slate-500">/ {brand.target}</div>
                      </div>
                      <p className="text-sm text-slate-600 font-semibold">clients onboarded</p>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden mb-4">
                      <div
                        className="h-full transition-all duration-500 rounded-full"
                        style={{
                          width: `${Math.min(brandProgress, 100)}%`,
                          backgroundColor: brand.color,
                        }}
                      />
                    </div>

                    {/* Status */}
                    <div className="flex items-center gap-2">
                      {brandProgress >= 70 ? <CheckCircle className="h-4 w-4 text-green-600" /> :
                       brandProgress >= 50 ? <AlertCircle className="h-4 w-4 text-amber-600" /> :
                       <XCircle className="h-4 w-4 text-red-600" />}
                      <span className="text-sm font-bold">
                        {Math.round(brandProgress)}%
                      </span>
                      <span className="text-sm text-slate-600 ml-auto">
                        {brandProgress >= 70 ? "On Track" :
                         brandProgress >= 50 ? "At Risk" :
                         "Behind"}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
