"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, TrendingUp, Target } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface AdminUser {
  id: string
  name: string
  email: string
  role: "super_admin" | "dept_admin" | "member" | "viewer"
  status: "active" | "invited" | "disabled"
}

interface UserPowerMoveStats {
  totalPowerMoves: number
  completedPowerMoves: number
  completionPercentage: number
  status: "on-track" | "at-risk" | "behind"
  lastUpdated: string
  department?: string
  goalsStatus: {
    quantitative: { count: number }
    qualitative: { count: number }
    learning: { count: number }
  }
}

interface TeamMemberData {
  user: AdminUser
  stats: UserPowerMoveStats
}

interface UserPowerMoveCardProps {
  member: TeamMemberData
}

export function UserPowerMoveCard({ member }: UserPowerMoveCardProps) {
  const { user, stats } = member

  const getStatusColor = (status: string) => {
    switch (status) {
      case "on-track":
        return "bg-green-50 border-green-200"
      case "at-risk":
        return "bg-yellow-50 border-yellow-200"
      case "behind":
        return "bg-red-50 border-red-200"
      default:
        return "bg-slate-50 border-slate-200"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "on-track":
        return <Badge className="bg-green-600 text-white">On Track</Badge>
      case "at-risk":
        return <Badge className="bg-yellow-600 text-white">At Risk</Badge>
      case "behind":
        return <Badge className="bg-red-600 text-white">Behind</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const getTotalGoals = () =>
    stats.goalsStatus.quantitative.count +
    stats.goalsStatus.qualitative.count +
    stats.goalsStatus.learning.count

  return (
    <Card className={`transition-all hover:shadow-lg border-2 h-full ${getStatusColor(stats.status)}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Avatar className="h-10 w-10 flex-shrink-0">
              <AvatarFallback className="bg-orange-500 text-white font-bold text-sm">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-base font-bold text-slate-900 truncate">{user.name}</CardTitle>
              <p className="text-xs text-slate-600 truncate">{user.email}</p>
            </div>
          </div>
          <div>{getStatusBadge(stats.status)}</div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Power Moves Metric */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-slate-600" />
              <span className="text-sm font-semibold text-slate-700">Power Moves</span>
            </div>
            <span className="text-xs font-bold text-slate-600">{stats.totalPowerMoves} total</span>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600">{stats.completionPercentage}% Complete</span>
              <span className="text-slate-500">
                {stats.completedPowerMoves}/{stats.totalPowerMoves}
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  stats.status === "on-track"
                    ? "bg-green-600"
                    : stats.status === "at-risk"
                      ? "bg-yellow-600"
                      : "bg-red-600"
                }`}
                style={{ width: `${stats.completionPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Goals Breakdown */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-4 w-4 text-slate-600" />
            <span className="text-sm font-semibold text-slate-700">Goals</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-white rounded-lg p-2 text-center border border-slate-200">
              <p className="text-xl font-bold text-blue-600">{stats.goalsStatus.quantitative.count}</p>
              <p className="text-xs text-slate-600">Quantitative</p>
            </div>
            <div className="bg-white rounded-lg p-2 text-center border border-slate-200">
              <p className="text-xl font-bold text-orange-600">{stats.goalsStatus.qualitative.count}</p>
              <p className="text-xs text-slate-600">Qualitative</p>
            </div>
            <div className="bg-white rounded-lg p-2 text-center border border-slate-200">
              <p className="text-xl font-bold text-purple-600">{stats.goalsStatus.learning.count}</p>
              <p className="text-xs text-slate-600">Learning</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-200">
          <span className="text-xs text-slate-500">Updated {stats.lastUpdated}</span>
          <ArrowRight className="h-4 w-4 text-slate-400" />
        </div>
      </CardContent>
    </Card>
  )
}
              <p className="text-xs text-slate-500 truncate">{user.role}</p>
            </div>
          </div>
          {getStatusBadge(stats.status)}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Power Moves Section */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-orange-500" />
            <p className="text-sm font-semibold text-slate-900">Power Moves</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-orange-500 transition-all"
                  style={{ width: `${stats.completionPercentage}%` }}
                />
              </div>
            </div>
            <span className="text-sm font-bold text-slate-900 whitespace-nowrap">
              {stats.completedPowerMoves}/{stats.totalPowerMoves}
            </span>
          </div>
          <p className="text-xs text-slate-500">{stats.completionPercentage}% Complete</p>
        </div>

        {/* Goals Summary */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-slate-600" />
            <p className="text-sm font-semibold text-slate-900">Goals Status</p>
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="bg-white rounded p-2 border border-slate-200">
              <p className="font-semibold text-slate-700">Q</p>
              <p className="text-green-600">{stats.goalsStatus.quantitative.onTrack}</p>
              <p className="text-slate-500">on track</p>
            </div>
            <div className="bg-white rounded p-2 border border-slate-200">
              <p className="font-semibold text-slate-700">Q'</p>
              <p className="text-green-600">{stats.goalsStatus.qualitative.onTrack}</p>
              <p className="text-slate-500">on track</p>
            </div>
            <div className="bg-white rounded p-2 border border-slate-200">
              <p className="font-semibold text-slate-700">L</p>
              <p className="text-green-600">{stats.goalsStatus.learning.onTrack}</p>
              <p className="text-slate-500">on track</p>
            </div>
          </div>
        </div>

        {/* Last Updated and Button */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-200">
          <p className="text-xs text-slate-400">{stats.lastUpdated}</p>
          <Button variant="ghost" size="sm" className="h-8 gap-1 text-orange-600 hover:bg-orange-50">
            View <ArrowRight className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
