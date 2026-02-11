"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react"
import { useUser } from "@/lib/user-context"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface AdminUser {
  id: string
  name: string
  email: string
  role: "super_admin" | "dept_admin" | "member" | "viewer"
  status: "active" | "invited" | "disabled"
}

interface PowerMove {
  id: string
  name: string
  frequency: "daily" | "weekly" | "monthly"
  weeklyTarget: number
  owner: string
  ownerId?: string
  brandId: string
  department: string
}

interface PersonalVictoryTarget {
  id: string
  title: string
  goalType: "Quantitative" | "Qualitative" | "Learning"
  userId?: string
  status?: "On Track" | "At Risk" | "Behind"
}

export default function UserPowerMoveDetailPage() {
  const router = useRouter()
  const params = useParams()
  const userId = params.userId as string
  const { currentUser, isLoading: userLoading } = useUser()
  const [user, setUser] = useState<AdminUser | null>(null)
  const [powerMoves, setPowerMoves] = useState<PowerMove[]>([])
  const [goals, setGoals] = useState<PersonalVictoryTarget[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const isAdmin = currentUser?.role === "super_admin" || currentUser?.role === "admin"

  // Check authorization
  useEffect(() => {
    if (userLoading) return
    if (!isAdmin) {
      router.push("/dashboard")
    }
  }, [currentUser, userLoading, isAdmin, router])

  // Load user data
  useEffect(() => {
    let isActive = true

    const loadUserData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Fetch all necessary data
        const [usersRes, powerMovesRes, goalsRes] = await Promise.all([
          fetch("/api/admin/users", { cache: "no-store" }),
          fetch("/api/admin/power-moves", { cache: "no-store" }),
          fetch("/api/admin/personal-victory-targets", { cache: "no-store" }),
        ])

        if (!isActive) return

        const usersData = await usersRes.json().catch(() => ({ users: [] }))
        const powerMovesData = await powerMovesRes.json().catch(() => ({ powerMoves: [] }))
        const goalsData = await goalsRes.json().catch(() => ({ targets: [] }))

        if (!usersRes.ok || !powerMovesRes.ok || !goalsRes.ok) {
          throw new Error("Failed to fetch user data")
        }

        // Find the specific user
        const users: AdminUser[] = Array.isArray(usersData.users) ? usersData.users : []
        const foundUser = users.find((u) => u.id === userId)

        if (!foundUser) {
          throw new Error("User not found")
        }

        // Filter power moves for this user
        const allPowerMoves: PowerMove[] = Array.isArray(powerMovesData.powerMoves)
          ? powerMovesData.powerMoves
          : []
        const userPowerMoves = allPowerMoves.filter((pm) => pm.ownerId === userId)

        // Filter goals for this user
        const allGoals: PersonalVictoryTarget[] = Array.isArray(goalsData.targets) ? goalsData.targets : []
        const userGoals = allGoals.filter((g) => g.userId === userId)

        if (isActive) {
          setUser(foundUser)
          setPowerMoves(userPowerMoves)
          setGoals(userGoals)
        }
      } catch (err) {
        if (isActive) {
          setError(err instanceof Error ? err.message : "Failed to load user data")
        }
      } finally {
        if (isActive) {
          setIsLoading(false)
        }
      }
    }

    if (userId) {
      loadUserData()
    }

    return () => {
      isActive = false
    }
  }, [userId])

  if (userLoading || isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
          <p className="text-slate-600">Loading user data...</p>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>You don't have permission to access this page.</AlertDescription>
        </Alert>
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-slate-50 p-4">
        <div className="max-w-4xl mx-auto">
          <Button variant="ghost" onClick={() => router.back()} className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Team Overview
          </Button>
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">{error || "User not found"}</AlertDescription>
          </Alert>
        </div>
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

  const quantitativeGoals = goals.filter((g) => g.goalType === "Quantitative")
  const qualitativeGoals = goals.filter((g) => g.goalType === "Qualitative")
  const learningGoals = goals.filter((g) => g.goalType === "Learning")

  const getStatusColor = (status?: string) => {
    if (!status) return "bg-slate-100 text-slate-800"
    switch (status.toLowerCase()) {
      case "on track":
      case "on-track":
        return "bg-green-100 text-green-800"
      case "at risk":
      case "at-risk":
        return "bg-yellow-100 text-yellow-800"
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
                    <Badge variant="outline" className="capitalize">
                      {user.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Power Moves Section */}
        <div>
          <h2 className="text-2xl font-black text-slate-900 mb-4">Power Moves ({powerMoves.length})</h2>
          {powerMoves.length === 0 ? (
            <Card className="bg-slate-50">
              <CardContent className="pt-6 text-center text-slate-600">
                <p>No power moves assigned to this user yet.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {powerMoves.map((pm) => (
                <Card key={pm.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-900">{pm.name}</h3>
                        <p className="text-sm text-slate-600 mt-1">
                          Target: {pm.weeklyTarget} per {pm.frequency}
                        </p>
                      </div>
                      <Badge className="capitalize bg-orange-600">{pm.frequency}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Goals Section */}
        <div>
          <h2 className="text-2xl font-black text-slate-900 mb-4">Personal Goals ({goals.length})</h2>
          {goals.length === 0 ? (
            <Card className="bg-slate-50">
              <CardContent className="pt-6 text-center text-slate-600">
                <p>No personal goals defined yet.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Quantitative Goals */}
              <Card className="border-blue-200 bg-blue-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base text-blue-900">Quantitative ({quantitativeGoals.length})</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {quantitativeGoals.length === 0 ? (
                    <p className="text-sm text-slate-600">No quantitative goals</p>
                  ) : (
                    quantitativeGoals.map((goal) => (
                      <div key={goal.id} className="bg-white p-2 rounded border border-blue-100">
                        <p className="text-sm font-semibold text-slate-900">{goal.title}</p>
                        {goal.status && <Badge className={`mt-1 ${getStatusColor(goal.status)}`}>{goal.status}</Badge>}
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>

              {/* Qualitative Goals */}
              <Card className="border-orange-200 bg-orange-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base text-orange-900">Qualitative ({qualitativeGoals.length})</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {qualitativeGoals.length === 0 ? (
                    <p className="text-sm text-slate-600">No qualitative goals</p>
                  ) : (
                    qualitativeGoals.map((goal) => (
                      <div key={goal.id} className="bg-white p-2 rounded border border-orange-100">
                        <p className="text-sm font-semibold text-slate-900">{goal.title}</p>
                        {goal.status && <Badge className={`mt-1 ${getStatusColor(goal.status)}`}>{goal.status}</Badge>}
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>

              {/* Learning Goals */}
              <Card className="border-purple-200 bg-purple-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base text-purple-900">Learning ({learningGoals.length})</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {learningGoals.length === 0 ? (
                    <p className="text-sm text-slate-600">No learning goals</p>
                  ) : (
                    learningGoals.map((goal) => (
                      <div key={goal.id} className="bg-white p-2 rounded border border-purple-100">
                        <p className="text-sm font-semibold text-slate-900">{goal.title}</p>
                        {goal.status && <Badge className={`mt-1 ${getStatusColor(goal.status)}`}>{goal.status}</Badge>}
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
