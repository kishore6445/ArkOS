"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, TrendingUp, Target } from "lucide-react"
import { User } from "@/lib/user-context"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface UserPowerMoveStats {
  totalPowerMoves: number
  completedPowerMoves: number
  completionPercentage: number
  status: "on-track" | "at-risk" | "behind"
  lastUpdated: string
  department?: string
  goalsStatus: {
    quantitative: { onTrack: number; atRisk: number; behind: number }
    qualitative: { onTrack: number; atRisk: number; behind: number }
    learning: { onTrack: number; atRisk: number; behind: number }
  }
}

interface UserPowerMoveCardProps {
  user: User
  stats: UserPowerMoveStats
  onClick: () => void
}

export function UserPowerMoveCard({
  user,
  stats,
  onClick,
}: UserPowerMoveCardProps) {
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
        return <Badge className="bg-green-600">On Track</Badge>
      case "at-risk":
        return <Badge className="bg-yellow-600">At Risk</Badge>
      case "behind":
        return <Badge className="bg-red-600">Behind</Badge>
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

  return (
    <Card className={`cursor-pointer transition-all hover:shadow-lg border-2 ${getStatusColor(stats.status)}`} onClick={onClick}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3 flex-1">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-orange-500 text-white font-bold">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-base truncate">{user.name}</CardTitle>
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
