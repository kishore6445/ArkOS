'use client'

import { ArrowRight, Target, TrendingUp, Zap } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface PowerMoveConnection {
  id: string
  name: string
  frequency: string
  progress: number
  target: number
  impact: 'high' | 'medium' | 'low'
}

interface ConnectionMapProps {
  powerMoves: PowerMoveConnection[]
  missionTarget: number
  missionProgress: number
  missionName: string
}

export function ConnectionMapView({
  powerMoves,
  missionTarget,
  missionProgress,
  missionName,
}: ConnectionMapProps) {
  const highImpactMoves = powerMoves.filter((pm) => pm.impact === 'high')
  const avgProgress =
    powerMoves.length > 0
      ? (powerMoves.reduce((sum, pm) => sum + (pm.progress / pm.target), 0) /
          powerMoves.length) *
        100
      : 0

  return (
    <div className='space-y-8'>
      {/* Header */}
      <div className='space-y-2'>
        <h2 className='text-2xl font-black text-slate-900'>Connection Map</h2>
        <p className='text-sm text-slate-600'>
          See how your daily execution connects to {missionName}
        </p>
      </div>

      {/* Main Flow Diagram */}
      <div className='bg-white border border-slate-200 rounded-lg p-8'>
        <div className='space-y-6'>
          {/* Step 1: Your Power Moves */}
          <div className='space-y-3'>
            <div className='flex items-center gap-2'>
              <div className='flex h-8 w-8 items-center justify-center rounded-full bg-orange-100'>
                <Zap className='h-4 w-4 text-orange-600' />
              </div>
              <h3 className='font-semibold text-slate-900'>Your Power Moves</h3>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 ml-10'>
              {highImpactMoves.slice(0, 4).map((move) => (
                <div
                  key={move.id}
                  className='bg-orange-50 border border-orange-200 rounded p-3'
                >
                  <p className='text-xs font-semibold text-orange-900 truncate'>
                    {move.name}
                  </p>
                  <div className='mt-2 h-1.5 bg-orange-200 rounded-full overflow-hidden'>
                    <div
                      className='h-full bg-orange-500 transition-all'
                      style={{
                        width: `${Math.min(
                          (move.progress / move.target) * 100,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                  <p className='text-xs text-orange-700 mt-1'>
                    {move.progress}/{move.target}
                  </p>
                </div>
              ))}
              {powerMoves.length > 4 && (
                <div className='bg-slate-50 border border-slate-200 rounded p-3 flex items-center justify-center'>
                  <p className='text-xs font-semibold text-slate-600'>
                    +{powerMoves.length - 4} more
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Arrow */}
          <div className='flex justify-center'>
            <div className='flex items-center gap-2 text-slate-400'>
              <div className='h-px w-8 bg-slate-300' />
              <ArrowRight className='h-4 w-4' />
              <div className='h-px w-8 bg-slate-300' />
            </div>
          </div>

          {/* Step 2: Collective Impact */}
          <div className='space-y-3'>
            <div className='flex items-center gap-2'>
              <div className='flex h-8 w-8 items-center justify-center rounded-full bg-blue-100'>
                <TrendingUp className='h-4 w-4 text-blue-600' />
              </div>
              <h3 className='font-semibold text-slate-900'>Team Execution</h3>
            </div>
            <div className='bg-blue-50 border border-blue-200 rounded p-4'>
              <div className='flex items-center justify-between mb-2'>
                <span className='text-sm font-semibold text-blue-900'>
                  Average Execution Rate
                </span>
                <span className='text-2xl font-black text-blue-600'>
                  {Math.round(avgProgress)}%
                </span>
              </div>
              <div className='h-2 bg-blue-200 rounded-full overflow-hidden'>
                <div
                  className='h-full bg-blue-500 transition-all'
                  style={{ width: `${Math.min(avgProgress, 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Arrow */}
          <div className='flex justify-center'>
            <div className='flex items-center gap-2 text-slate-400'>
              <div className='h-px w-8 bg-slate-300' />
              <ArrowRight className='h-4 w-4' />
              <div className='h-px w-8 bg-slate-300' />
            </div>
          </div>

          {/* Step 3: Mission Success */}
          <div className='space-y-3'>
            <div className='flex items-center gap-2'>
              <div className='flex h-8 w-8 items-center justify-center rounded-full bg-green-100'>
                <Target className='h-4 w-4 text-green-600' />
              </div>
              <h3 className='font-semibold text-slate-900'>{missionName}</h3>
            </div>
            <div className='bg-green-50 border border-green-200 rounded p-4'>
              <div className='flex items-center justify-between mb-2'>
                <span className='text-sm font-semibold text-green-900'>
                  Mission Progress
                </span>
                <span className='text-2xl font-black text-green-600'>
                  {missionProgress}/{missionTarget}
                </span>
              </div>
              <div className='h-2 bg-green-200 rounded-full overflow-hidden'>
                <div
                  className='h-full bg-green-500 transition-all'
                  style={{
                    width: `${Math.min(
                      (missionProgress / missionTarget) * 100,
                      100
                    )}%`,
                  }}
                />
              </div>
              <p className='text-xs text-green-700 mt-2'>
                {Math.round((missionProgress / missionTarget) * 100)}% complete
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Impact Summary */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <Card className='p-6'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-xs font-semibold text-slate-600 uppercase'>
                High Impact
              </p>
              <p className='text-3xl font-black text-slate-900 mt-2'>
                {highImpactMoves.length}
              </p>
            </div>
            <div className='h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center'>
              <Zap className='h-6 w-6 text-orange-600' />
            </div>
          </div>
        </Card>

        <Card className='p-6'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-xs font-semibold text-slate-600 uppercase'>
                Total Moves
              </p>
              <p className='text-3xl font-black text-slate-900 mt-2'>
                {powerMoves.length}
              </p>
            </div>
            <div className='h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center'>
              <TrendingUp className='h-6 w-6 text-blue-600' />
            </div>
          </div>
        </Card>

        <Card className='p-6'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-xs font-semibold text-slate-600 uppercase'>
                To Target
              </p>
              <p className='text-3xl font-black text-slate-900 mt-2'>
                {missionTarget - missionProgress}
              </p>
            </div>
            <div className='h-12 w-12 rounded-full bg-green-100 flex items-center justify-center'>
              <Target className='h-6 w-6 text-green-600' />
            </div>
          </div>
        </Card>
      </div>

      {/* Key Insight */}
      <div className='bg-slate-50 border border-slate-200 rounded-lg p-6'>
        <p className='text-sm font-semibold text-slate-900 mb-2'>
          How this works
        </p>
        <ul className='space-y-2 text-sm text-slate-600'>
          <li className='flex gap-2'>
            <span className='font-semibold text-slate-900'>1.</span>
            <span>You execute your Power Moves daily</span>
          </li>
          <li className='flex gap-2'>
            <span className='font-semibold text-slate-900'>2.</span>
            <span>Your execution rate contributes to team momentum</span>
          </li>
          <li className='flex gap-2'>
            <span className='font-semibold text-slate-900'>3.</span>
            <span>Team momentum drives {missionName} progress</span>
          </li>
          <li className='flex gap-2'>
            <span className='font-semibold text-slate-900'>4.</span>
            <span>Mission success = Your 30% salary increase</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
