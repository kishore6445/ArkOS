"use client"
import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, ChevronDown, ArrowRight, ArrowDown, CheckCircle, AlertCircle, XCircle, Target, Plus } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { useUser } from "@/lib/user-context"
import { useBrand } from "@/lib/brand-context"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { MissionContextSection } from "@/components/mission-context-section"
import { PowerMoveModal, type PowerMoveFormData } from "@/components/power-move-modal"
import { MissionBanner } from "@/components/mission-banner"
import { TutorialCard } from "@/components/tutorial-card"
import { TodaysFocus } from "@/components/todays-focus"
import { TodaysActions } from "@/components/todays-actions"
import { TodaysExecutionFocus } from "@/components/todays-execution-focus"
import { PersonalGoalsCollapsible } from "@/components/personal-goals-collapsible"
import { ConnectionMapView } from "@/components/connection-map-view"
import { PowerMovesRefined } from "@/components/power-moves-refined"
import { StatusBadge } from "@/components/status-badge"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

type TimePeriod = "today" | "this-week" | "this-month" | "this-quarter"

type IndividualDashboardProps = {
  isAdmin: boolean
  currentUserName?: string
  currentUserId?: string
}

type PersonalVictoryTarget = {
  id: string
  employeeId: string
  personalTargetName: string
  description?: string
  quarter: "Q1" | "Q2" | "Q3" | "Q4"
  goalType: "Quantitative" | "Qualitative" | "Learning"
  targetValue: number
  currentValue: number
  status: "On Track" | "At Risk" | "Behind"
  createdAt: string
}

export function IndividualDashboard({
  isAdmin,
  currentUserName = "",
  currentUserId = "",
}: IndividualDashboardProps) {
  const { currentUser, isLoading: isUserLoading } = useUser()
  const { brandConfig } = useBrand()
  const { toast } = useToast()
  const [tasks, setTasks] = useState([])
  const [commitments, setCommitments] = useState([])
  const [powerMoves, setPowerMoves] = useState<any[]>([])
  const [victoryTargets, setVictoryTargets] = useState<any[]>([])
  const [personalTargets, setPersonalTargets] = useState<PersonalVictoryTarget[]>([])
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [isTrackingLoading, setIsTrackingLoading] = useState(true)
  const [isLoadingPersonalTargets, setIsLoadingPersonalTargets] = useState(true)
  const [supportingWorkOpen, setSupportingWorkOpen] = useState(false)
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>("today")
  const [linkedPowerMove, setLinkedPowerMove] = useState<string | null>(null)
  const [showPowerMoveModal, setShowPowerMoveModal] = useState(false)
  const [showConnectionMap, setShowConnectionMap] = useState(false)

  const normalizeGoalType = (goalType: string): PersonalVictoryTarget["goalType"] => {
    const normalized = goalType.trim().toLowerCase()
    if (normalized === "qualitative" || normalized === "qualittative") return "Qualitative"
    if (normalized === "learning") return "Learning"
    if (normalized === "quantitative" || normalized === "qunatitaivt" || normalized === "quantitaivt") {
      return "Quantitative"
    }
    return "Quantitative"
  }

  const toggleTask = (id: string) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)))
  }

  const toggleCommitment = (id: string) => {
    setCommitments((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, completed: !c.completed, status: !c.completed ? "Completed" : "In Progress" } : c,
      ),
    )
  }

  const handleSavePowerMove = async (data: PowerMoveFormData) => {
    try {
      const response = await fetch("/api/admin/power-moves", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.title,
          frequency: data.frequency,
          targetPerCycle: data.targetPerCycle,
          owner: data.owner,
          ownerId: data.ownerId,
          linkedVictoryTarget: data.linkedVictoryTargets[0],
          brand: currentUser?.name || "Personal",
          department: "individual",
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to save power move")
      }

      const result = await response.json()
      setPowerMoves((prev) => [...prev, result.powerMove])
      toast({
        title: "Success",
        description: "Power Move created successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save power move",
        variant: "destructive",
      })
      throw error
    }
  }

  useEffect(() => {
    let isActive = true

    const load = async () => {
      try {
        setIsLoadingData(true)
        const [pmResponse, vtResponse] = await Promise.all([
          fetch("/api/admin/power-moves", { cache: "no-store" }),
          fetch("/api/admin/victory-targets", { cache: "no-store" }),
        ])

        const pmResult = await pmResponse.json().catch(() => ({}))
        const vtResult = await vtResponse.json().catch(() => ({}))

        if (!isActive) return

        setPowerMoves(Array.isArray(pmResult.powerMoves) ? pmResult.powerMoves : [])
        setVictoryTargets(Array.isArray(vtResult.targets) ? vtResult.targets : [])
      } catch {
        if (!isActive) return
        setPowerMoves([])
        setVictoryTargets([])
      } finally {
        if (isActive) setIsLoadingData(false)
      }
    }

    load()

    return () => {
      isActive = false
    }
  }, [])

  useEffect(() => {
    let isActive = true

    const loadPersonalTargets = async () => {
      try {
        setIsLoadingPersonalTargets(true)
        const response = await fetch("/api/admin/personal-victory-targets", { cache: "no-store" })
        const result = await response.json().catch(() => ({}))

        if (!isActive) return

        if (!response.ok) {
          setPersonalTargets([])
          return
        }

        setPersonalTargets(
          Array.isArray(result.targets)
            ? result.targets.map((target: PersonalVictoryTarget) => ({
                ...target,
                goalType: normalizeGoalType(target.goalType),
              }))
            : [],
        )
      } catch {
        if (!isActive) return
        setPersonalTargets([])
      } finally {
        if (isActive) setIsLoadingPersonalTargets(false)
      }
    }

    loadPersonalTargets()

    return () => {
      isActive = false
    }
  }, [])

  const getPowerMoveOwnerId = (powerMove: any) => powerMove.owner_id ?? powerMove.ownerId ?? ""
  const getPowerMoveOwnerName = (powerMove: any) => powerMove.owner ?? powerMove.ownerName ?? ""

  const getVictoryTargetOwnerId = (target: any) => target.owner_id ?? target.ownerId ?? ""
  const getVictoryTargetOwnerName = (target: any) => target.owner ?? target.ownerName ?? ""

  const effectiveUserId = currentUser?.id || currentUserId
  const effectiveUserName = currentUser?.name || currentUserName

  const displayName = currentUser?.name || currentUserName || "—"
  const displayRole = currentUser?.role || (isAdmin ? "Admin" : "Member")
  const displayBrands = currentUser?.assignments
    ? new Set(currentUser.assignments.map((assignment) => assignment.brand)).size
    : 0
  const displayAvatar = currentUser?.avatar || ""
  const displayStreak = 0

  const myPowerMoves = isAdmin
    ? powerMoves
    : effectiveUserId || effectiveUserName
      ? powerMoves.filter((pm: any) => {
          if (effectiveUserId) {
            return getPowerMoveOwnerId(pm) === effectiveUserId
          }
          return getPowerMoveOwnerName(pm) === effectiveUserName
        })
      : []

  const myVictoryTargets = isAdmin
    ? victoryTargets
    : effectiveUserId || effectiveUserName
      ? victoryTargets.filter((vt: any) => {
          if (effectiveUserId) {
            return getVictoryTargetOwnerId(vt) === effectiveUserId
          }
          return getVictoryTargetOwnerName(vt) === effectiveUserName
        })
      : []

  const getTargetActualForPeriod = (pm: any, period: TimePeriod) => {
    switch (period) {
      case "today":
        return {
          target: pm.dailyTarget ?? pm.weeklyTarget ?? 0,
          actual: pm.dailyActual ?? 0,
        }
      case "this-week":
        return { target: pm.weeklyTarget ?? 0, actual: pm.weeklyActual ?? 0 }
      case "this-month":
        return { target: pm.monthlyTarget ?? 0, actual: pm.monthlyActual ?? 0 }
      case "this-quarter":
        return { target: pm.quarterlyTarget ?? 0, actual: pm.quarterlyActual ?? 0 }
    }
    return { target: 0, actual: 0 }
  }

  const getActualFieldForPeriod = (pm: any, period: TimePeriod) => {
    switch (period) {
      case "today":
        return "dailyActual"
      case "this-week":
        return "weeklyActual"
      case "this-month":
        return "monthlyActual"
      case "this-quarter":
        return "quarterlyActual"
    }
    return "weeklyActual"
  }

  const getTargetFieldForPeriod = (period: TimePeriod) => {
    switch (period) {
      case "today":
        return "dailyTarget"
      case "this-week":
        return "weeklyTarget"
      case "this-month":
        return "monthlyTarget"
      case "this-quarter":
        return "quarterlyTarget"
    }
    return "weeklyTarget"
  }

  const powerMoveIds = useMemo(
    () => powerMoves.map((pm) => pm.id).filter(Boolean).join(","),
    [powerMoves],
  )

  useEffect(() => {
    if (!powerMoveIds) {
      setIsTrackingLoading(false)
      return
    }

    const controller = new AbortController()
    let isActive = true

    setIsTrackingLoading(true)

    const loadTracking = async () => {
      try {
        const response = await fetch(
          `/api/power-move-tracking?period=${encodeURIComponent(selectedPeriod)}&powerMoveIds=${encodeURIComponent(
            powerMoveIds,
          )}`,
          { signal: controller.signal },
        )
        const result = await response.json().catch(() => ({}))

        if (!response.ok || !Array.isArray(result.tracking)) return

        const trackingMap = new Map<string, { actual: number; target: number }>(
          result.tracking.map((row: any) => [row.power_move_id, row]),
        )

        setPowerMoves((prev) =>
          prev.map((pm) => {
            const tracked = trackingMap.get(pm.id)
            if (!tracked) return pm
            const actualField = getActualFieldForPeriod(pm, selectedPeriod)
            const targetField = getTargetFieldForPeriod(selectedPeriod)
            return {
              ...pm,
              [actualField]: tracked.actual,
              [targetField]: tracked.target ?? pm[targetField],
            }
          }),
        )
      } catch {
        // Ignore tracking failures
      } finally {
        if (isActive) setIsTrackingLoading(false)
      }
    }

    loadTracking()

    return () => {
      isActive = false
      controller.abort()
    }
  }, [selectedPeriod, powerMoveIds])

  const periodData = myPowerMoves.reduce(
    (acc, pm) => {
      const { target, actual } = getTargetActualForPeriod(pm, selectedPeriod)
      if (!target) return acc
      const safeActual = Math.max(actual || 0, 0)
      return {
        completed: acc.completed + Math.min(safeActual, target),
        total: acc.total + target,
        target: acc.target + target,
      }
    },
    { completed: 0, total: 0, target: 0 },
  )

  const executionPercentage = periodData.total > 0 ? Math.round((periodData.completed / periodData.total) * 100) : 0

  const handleCompletePowerMove = async (id: string) => {
    let trackingPayload: { powerMoveId: string; period: TimePeriod; target: number; actual: number; completedById?: string } | null = null

    setPowerMoves((prev) =>
      prev.map((pm) => {
        if (pm.id !== id) return pm
        const { target, actual } = getTargetActualForPeriod(pm, selectedPeriod)
        const actualField = getActualFieldForPeriod(pm, selectedPeriod)
        const nextActual = Math.min((actual || 0) + 1, target)
        trackingPayload = {
          powerMoveId: pm.id,
          period: selectedPeriod,
          target,
          actual: nextActual,
          completedById: effectiveUserId || undefined,
        }
        return { ...pm, [actualField]: nextActual }
      }),
    )

    if (!trackingPayload || trackingPayload.target <= 0) return

    try {
      await fetch("/api/power-move-tracking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(trackingPayload),
      })

      if (trackingPayload.period === "today") {
        await fetch("/api/power-move-tracking", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...trackingPayload,
            period: "this-week",
          }),
        })
      }
    } catch {
      // Ignore tracking failures to avoid blocking UI
    }
  }

  const getPeriodLabel = (period: TimePeriod) => {
    switch (period) {
      case "today":
        return "Today"
      case "this-week":
        return "This Week"
      case "this-month":
        return "This Month"
      case "this-quarter":
        return "This Quarter"
    }
  }

  const getScoreLabel = (period: TimePeriod) => {
    switch (period) {
      case "today":
        return "DAILY SCORE"
      case "this-week":
        return "WEEKLY SCORE"
      case "this-month":
        return "MONTHLY SCORE"
      case "this-quarter":
        return "QUARTERLY SCORE"
    }
  }

  const getExecutionStatus = () => {
    if (executionPercentage >= 70) return "on-standard"
    if (executionPercentage >= 50) return "caution"
    return "needs-help"
  }

  const executionStatus = getExecutionStatus()

  const getHeroStyling = () => {
    if (executionStatus === "on-standard") {
      return {
        bgGradient: "from-emerald-50 via-emerald-100/80 to-emerald-50",
        borderColor: "border-emerald-200",
        accentColor: "border-l-emerald-500",
        textColor: "text-emerald-900",
        subtextColor: "text-emerald-700",
        scoreCircleBg: "bg-emerald-500",
        scoreCircleText: "text-white",
        headline: "Personal execution is on standard.",
        statusBadge: { label: "On Standard", bg: "bg-emerald-100 text-emerald-800" },
      }
    }
    if (executionStatus === "caution") {
      return {
        bgGradient: "from-amber-50 via-amber-100/80 to-amber-50",
        borderColor: "border-amber-200",
        accentColor: "border-l-amber-500",
        textColor: "text-amber-900",
        subtextColor: "text-amber-700",
        scoreCircleBg: "bg-amber-500",
        scoreCircleText: "text-white",
        headline: "Personal execution requires attention.",
        statusBadge: { label: "Caution", bg: "bg-amber-100 text-amber-800" },
      }
    }
    return {
      bgGradient: "from-rose-50 via-rose-100/80 to-rose-50",
      borderColor: "border-rose-200",
      accentColor: "border-l-rose-500",
      textColor: "text-rose-900",
      subtextColor: "text-rose-700",
      scoreCircleBg: "bg-rose-500",
      scoreCircleText: "text-white",
      headline: "Personal execution requires immediate focus.",
      statusBadge: { label: "Needs Help", bg: "bg-rose-100 text-rose-800" },
    }
  }

  const heroStyle = getHeroStyling()

  // PATCH 1: Calculate if all today's power moves are completed for closure state
  const todayPowerMoves = myPowerMoves.filter((pm) => {
    const { target } = getTargetActualForPeriod(pm, "today")
    return target > 0
  })
  const todayCompletedCount = todayPowerMoves.filter((pm) => {
    const { actual, target } = getTargetActualForPeriod(pm, "today")
    return actual >= target
  }).length
  const isTodayComplete = todayCompletedCount === todayPowerMoves.length && todayPowerMoves.length > 0

  // Status logic for scoreboard
  const getStatus = () => {
    if (executionPercentage >= 70) return { color: '#16A34A', bg: 'bg-emerald-100', text: 'text-emerald-800', badge: 'WINNING', borderAccent: 'border-emerald-500' }
    if (executionPercentage >= 50) return { color: '#F59E0B', bg: 'bg-amber-100', text: 'text-amber-800', badge: 'AT RISK', borderAccent: 'border-amber-500' }
    return { color: '#DC2626', bg: 'bg-rose-100', text: 'text-rose-800', badge: 'BEHIND', borderAccent: 'border-rose-500' }
  }
  const status = getStatus()

  const personalTargetsForUser = isAdmin
    ? personalTargets
    : effectiveUserId
      ? personalTargets.filter((target) => target.employeeId === effectiveUserId)
      : personalTargets

  const currentQuarter = (() => {
    const month = new Date().getMonth() + 1
    if (month <= 3) return "Q1"
    if (month <= 6) return "Q2"
    if (month <= 9) return "Q3"
    return "Q4"
  })()

  const currentQuarterTargets = personalTargetsForUser.filter((target) => target.quarter === currentQuarter)
  const visibleTargets = currentQuarterTargets.length > 0 ? currentQuarterTargets : personalTargetsForUser

  const quantitativeTargets = visibleTargets.filter((target) => target.goalType === "Quantitative")
  const qualitativeTargets = visibleTargets.filter((target) => target.goalType === "Qualitative")
  const learningTargets = visibleTargets.filter((target) => target.goalType === "Learning")

  const onTrackCount = visibleTargets.filter((target) => target.status === "On Track").length

  if (isLoadingData || isUserLoading || isTrackingLoading || isLoadingPersonalTargets) {
    return (
      <div className="flex items-center justify-center min-h-[420px]">
        <p className="text-sm text-stone-500">Loading dashboard data...</p>
      </div>
    )
  }

  return (
    <section className='pb-8 space-y-0' aria-labelledby='personal-dashboard-heading'>
      {/* Mission 30 Progress Banner */}
      {(() => {
        try {
          return <MissionBanner />
        } catch (error) {
          console.log("[v0] MissionBanner error:", error)
          return null
        }
      })()}

      {/* View Toggle Tabs */}
      <div className='bg-white border-b border-slate-200 px-6 sm:px-8 lg:px-12 sticky top-0 z-10'>
        <div className='max-w-7xl mx-auto flex items-center gap-1'>
          <Button
            variant={!showConnectionMap ? 'default' : 'ghost'}
            onClick={() => setShowConnectionMap(false)}
            className='rounded-none border-b-2 font-semibold'
            style={{
              borderBottomColor: !showConnectionMap ? '#F97316' : 'transparent',
              backgroundColor: !showConnectionMap ? 'transparent' : 'transparent',
              color: !showConnectionMap ? '#F97316' : '#64748B',
            }}
          >
            Dashboard
          </Button>
          <Button
            variant={showConnectionMap ? 'default' : 'ghost'}
            onClick={() => setShowConnectionMap(true)}
            className='rounded-none border-b-2 font-semibold'
            style={{
              borderBottomColor: showConnectionMap ? '#F97316' : 'transparent',
              backgroundColor: showConnectionMap ? 'transparent' : 'transparent',
              color: showConnectionMap ? '#F97316' : '#64748B',
            }}
          >
            Connection Map
          </Button>
        </div>
      </div>

      {/* Connection Map View */}
      {showConnectionMap && (
        <div className='px-6 sm:px-8 lg:px-12 py-12'>
          <div className='max-w-7xl mx-auto'>
            <ConnectionMapView
              powerMoves={powerMoves.map((pm) => ({
                id: pm.id,
                name: pm.powerMoveName,
                frequency: pm.frequency,
                progress: pm.progress || 0,
                target: pm.target || 1,
                impact: pm.linkedVictoryTarget ? 'high' : 'medium',
              }))}
              missionTarget={30}
              missionProgress={28}
              missionName='Mission 30'
            />
          </div>
        </div>
      )}

      {/* Regular Dashboard View */}
      {!showConnectionMap && (
        <>
      
      {/* PROFILE HEADER - LinkedIn-style identity section */}
      <div className='bg-gradient-to-r from-slate-900 to-slate-800 text-white px-6 sm:px-8 lg:px-12 py-12'>
        <div className='max-w-7xl mx-auto'>
          <div className='flex items-start gap-8'>
            {/* Profile Photo */}
            <div className='flex-shrink-0'>
              <div className='h-24 w-24 rounded-full overflow-hidden border-4 border-white shadow-lg bg-slate-600'>
                <Image
                  src={displayAvatar || '/placeholder.svg'}
                  alt={displayName}
                  width={96}
                  height={96}
                  className='h-full w-full object-cover'
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                    target.parentElement?.classList.add('flex', 'items-center', 'justify-center')
                  }}
                />
              </div>
            </div>

            {/* Identity + Actions */}
            <div className='flex-1 flex items-start justify-between'>
              <div>
                <h1 className='text-5xl font-black tracking-tight mb-3'>{displayName}</h1>
                <p className='text-lg font-semibold text-slate-200 mb-1'>
                  {displayRole} · {displayBrands} Brands
                </p>
                <p className='text-sm text-slate-300'>Track your execution, impact, and reward potential</p>
              </div>

              {/* Time period selector - Minimal style */}
              <div className='mt-2'>
                <Select value={selectedPeriod} onValueChange={(v) => setSelectedPeriod(v as TimePeriod)}>
                  <SelectTrigger className='w-40 bg-slate-700 border-slate-600 text-white'>
                    <Calendar className='h-4 w-4 mr-2 text-slate-300' />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='today'>Today</SelectItem>
                    <SelectItem value='this-week'>This Week</SelectItem>
                    <SelectItem value='this-month'>This Month</SelectItem>
                    <SelectItem value='this-quarter'>This Quarter</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MISSION CONTEXT - Show brand contribution to company mission */}
      <MissionContextSection type="individual" brandName={brandConfig.name} />


      {/* Power Moves Section - Refined & Focused */}
      <div className='px-6 sm:px-8 lg:px-12 py-12 bg-white border-t border-slate-100'>
        <div className='max-w-7xl mx-auto'>
          <PowerMovesRefined
            powerMoves={myPowerMoves.map((pm) => {
              const { target, actual } = getTargetActualForPeriod(pm, selectedPeriod)
              const status = actual >= target ? "On Track" : actual > 0 ? "At Risk" : "Behind"
              return {
                id: pm.id,
                name: pm.name,
                frequency: pm.frequency,
                progress: actual,
                target: target,
                status: status as "On Track" | "At Risk" | "Behind",
              }
            })}
            onAddPowerMove={() => setShowPowerMoveModal(true)}
            onIncrementPowerMove={handleCompletePowerMove}
          />
        </div>
      </div>

      {/* PHASE 4: Personal Goals - Collapsible section */}
      <PersonalGoalsCollapsible
        goals={personalTargets.map((target) => ({
          id: target.id,
          name: target.personalTargetName,
          goalType: target.goalType,
          currentValue: target.currentValue,
          targetValue: target.targetValue,
          status: target.status,
        }))}
      />

      {/* Today's Focus Card */}
      <TodaysFocus 
        completedToday={periodData.completed}
        totalTarget={periodData.total}
        onAddPowerMove={() => setShowPowerMoveModal(true)}
        topPowerMoves={powerMoves.slice(0, 3).map((pm) => ({
          id: pm.id,
          name: pm.name || pm.title,
        }))}
      />

      {/* Today's Actions - Merged Tasks & Commitments */}
      <TodaysActions 
        tasks={tasks}
        commitments={commitments}
        onToggleTask={toggleTask}
        onToggleCommitment={toggleCommitment}
      />

      {/* Power Move Modal */}
      <PowerMoveModal
        open={showPowerMoveModal}
        onOpenChange={setShowPowerMoveModal}
        onSave={handleSavePowerMove}
        victoryTargets={personalTargets.map((target) => ({
          id: target.id,
          title: target.personalTargetName,
          owner: currentUser?.name,
          ownerId: currentUser?.id,
          department: "individual",
        }))}
        currentUserName={currentUser?.name || currentUserName}
        currentUserId={currentUser?.id || currentUserId}
      />
        </>
      )}
    </section>
  )
}
