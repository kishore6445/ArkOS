'use client'

import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { useBrand } from '@/lib/brand-context'
import type { VictoryTarget, PowerMove, Task, Commitment } from '@/components/department-page'
import { calculateDepartmentScore } from '@/lib/score-calculations'
import { QuarterSelector, type QuarterOption } from '@/components/quarter-selector'
import { MissionContextSection } from '@/components/mission-context-section'
import { CheckCircle, AlertCircle, XCircle, Target, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DepartmentExecutionHeroProps {
  departmentName: string
  victoryTargets: VictoryTarget[]
  powerMoves: PowerMove[]
  calculatedScore?: ReturnType<typeof calculateDepartmentScore>
  selectedPeriod: string
  onPeriodChange: (period: string) => void
  currentWeekStart: Date
  onNavigate: (direction: 'prev' | 'next') => void
  onWeeklyReview: () => void
  onAddPowerMove?: () => void
  onAddTask?: () => void
  onAddCommitment?: () => void
  selectedQuarter: QuarterOption
  onQuarterChange: (quarter: QuarterOption) => void
  coreObjective?: {
    title: string
    description: string
  }
}

export function DepartmentExecutionHero({
  departmentName,
  victoryTargets,
  powerMoves,
  calculatedScore,
  selectedQuarter,
  onQuarterChange,
  coreObjective,
  onAddPowerMove,
}: DepartmentExecutionHeroProps) {
  const { brandConfig } = useBrand()
  const companyWIG = brandConfig?.companyWIG

  const score = useMemo(() => {
    if (calculatedScore) return calculatedScore
    return calculateDepartmentScore(victoryTargets, powerMoves)
  }, [calculatedScore, victoryTargets, powerMoves])

  const powerMoveStats = useMemo(() => {
    const completedCount = powerMoves.filter((pm) => pm.progress >= pm.targetPerCycle).length
    const totalMoves = powerMoves.length
    const totalTarget = powerMoves.reduce((sum, pm) => sum + Math.max(pm.targetPerCycle || 0, 0), 0)
    const totalProgress = powerMoves.reduce(
      (sum, pm) => sum + Math.min(pm.progress, pm.targetPerCycle || 0),
      0,
    )
    const percentage = totalTarget > 0 ? Math.round((totalProgress / totalTarget) * 100) : 0
    return { completedCount, totalMoves, totalProgress, totalTarget, percentage }
  }, [powerMoves])

  return (
    <section className='pb-8' aria-labelledby='department-execution-heading'>
      {/* DEPARTMENT HEADER - Strong Identity Section */}
      <div className='bg-gradient-to-r from-slate-900 to-slate-800 text-white px-6 sm:px-8 lg:px-12 py-12'>
        <div className='max-w-7xl mx-auto'>
          <div className='flex items-start gap-8 justify-between'>
            {/* Department Identity */}
            <div className='flex-1'>
              <h1 id='department-execution-heading' className='text-5xl font-black tracking-tight mb-2'>
                {departmentName}
              </h1>
              <p className='text-lg font-semibold text-slate-200 mb-3'>
                {coreObjective?.title || 'Execution Dashboard'}
              </p>
              {coreObjective?.description && (
                <p className='text-sm text-slate-300 max-w-2xl'>{coreObjective.description}</p>
              )}
              
              {/* Status Badge - Show urgent items */}
              {powerMoveStats.totalMoves > 0 && score?.statusColor && (
                <div className='flex items-center gap-3 mt-4'>
                  {score.statusColor === '#DC2626' && (
                    <div className='inline-flex items-center gap-2 bg-red-500/20 px-3 py-1.5 rounded-lg border border-red-400/30'>
                      <div className='h-2 w-2 rounded-full bg-red-500'></div>
                      <span className='text-xs font-bold text-red-200'>
                        {powerMoveStats.totalMoves - powerMoveStats.completedCount} Behind
                      </span>
                    </div>
                  )}
                  {score.statusColor === '#F59E0B' && (
                    <div className='inline-flex items-center gap-2 bg-amber-500/20 px-3 py-1.5 rounded-lg border border-amber-400/30'>
                      <div className='h-2 w-2 rounded-full bg-amber-500'></div>
                      <span className='text-xs font-bold text-amber-200'>
                        At Risk
                      </span>
                    </div>
                  )}
                  {score.statusColor === '#16A34A' && (
                    <div className='inline-flex items-center gap-2 bg-green-500/20 px-3 py-1.5 rounded-lg border border-green-400/30'>
                      <div className='h-2 w-2 rounded-full bg-green-500'></div>
                      <span className='text-xs font-bold text-green-200'>
                        On Track
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Selectors - Right side */}
            <div className='flex items-center gap-3 flex-shrink-0'>
              {onAddPowerMove && (
                <Button 
                  onClick={onAddPowerMove}
                  className='bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 py-2 rounded-lg flex items-center gap-2'
                >
                  <Plus className='h-5 w-5' />
                  Add Power Move
                </Button>
              )}
              <QuarterSelector value={selectedQuarter} onChange={onQuarterChange} />
            </div>
          </div>
        </div>
      </div>

      {/* HERO STATUS FLOW - Elevated, dramatic, interactive */}
      <div className='px-6 sm:px-8 lg:px-12 py-16 bg-white'>
        <div className='max-w-7xl mx-auto'>
          {/* Dramatic 3-Step Flow Grid */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            
            {/* STEP 1 - Execution Discipline */}
            <button
              onClick={onAddPowerMove}
              className='group text-left p-8 rounded-xl border-2 border-slate-200 hover:border-orange-400 hover:bg-orange-50 transition-all duration-300 cursor-pointer'
            >
              <div className='flex items-center gap-3 mb-6'>
                <div className='h-10 w-10 rounded-full bg-orange-500 text-white font-bold flex items-center justify-center text-lg'>1</div>
                <span className='text-xs font-bold uppercase text-slate-600 tracking-wide'>Execution Discipline</span>
              </div>
              <div className='mb-6'>
                <div className='text-7xl font-black text-slate-900 leading-none mb-2'>
                  {powerMoveStats.percentage}
                </div>
                <div className='text-sm text-slate-500 font-semibold'>
                  {powerMoveStats.totalProgress} of {powerMoveStats.totalTarget} completed
                </div>
              </div>
              <div className='flex items-center gap-2 pt-4 border-t border-slate-200'>
                {score.statusColor === '#16A34A' && <CheckCircle className='h-5 w-5 text-green-600' />}
                {score.statusColor === '#F59E0B' && <AlertCircle className='h-5 w-5 text-amber-600' />}
                {score.statusColor === '#DC2626' && <XCircle className='h-5 w-5 text-red-600' />}
                <span className='text-sm font-bold' style={{ color: score.statusColor }}>
                  {score.statusColor === '#16A34A' ? 'On Track' : score.statusColor === '#F59E0B' ? 'At Risk' : 'Behind'}
                </span>
              </div>
            </button>

            {/* STEP 2 - Team Outcomes */}
            <div className='p-8 rounded-xl border-2 border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition-all duration-300'>
              <div className='flex items-center gap-3 mb-6'>
                <div className='h-10 w-10 rounded-full bg-blue-500 text-white font-bold flex items-center justify-center text-lg'>2</div>
                <span className='text-xs font-bold uppercase text-slate-600 tracking-wide'>Team Outcomes</span>
              </div>
              {victoryTargets.length > 0 ? (
                <>
                  <div className='mb-6'>
                    <div className='text-7xl font-black text-slate-900 leading-none mb-2'>
                      {score.greenCount}
                    </div>
                    <div className='text-sm text-slate-500 font-semibold'>
                      of {score.totalTargets} on track
                    </div>
                  </div>
                  <div className='flex items-center gap-2 pt-4 border-t border-slate-200'>
                    {score.greenCount === score.totalTargets && <CheckCircle className='h-5 w-5 text-green-600' />}
                    {score.greenCount > 0 && score.greenCount < score.totalTargets && <AlertCircle className='h-5 w-5 text-amber-600' />}
                    {score.greenCount === 0 && <XCircle className='h-5 w-5 text-red-600' />}
                    <span className='text-sm font-bold'>
                      {score.greenCount === score.totalTargets ? 'On Track' : score.greenCount > 0 ? 'At Risk' : 'Behind'}
                    </span>
                  </div>
                </>
              ) : (
                <div className='text-sm text-blue-600 font-semibold pt-4'>Targets pending setup</div>
              )}
            </div>

            {/* STEP 3 - Company Mission */}
            <div className='p-8 rounded-xl border-2 border-slate-200 hover:border-purple-400 hover:bg-purple-50 transition-all duration-300'>
              <div className='flex items-center gap-3 mb-6'>
                <div className='h-10 w-10 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center text-lg'>3</div>
                <span className='text-xs font-bold uppercase text-slate-600 tracking-wide'>Company Mission</span>
              </div>
              {companyWIG ? (
                <>
                  <div className='mb-6'>
                    <div className='text-7xl font-black text-slate-900 leading-none mb-2'>
                      {companyWIG.achieved ?? 0}
                    </div>
                    <div className='text-sm text-slate-500 font-semibold'>
                      of {companyWIG.target ?? 0} target
                    </div>
                  </div>
                  <div className='flex items-center gap-2 pt-4 border-t border-slate-200'>
                    {((companyWIG.achieved ?? 0) / (companyWIG.target ?? 1)) >= 0.7 ? <CheckCircle className='h-5 w-5 text-green-600' /> :
                     ((companyWIG.achieved ?? 0) / (companyWIG.target ?? 1)) >= 0.5 ? <AlertCircle className='h-5 w-5 text-amber-600' /> :
                     <XCircle className='h-5 w-5 text-red-600' />}
                    <span className='text-sm font-bold'>
                      {((companyWIG.achieved ?? 0) / (companyWIG.target ?? 1)) >= 0.7 ? 'On Track' :
                       ((companyWIG.achieved ?? 0) / (companyWIG.target ?? 1)) >= 0.5 ? 'At Risk' : 'Behind'}
                    </span>
                  </div>
                </>
              ) : (
                <div className='text-sm text-purple-600 font-semibold pt-4'>Company WIG pending</div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* MISSION CONTEXT - Show department's role in company mission */}
      <MissionContextSection type="department" departmentName={departmentName} />
    </section>
  )
}
