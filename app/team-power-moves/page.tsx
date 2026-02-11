"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Filter } from "lucide-react"
import { useUser, getAllUsers, type User } from "@/lib/user-context"
import { UserPowerMoveCard } from "@/components/user-power-move-card"
import { TeamSummarySection } from "@/components/team-summary-section"

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

interface TeamMemberData {
  user: User
  stats: UserPowerMoveStats
}

export default function TeamPowerMovesPage() {
  const router = useRouter()
  const { currentUser } = useUser()
  const [teamMembers, setTeamMembers] = useState<TeamMemberData[]>([])
  const [filteredMembers, setFilteredMembers] = useState<TeamMemberData[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(true)

  // Mock data for demonstration - in production, this would come from API
  const generateMockStats = (userId: string, index: number): UserPowerMoveStats => {
    const statuses: ("on-track" | "at-risk" | "behind")[] = ["on-track", "at-risk", "behind"]
    const status = statuses[index % 3]
    const completionPercentage = status === "on-track" ? 75 + Math.random() * 25 : status === "at-risk" ? 40 + Math.random() * 35 : Math.random() * 40

    return {
      totalPowerMoves: 8 + Math.floor(Math.random() * 4),
      completedPowerMoves: Math.floor((completionPercentage / 100) * (8 + Math.floor(Math.random() * 4))),
      completionPercentage: Math.round(completionPercentage),
      status,
      lastUpdated: `${Math.floor(Math.random() * 24)}h ago`,
      department: ["marketing", "sales", "accounts", "execution"][index % 4],
      goalsStatus: {
        quantitative: {
          onTrack: status === "on-track" ? 3 : 1,
          atRisk: status === "at-risk" ? 2 : 0,
          behind: status === "behind" ? 1 : 0,
        },
        qualitative: {
          onTrack: status === "on-track" ? 2 : 1,
          atRisk: status === "at-risk" ? 1 : 0,
          behind: status === "behind" ? 1 : 0,
        },
        learning: {
          onTrack: 1,
          atRisk: 0,
          behind: 0,
        },
      },
    }
  }

  useEffect(() => {
    setIsLoading(true)
    const allUsers = getAllUsers()
    const membersWithStats: TeamMemberData[] = allUsers
      .filter((user) => user.role !== "super_admin") // Exclude super admin from team list (they see their own dashboard separately)
      .map((user, index) => ({
        user,
        stats: generateMockStats(user.id, index),
      }))

    setTeamMembers(membersWithStats)
    setIsLoading(false)
  }, [])

  // Filter members based on search and filters
  useEffect(() => {
    let filtered = teamMembers

    if (searchQuery) {
      filtered = filtered.filter((member) =>
        member.user.name.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (departmentFilter !== "all") {
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
