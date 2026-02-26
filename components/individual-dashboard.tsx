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

      {/* HERO STATUS FLOW - Elevated, dramatic, interactive */}
      <div className='px-6 sm:px-8 lg:px-12 py-16 bg-white'>
        <div className='max-w-7xl mx-auto'>
          {/* Dramatic 3-Step Flow */}
          <div className='grid grid-cols-3 gap-8'>
            
            {/* STEP 1 - Power Moves */}
            <div
              className='group text-left p-8 rounded-xl border-2 border-slate-200 hover:border-orange-400 hover:bg-orange-50 transition-all duration-300'
            >
              <div className='flex items-center justify-between mb-6'>
                <div className='flex items-center gap-3'>
                  <div className='h-10 w-10 rounded-full bg-orange-500 text-white font-bold flex items-center justify-center text-lg'>1</div>
                  <span className='text-xs font-bold uppercase text-slate-600 tracking-wide'>Execution Discipline</span>
                </div>
              </div>
              <div className='mb-6'>
                <div className='text-7xl font-black text-slate-900 leading-none mb-2'>
                  {periodData.completed}
                </div>
                <div className='text-sm text-slate-500 font-semibold'>
                  {periodData.total && `of ${periodData.total} completed`}
                </div>
              </div>
              <div className='flex items-center gap-2 pt-4 border-t border-slate-200'>
                {status.color === '#16A34A' && <CheckCircle className='h-5 w-5 text-green-600' />}
                {status.color === '#F59E0B' && <AlertCircle className='h-5 w-5 text-amber-600' />}
                {status.color === '#DC2626' && <XCircle className='h-5 w-5 text-red-600' />}
                <span className='text-sm font-bold' style={{ color: status.color }}>{status.badge}</span>
              </div>
            </div>

            {/* STEP 2 - Outcomes - Personal Victory Targets by Type */}
            <div className='p-8 rounded-xl border-2 border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition-all duration-300'>
              <div className='flex items-center gap-3 mb-6'>
                <div className='h-10 w-10 rounded-full bg-blue-500 text-white font-bold flex items-center justify-center text-lg'>2</div>
                <span className='text-xs font-bold uppercase text-slate-600 tracking-wide'>Your Goals</span>
              </div>
              {visibleTargets.length > 0 ? (
                <div className='space-y-4'>
                  {/* Goal Types Summary */}
                  <div className='grid grid-cols-3 gap-3'>
                    {/* Quantitative */}
                    <div className='bg-white rounded-lg p-4 border border-blue-200'>
                      <p className='text-xs font-bold text-slate-600 uppercase tracking-wide mb-2'>Quantitative</p>
                      <p className='text-3xl font-black text-blue-600'>
                        {quantitativeTargets.length}
                      </p>
                      <p className='text-xs text-slate-500 mt-2'>Measurable targets</p>
                    </div>

                    {/* Qualitative */}
                    <div className='bg-white rounded-lg p-4 border border-amber-200'>
                      <p className='text-xs font-bold text-slate-600 uppercase tracking-wide mb-2'>Qualitative</p>
                      <p className='text-3xl font-black text-amber-600'>
                        {qualitativeTargets.length}
                      </p>
                      <p className='text-xs text-slate-500 mt-2'>Observable behaviors</p>
                    </div>

                    {/* Learning */}
                    <div className='bg-white rounded-lg p-4 border border-purple-200'>
                      <p className='text-xs font-bold text-slate-600 uppercase tracking-wide mb-2'>Learning</p>
                      <p className='text-3xl font-black text-purple-600'>
                        {learningTargets.length}
                      </p>
                      <p className='text-xs text-slate-500 mt-2'>Development goals</p>
                    </div>
                  </div>

                  <div className='space-y-2'>
                    {visibleTargets.map((target) => (
                      <div key={target.id} className='flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2'>
                        <div>
                          <p className='text-sm font-semibold text-slate-900'>{target.personalTargetName}</p>
                          <p className='text-xs text-slate-500'>{target.goalType}</p>
                        </div>
                        <span className='text-xs font-semibold text-slate-600'>{target.status}</span>
                      </div>
                    ))}
                  </div>

                  {/* Overall Progress */}
                  <div className='flex items-center gap-2 pt-4 border-t border-slate-200'>
                    {onTrackCount === visibleTargets.length && <CheckCircle className='h-5 w-5 text-green-600' />}
                    {onTrackCount > 0 && onTrackCount < visibleTargets.length && <AlertCircle className='h-5 w-5 text-amber-600' />}
                    {onTrackCount === 0 && <XCircle className='h-5 w-5 text-red-600' />}
                    <span className='text-sm font-bold'>
                      {onTrackCount} of {visibleTargets.length} on track
                    </span>
                  </div>
                </div>
              ) : (
                <div className='text-sm text-blue-600 font-semibold pt-4'>Define your personal goals to get started</div>
              )}
            </div>

            {/* STEP 3 - Your Reward */}
            <div className='p-8 rounded-xl border-2 border-slate-200 hover:border-green-400 hover:bg-green-50 transition-all duration-300'>
              <div className='flex items-center gap-3 mb-6'>
                <div className='h-10 w-10 rounded-full bg-green-600 text-white font-bold flex items-center justify-center text-lg'>3</div>
                <span className='text-xs font-bold uppercase text-slate-600 tracking-wide'>Your Reward</span>
              </div>
              <div className='mb-6'>
                <div className='text-7xl font-black text-slate-900 leading-none mb-2'>
                  35%
                </div>
                <div className='text-sm text-slate-500 font-semibold'>
                  Salary increase achievable
                </div>
              </div>
              <div className='flex items-center gap-2 pt-4 border-t border-slate-200'>
                <CheckCircle className='h-5 w-5 text-green-600' />
                <span className='text-sm font-bold text-green-600'>Achievable</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* PERIOD EXECUTION SECTION - Supporting details */}
      <div className='px-6 sm:px-8 lg:px-12 py-8 bg-slate-50 border-t border-slate-200'>
        <div className='max-w-7xl mx-auto'>
          <p className='text-xs font-black uppercase tracking-[0.2em] text-slate-600 mb-6'>
            {selectedPeriod === 'today' ? "Today's" : selectedPeriod === 'this-week' ? 'This Week\'s' : selectedPeriod === 'this-month' ? 'This Month\'s' : 'This Quarter\'s'} Execution
          </p>
          <p className='text-xs font-semibold text-stone-500'>
            {periodData.completed} of {periodData.total} power move actions · {periodData.total - periodData.completed} remaining
          </p>
        </div>
      </div>

      {/* Power Moves Section - Department Style */}
      <div className='bg-white border border-stone-200 rounded-lg overflow-hidden'>
        <div className='px-6 py-4 border-b border-stone-200 bg-stone-50 flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div className='w-3 h-3 rounded-full' style={{ backgroundColor: '#16A34A' }} />
            <p className='text-sm font-black uppercase tracking-[0.1em] text-stone-900'>Power Moves (Lead Measures)</p>
            <span className='text-xs font-semibold text-stone-500'>Recurring Actions_test</span>
          </div>
        </div>

        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead>
              <tr className='border-b border-stone-200 bg-stone-50'>
                <th className='px-6 py-3 text-left text-xs font-bold text-stone-600 uppercase tracking-wider'>Power Move</th>
                <th className='px-6 py-3 text-left text-xs font-bold text-stone-600 uppercase tracking-wider'>Priority</th>
                <th className='px-6 py-3 text-left text-xs font-bold text-stone-600 uppercase tracking-wider'>Cadence</th>
                <th className='px-6 py-3 text-center text-xs font-bold text-stone-600 uppercase tracking-wider'>Progress</th>
                <th className='px-6 py-3 text-center text-xs font-bold text-stone-600 uppercase tracking-wider'>Status</th>
                <th className='px-6 py-3 text-center text-xs font-bold text-stone-600 uppercase tracking-wider'>Action</th>
              </tr>
            </thead>
            <tbody>
              {myPowerMoves.length === 0 ? (
                <tr>
                  <td colSpan={6} className='px-6 py-8 text-center text-sm text-stone-500'>
                    No power moves yet for this period.
                  </td>
                </tr>
              ) : (
                myPowerMoves.map((pm, index) => {
                  const isPrimary = index < 2
                  const { target, actual } = getTargetActualForPeriod(pm, selectedPeriod)
                  const percentage = target > 0 ? Math.round((actual / target) * 100) : 0
                  const executionStatus = percentage >= 100 ? 'Completed' : percentage > 0 ? 'In Progress' : 'Not Started'
                  const cycleCount = Math.max(0, Math.floor(target || 0))
                  const visibleCycles = Math.min(cycleCount, 30)
                  const overflowCycles = Math.max(0, cycleCount - visibleCycles)
                  const completedCycles = Math.min(Math.max(0, actual || 0), cycleCount)

                  return (
                    <tr key={pm.id} className='border-b border-stone-200 hover:bg-stone-50'>
                      <td className='px-6 py-4'>
                        <p className='text-sm font-bold text-stone-900'>{pm.name}</p>
                        <p className='text-xs text-stone-500 mt-0.5'>{pm.brand}</p>
                      </td>
                      <td className='px-6 py-4'>
                        <span className={cn(
                          'inline-flex text-xs font-bold px-2 py-1 rounded',
                          isPrimary 
                            ? 'bg-amber-50 text-amber-700' 
                            : 'text-stone-500'
                        )}>
                          {isPrimary ? 'Primary' : 'Supporting'}
                        </span>
                      </td>
                      <td className='px-6 py-4 text-xs font-semibold text-stone-600'>
                        {pm.frequency}
                      </td>
                      <td className='px-6 py-4'>
                        <div className='flex items-center gap-3'>
                          <div className='flex-1 max-w-xs'>
                            <div className='flex flex-wrap items-center gap-1 text-stone-400'>
                              {cycleCount === 0 ? (
                                <span className='text-xs text-stone-400'>—</span>
                              ) : (
                                <>
                                  {Array.from({ length: visibleCycles }).map((_, idx) => (
                                    <span
                                      key={idx}
                                      className={cn(
                                        'text-base leading-none font-black',
                                        idx < completedCycles ? 'text-emerald-600' : 'text-stone-500'
                                      )}
                                    >
                                      -
                                    </span>
                                  ))}
                                  {overflowCycles > 0 && (
                                    <span className='text-xs text-stone-500'>+{overflowCycles}</span>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                          <span className='text-xs font-bold text-stone-600 w-12 text-right'>
                            {actual}/{target}
                          </span>
                        </div>
                      </td>
                      <td className='px-6 py-4 text-center'>
                        <span className={cn(
                          'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold',
                          executionStatus === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                          executionStatus === 'In Progress' ? 'bg-amber-100 text-amber-700' :
                          'bg-stone-200 text-stone-700'
                        )}>
                          {executionStatus}
                        </span>
                      </td>
                      <td className='px-6 py-4 text-center'>
                        <Button
                          size='sm'
                          disabled={actual >= target}
                          onClick={() => handleCompletePowerMove(pm.id)}
                          className={cn(
                            'text-xs font-bold',
                            actual >= target
                              ? 'bg-stone-200 text-stone-500 cursor-not-allowed'
                              : 'bg-[#16A34A] hover:bg-[#15803d] text-white'
                          )}
                        >
                          {actual >= target ? 'Done' : 'Complete'}
                        </Button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tasks Section - Department Style */}
      <div className='bg-white border border-stone-200 rounded-lg overflow-hidden'>
        <div className='px-6 py-4 border-b border-stone-200 bg-stone-50 flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div className='w-3 h-3 rounded-full' style={{ backgroundColor: '#F59E0B' }} />
            <p className='text-sm font-black uppercase tracking-[0.1em] text-stone-900'>Tasks</p>
            <span className='text-xs font-semibold text-stone-500'>One-Time Activities</span>
          </div>
        </div>

        <div className='divide-y divide-stone-200'>
          {tasks.length === 0 ? (
            <p className='px-6 py-4 text-sm text-stone-500'>No tasks for this period</p>
          ) : (
            tasks.map((task) => (
              <div key={task.id} className='px-6 py-4 flex items-center gap-4 hover:bg-stone-50'>
                <Checkbox 
                  checked={task.completed} 
                  onCheckedChange={() => toggleTask(task.id)} 
                  className='h-5 w-5' 
                />
                <div className='flex-1'>
                  <p className={cn('text-sm font-bold text-stone-900', task.completed && 'line-through text-stone-400')}>
                    {task.title}
                  </p>
                </div>
                <Badge variant='outline' className='text-xs font-semibold'>
                  {task.brand}
                </Badge>
                <span className={cn(
                  'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold',
                  task.completed ? 'bg-emerald-100 text-emerald-700' : 'bg-stone-200 text-stone-700'
                )}>
                  {task.completed ? 'Completed' : 'Pending'}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Commitments Section - Department Style */}
      <div className='bg-white border border-stone-200 rounded-lg overflow-hidden'>
        <div className='px-6 py-4 border-b border-stone-200 bg-stone-50 flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div className='w-3 h-3 rounded-full' style={{ backgroundColor: '#DC2626' }} />
            <p className='text-sm font-black uppercase tracking-[0.1em] text-stone-900'>Commitments</p>
            <span className='text-xs font-semibold text-stone-500'>Team Promises</span>
          </div>
        </div>

        <div className='divide-y divide-stone-200'>
          {commitments.length === 0 ? (
            <p className='px-6 py-4 text-sm text-stone-500'>No commitments for this period</p>
          ) : (
            commitments.map((commitment) => (
              <div key={commitment.id} className='px-6 py-4 flex items-center gap-4 hover:bg-stone-50'>
                <Checkbox 
                  checked={commitment.completed} 
                  onCheckedChange={() => toggleCommitment(commitment.id)} 
                  className='h-5 w-5' 
                />
                <div className='flex-1'>
                  <p className={cn('text-sm font-bold text-stone-900', commitment.completed && 'line-through text-stone-400')}>
                    {commitment.title}
                  </p>
                </div>
                <Badge variant='outline' className='text-xs font-semibold'>
                  {commitment.brand}
                </Badge>
                <span className={cn(
                  'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold',
                  commitment.completed ? 'bg-emerald-100 text-emerald-700' : 'bg-stone-200 text-stone-700'
                )}>
                  {commitment.completed ? 'Completed' : 'Pending'}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  )
}
