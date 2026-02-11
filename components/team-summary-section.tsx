"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Target, TrendingUp, AlertCircle } from "lucide-react"
import { COMPANY_MISSION } from "@/lib/mission-context"

interface TeamSummarySectionProps {
  totalMembers: number
  onTrackCount: number
  atRiskCount: number
  behindCount: number
  averageCompletion: number
  departmentStats: Array<{
    name: string
    memberCount: number
    completionPercentage: number
  }>
}

export function TeamSummarySection({
  totalMembers,
  onTrackCount,
  atRiskCount,
  behindCount,
  averageCompletion,
  departmentStats,
}: TeamSummarySectionProps) {
  const missionProgress = (COMPANY_MISSION.totalAchieved / COMPANY_MISSION.totalTarget) * 100

  return (
    <div className="space-y-4">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                <p className="text-sm text-slate-600">Team Members</p>
              </div>
              <p className="text-3xl font-black text-blue-900">{totalMembers}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <p className="text-sm text-slate-600">On Track</p>
              </div>
              <p className="text-3xl font-black text-green-900">{onTrackCount}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
                <p className="text-sm text-slate-600">At Risk</p>
              </div>
              <p className="text-3xl font-black text-yellow-900">{atRiskCount}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <p className="text-sm text-slate-600">Behind</p>
              </div>
              <p className="text-3xl font-black text-red-900">{behindCount}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mission Progress Card */}
      <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-900">
            <Target className="h-5 w-5" />
            Mission 35 Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-700">Company Target</span>
              <span className="text-sm font-bold text-orange-900">
                {COMPANY_MISSION.totalAchieved} / {COMPANY_MISSION.totalTarget} Clients
              </span>
            </div>
            <div className="h-3 bg-orange-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-orange-600 transition-all"
                style={{ width: `${Math.min(missionProgress, 100)}%` }}
              />
            </div>
            <p className="text-xs text-orange-700">{missionProgress.toFixed(1)}% Complete</p>
          </div>

          {/* Brand Breakdown */}
          <div className="grid grid-cols-3 gap-3 pt-2 border-t border-orange-200">
            {COMPANY_MISSION.brandBreakdown.map((brand) => (
              <div key={brand.name} className="space-y-1">
                <p className="text-xs font-semibold text-slate-700">{brand.name.split(" ")[0]}</p>
                <p className="text-lg font-black" style={{ color: brand.color }}>
                  {brand.achieved}/{brand.target}
                </p>
                <p className="text-xs text-slate-500">{((brand.achieved / brand.target) * 100).toFixed(0)}%</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Department Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Department Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {departmentStats.map((dept) => (
              <div key={dept.name} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-700">{dept.name}</span>
                  <span className="text-sm text-slate-500">{dept.memberCount} members</span>
                </div>
                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 transition-all"
                    style={{ width: `${dept.completionPercentage}%` }}
                  />
                </div>
                <p className="text-xs text-slate-500">{dept.completionPercentage}% avg completion</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
