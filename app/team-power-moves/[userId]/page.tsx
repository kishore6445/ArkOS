"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft } from "lucide-react"
import { useUser, getAllUsers } from "@/lib/user-context"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function UserPowerMoveDetailPage() {
  const router = useRouter()
  const params = useParams()
  const userId = params.userId as string
  const { currentUser } = useUser()
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const allUsers = getAllUsers()
    const foundUser = allUsers.find((u) => u.id === userId)
    if (foundUser) {
      setUser(foundUser)
    }
    setIsLoading(false)
  }, [userId])

  if (!currentUser || currentUser.role !== "super_admin") {
    return (
      <div className="h-screen flex items-center justify-center">
        <Card className="border-2 border-red-200 bg-red-50">
          <CardContent className="pt-6 text-center">
            <p className="text-red-800 font-semibold">Access Denied</p>
            <p className="text-red-600 text-sm mt-2">Only Super Admins can access this</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-500">Loading user data...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <Card className="border-2 border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6 text-center">
            <p className="text-yellow-800 font-semibold">User Not Found</p>
            <Button variant="outline" className="mt-4" onClick={() => router.back()}>
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  // Mock data - in production, fetch from API
  const powerMoves = [
    {
      id: "pm-1",
      name: "Daily Sales Calls",
      targetPerCycle: 10,
      progress: 8,
      frequency: "daily",
      status: "on-track",
    },
    {
      id: "pm-2",
      name: "Client Follow-ups",
      targetPerCycle: 5,
      progress: 4,
      frequency: "daily",
      status: "on-track",
    },
    {
      id: "pm-3",
      name: "Proposal Submissions",
      targetPerCycle: 3,
      progress: 2,
      frequency: "weekly",
      status: "at-risk",
    },
  ]

  const personalGoals = [
    {
      id: "g-1",
      name: "Complete Sales Training",
      goalType: "Quantitative",
      target: 100,
      current: 75,
      status: "On Track",
      quarter: "Q1",
    },
    {
      id: "g-2",
      name: "Master Client Communication",
      goalType: "Qualitative",
      target: 100,
      current: 80,
      status: "On Track",
      quarter: "Q1",
    },
    {
      id: "g-3",
      name: "Learn Advanced Negotiation",
      goalType: "Learning",
      target: 100,
      current: 60,
      status: "At Risk",
      quarter: "Q1",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "On Track":
      case "on-track":
        return "bg-green-100 text-green-800"
      case "At Risk":
      case "at-risk":
        return "bg-yellow-100 text-yellow-800"
      case "Behind":
      case "behind":
        return "bg-red-100 text-red-800"
      default:
        return "bg-slate-100 text-slate-800"
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header with Back Button */}
        <div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="mb-4 text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Team Overview
          </Button>

          {/* User Card */}
          <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-orange-500 text-white font-bold text-lg">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h1 className="text-3xl font-black text-slate-900">{user.name}</h1>
                  <p className="text-slate-600 mt-1">{user.email}</p>
                  <div className="flex gap-2 mt-3">
                    <Badge className="capitalize">{user.role}</Badge>
                    {user.assignments.length > 0 && (
                      <Badge variant="outline" className="capitalize">
                        {user.assignments[0].brand.replace("-", " ")}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Power Moves Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900">Power Moves</h2>
          <div className="grid gap-4">
            {powerMoves.map((pm) => (
              <Card key={pm.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-slate-900">{pm.name}</h3>
                      <p className="text-xs text-slate-500 mt-1">
                        {pm.frequency} • Target: {pm.targetPerCycle}
                      </p>
                    </div>
                    <Badge className={getStatusColor(pm.status)}>{pm.status}</Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Progress</span>
                      <span className="font-semibold">
                        {pm.progress} / {pm.targetPerCycle}
                      </span>
                    </div>
                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-orange-500 transition-all"
                        style={{ width: `${(pm.progress / pm.targetPerCycle) * 100}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Personal Goals Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900">Personal Goals (Q1)</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Quantitative Goals */}
            <div className="space-y-3">
              <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded bg-blue-100 text-blue-700 text-xs font-bold">
                  Q
                </span>
                Quantitative
              </h3>
              {personalGoals
                .filter((g) => g.goalType === "Quantitative")
                .map((goal) => (
                  <Card key={goal.id}>
                    <CardContent className="pt-4">
                      <p className="text-sm font-semibold text-slate-900">{goal.name}</p>
                      <div className="mt-3 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-500">Progress</span>
                          <span className="font-bold">{goal.current}%</span>
                        </div>
                        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 transition-all"
                            style={{ width: `${goal.current}%` }}
                          />
                        </div>
                        <Badge className={getStatusColor(goal.status)} variant="outline">
                          {goal.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>

            {/* Qualitative Goals */}
            <div className="space-y-3">
              <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded bg-purple-100 text-purple-700 text-xs font-bold">
                  Q'
                </span>
                Qualitative
              </h3>
              {personalGoals
                .filter((g) => g.goalType === "Qualitative")
                .map((goal) => (
                  <Card key={goal.id}>
                    <CardContent className="pt-4">
                      <p className="text-sm font-semibold text-slate-900">{goal.name}</p>
                      <div className="mt-3 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-500">Progress</span>
                          <span className="font-bold">{goal.current}%</span>
                        </div>
                        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-purple-500 transition-all"
                            style={{ width: `${goal.current}%` }}
                          />
                        </div>
                        <Badge className={getStatusColor(goal.status)} variant="outline">
                          {goal.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>

            {/* Learning Goals */}
            <div className="space-y-3">
              <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded bg-green-100 text-green-700 text-xs font-bold">
                  L
                </span>
                Learning
              </h3>
              {personalGoals
                .filter((g) => g.goalType === "Learning")
                .map((goal) => (
                  <Card key={goal.id}>
                    <CardContent className="pt-4">
                      <p className="text-sm font-semibold text-slate-900">{goal.name}</p>
                      <div className="mt-3 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-500">Progress</span>
                          <span className="font-bold">{goal.current}%</span>
                        </div>
                        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-green-500 transition-all"
                            style={{ width: `${goal.current}%` }}
                          />
                        </div>
                        <Badge className={getStatusColor(goal.status)} variant="outline">
                          {goal.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
