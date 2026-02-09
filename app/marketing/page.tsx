"use client"

import { AppShell } from "@/components/app-shell"
import { DepartmentPage, type DepartmentConfig } from "@/components/department-page"
import { DepartmentPageSkeleton } from "@/components/skeleton-loader"
import { Megaphone } from "lucide-react"
import { useBrandDepartment } from "@/lib/use-brand-department"
import { useBrand } from "@/lib/brand-context"
import { useDepartmentPowerMoves } from "@/lib/use-department-power-moves"
import { useDepartmentVictoryTargets } from "@/lib/use-department-victory-targets"

export default function MarketingPage() {
  const { brandConfig } = useBrand()
  const departmentData = useBrandDepartment("marketing")
  const {
    victoryTargets: departmentVictoryTargets,
    isLoading: victoryTargetsLoading,
    error: victoryTargetsError,
  } = useDepartmentVictoryTargets("M")
  const {
    powerMoves: departmentPowerMoves,
    isLoading: powerMovesLoading,
    error: powerMovesError,
  } = useDepartmentPowerMoves("M")

  if (powerMovesLoading || victoryTargetsLoading) {
    return (
      <AppShell>
        <DepartmentPageSkeleton />
      </AppShell>
    )
  }

  if (!departmentData) {
    return (
      <AppShell>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center space-y-4">
            <Megaphone className="h-16 w-16 mx-auto text-muted-foreground" />
            <h2 className="text-2xl font-bold">Marketing Department</h2>
            <p className="text-muted-foreground">No marketing data available for {brandConfig.name}</p>
          </div>
        </div>
      </AppShell>
    )
  }

  const config: DepartmentConfig = {
    name: `${brandConfig.name} - ${departmentData.name}`,
    icon: Megaphone,
    wig: brandConfig.companyWIG.goal,
    status: "on-track",
    coreObjective: departmentData.coreObjective,
    victoryTargets:
      victoryTargetsLoading || victoryTargetsError
        ? []
        : departmentVictoryTargets.map((vt) => ({
            ...vt,
            status: vt.achieved / vt.target >= 0.7 ? "on-track" : ("at-risk" as "on-track" | "at-risk"),
          })),
    powerMoves:
      powerMovesLoading || powerMovesError
        ? []
        : departmentPowerMoves.map((pm) => ({
            id: pm.id,
            name: pm.name,
            frequency: pm.frequency,
            targetPerCycle: pm.currentTarget ?? pm.weeklyTarget,
            progress: pm.currentActual ?? pm.weeklyActual ?? 0,
            owner: pm.owner,
            linkedVictoryTarget: pm.linkedVictoryTargetTitle || "",
            weeklyTarget: pm.weeklyTarget,
            weeklyActual: pm.weeklyActual ?? pm.currentActual ?? 0,
            activityCompleted: false,
          })),
    commitments: [],
    tasks: departmentData.tasks.map((t) => ({
      ...t,
      task: t.title,
      due: t.dueDate,
    })),
  }

  return (
    <AppShell>
      <DepartmentPage config={config} departmentKey="marketing" />
    </AppShell>
  )
}
