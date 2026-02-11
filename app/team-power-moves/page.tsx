"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Filter, AlertCircle, Loader2 } from "lucide-react"
import { useUser } from "@/lib/user-context"
import { UserPowerMoveCard } from "@/components/user-power-move-card"
import { TeamSummarySection } from "@/components/team-summary-section"
import { Alert, AlertDescription } from "@/components/ui/alert"

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

interface AdminUser {
  id: string
  name: string
  email: string
  role: "super_admin" | "dept_admin" | "member" | "viewer"
  status: "active" | "invited" | "disabled"
  lastUpdated?: string
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

export default function TeamPowerMovesPage() {
  const router = useRouter()
  const { currentUser, isLoading: userLoading } = useUser()
  const [teamMembers, setTeamMembers] = useState<TeamMemberData[]>([])
  const [filteredMembers, setFilteredMembers] = useState<TeamMemberData[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Check if user is super_admin
  const isAdmin = currentUser?.role === "super_admin" || currentUser?.role === "admin"

  useEffect(() => {
    if (userLoading) return
    if (!isAdmin) {
      router.push("/dashboard")
      return
    }
  }, [currentUser, userLoading, isAdmin, router])

  // Load all data
  useEffect(() => {
    let isActive = true

    const loadTeamData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Fetch users, power moves, and personal victory targets in parallel
        const [usersRes, powerMovesRes, goalsRes] = await Promise.all([
          fetch("/api/admin/users", { cache: "no-store" }),
          fetch("/api/admin/power-moves", { cache: "no-store" }),
          fetch("/api/admin/personal-victory-targets", { cache: "no-store" }),
        ])

        if (!isActive) return

        // Parse responses
        const usersData = await usersRes.json().catch(() => ({ users: [] }))
        const powerMovesData = await powerMovesRes.json().catch(() => ({ powerMoves: [] }))
        const goalsData = await goalsRes.json().catch(() => ({ targets: [] }))

        if (!usersRes.ok || !powerMovesRes.ok || !goalsRes.ok) {
          throw new Error("Failed to fetch team data")
        }

        const users: AdminUser[] = Array.isArray(usersData.users) ? usersData.users : []
        const powerMoves: PowerMove[] = Array.isArray(powerMovesData.powerMoves) ? powerMovesData.powerMoves : []
        const goals: PersonalVictoryTarget[] = Array.isArray(goalsData.targets) ? goalsData.targets : []

        // Group power moves by owner ID
        const powerMovesByOwner = new Map<string, PowerMove[]>()
        powerMoves.forEach((pm) => {
          if (pm.ownerId) {
            const existing = powerMovesByOwner.get(pm.ownerId) || []
            powerMovesByOwner.set(pm.ownerId, [...existing, pm])
          }
        })

        // Group goals by user ID
        const goalsByUser = new Map<string, PersonalVictoryTarget[]>()
        goals.forEach((goal) => {
          if (goal.userId) {
            const existing = goalsByUser.get(goal.userId) || []
            goalsByUser.set(goal.userId, [...existing, goal])
          }
        })

        // Build team members data
        const members: TeamMemberData[] = users
          .filter((user) => user.role !== "super_admin" && user.status === "active") // Exclude super admin
          .map((user) => {
            const userPowerMoves = powerMovesByOwner.get(user.id) || []
            const userGoals = goalsByUser.get(user.id) || []

            // Calculate completion percentage (mock: 40-95%)
            const completionPercentage = 40 + Math.floor(Math.random() * 55)
            const status: "on-track" | "at-risk" | "behind" =
              completionPercentage >= 75 ? "on-track" : completionPercentage >= 50 ? "at-risk" : "behind"

            // Count goals by type
            const quantitativeCount = userGoals.filter((g) => g.goalType === "Quantitative").length
            const qualitativeCount = userGoals.filter((g) => g.goalType === "Qualitative").length
            const learningCount = userGoals.filter((g) => g.goalType === "Learning").length

            return {
              user,
              stats: {
                totalPowerMoves: userPowerMoves.length,
                completedPowerMoves: Math.floor((completionPercentage / 100) * userPowerMoves.length),
                completionPercentage,
                status,
                lastUpdated: user.lastUpdated || "2h ago",
                department: userPowerMoves[0]?.department || "marketing",
                goalsStatus: {
                  quantitative: { count: quantitativeCount },
                  qualitative: { count: qualitativeCount },
                  learning: { count: learningCount },
                },
              },
            }
          })

        if (isActive) {
          setTeamMembers(members)
          setFilteredMembers(members)
        }
      } catch (err) {
        if (isActive) {
          setError(err instanceof Error ? err.message : "Failed to load team data")
          setTeamMembers([])
          setFilteredMembers([])
        }
      } finally {
        if (isActive) {
          setIsLoading(false)
        }
      }
    }

    loadTeamData()

    return () => {
      isActive = false
    }
  }, [])

  // Filter members based on search and filters
  useEffect(() => {
    let filtered = teamMembers

    if (searchQuery) {
      filtered = filtered.filter((member) =>
        member.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.user.email.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (departmentFilter !== "all") {
      filtered = filtered.filter((member) => member.stats.department === departmentFilter)
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((member) => member.stats.status === statusFilter)
    }

    setFilteredMembers(filtered)
  }, [teamMembers, searchQuery, departmentFilter, statusFilter])

  const handleUserClick = (userId: string) => {
    router.push(`/team-power-moves/${userId}`)
  }

  if (userLoading || isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
          <p className="text-slate-600">Loading team data...</p>
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

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-slate-900 mb-2">Team Power Moves</h1>
          <p className="text-lg text-slate-600">Monitor execution across your team and drive Mission 35 forward</p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        {/* Team Summary Section */}
        <div className="mb-8">
          <TeamSummarySection teamMembers={teamMembers} />
        </div>

        {/* Filters and Search */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="sales">Sales</SelectItem>
                <SelectItem value="accounts">Accounts</SelectItem>
                <SelectItem value="execution">Execution</SelectItem>
                <SelectItem value="leadership">Leadership</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="on-track">On Track</SelectItem>
                <SelectItem value="at-risk">At Risk</SelectItem>
                <SelectItem value="behind">Behind</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Team Members Grid */}
        <div className="mb-8">
          {filteredMembers.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-slate-600">No team members found matching your filters.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMembers.map((member) => (
                <div
                  key={member.user.id}
                  onClick={() => handleUserClick(member.user.id)}
                  className="cursor-pointer"
                >
                  <UserPowerMoveCard member={member} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Results count */}
        <div className="text-center text-sm text-slate-600">
          Showing {filteredMembers.length} of {teamMembers.length} team members
        </div>
      </div>
    </div>
  )
}
      filtered = filtered.filter((member) => member.stats.department === departmentFilter)
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((member) => member.stats.status === statusFilter)
    }

    setFilteredMembers(filtered)
  }, [searchQuery, departmentFilter, statusFilter, teamMembers])

  // Calculate summary stats
  const onTrackCount = teamMembers.filter((m) => m.stats.status === "on-track").length
  const atRiskCount = teamMembers.filter((m) => m.stats.status === "at-risk").length
  const behindCount = teamMembers.filter((m) => m.stats.status === "behind").length
  const averageCompletion =
    teamMembers.length > 0
      ? Math.round(teamMembers.reduce((sum, m) => sum + m.stats.completionPercentage, 0) / teamMembers.length)
      : 0

  // Department breakdown
  const departmentStats = ["marketing", "sales", "accounts", "execution"].map((dept) => {
    const deptMembers = teamMembers.filter((m) => m.stats.department === dept)
    const avgCompletion =
      deptMembers.length > 0
        ? Math.round(deptMembers.reduce((sum, m) => sum + m.stats.completionPercentage, 0) / deptMembers.length)
        : 0
    return {
      name: dept.charAt(0).toUpperCase() + dept.slice(1),
      memberCount: deptMembers.length,
      completionPercentage: avgCompletion,
    }
  })

  const handleUserClick = (userId: string) => {
    router.push(`/team-power-moves/${userId}`)
  }

  if (!currentUser || currentUser.role !== "super_admin") {
    return (
      <div className="h-screen flex items-center justify-center">
        <Card className="border-2 border-red-200 bg-red-50">
          <CardContent className="pt-6 text-center">
            <p className="text-red-800 font-semibold">Access Denied</p>
            <p className="text-red-600 text-sm mt-2">Only Super Admins can view this page</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-slate-900">Team Power Moves</h1>
          <p className="text-lg text-slate-600">Monitor execution across your entire organization</p>
        </div>

        {/* Summary Section */}
        <TeamSummarySection
          totalMembers={teamMembers.length}
          onTrackCount={onTrackCount}
          atRiskCount={atRiskCount}
          behindCount={behindCount}
          averageCompletion={averageCompletion}
          departmentStats={departmentStats}
        />

        {/* Team Members Section */}
        <div className="space-y-4">
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold text-slate-900">Team Members</h2>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search team members..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                  <SelectItem value="accounts">Accounts</SelectItem>
                  <SelectItem value="execution">Execution</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="on-track">On Track</SelectItem>
                  <SelectItem value="at-risk">At Risk</SelectItem>
                  <SelectItem value="behind">Behind</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Team Members Grid */}
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-slate-500">Loading team data...</p>
            </div>
          ) : filteredMembers.length === 0 ? (
            <Card className="bg-slate-50 border-slate-200">
              <CardContent className="pt-12 pb-12 text-center">
                <p className="text-slate-500 font-semibold">No team members found</p>
                <p className="text-slate-400 text-sm mt-2">Try adjusting your filters</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMembers.map((member) => (
                <UserPowerMoveCard
                  key={member.user.id}
                  user={member.user}
                  stats={member.stats}
                  onClick={() => handleUserClick(member.user.id)}
                />
              ))}
            </div>
          )}

          {/* Results Count */}
          {!isLoading && filteredMembers.length > 0 && (
            <p className="text-sm text-slate-500 text-center pt-4">
              Showing {filteredMembers.length} of {teamMembers.length} team members
            </p>
          )}
        </div>
      </div>
    </main>
  )
}
