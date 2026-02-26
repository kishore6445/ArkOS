'use client'

import { Card } from '@/components/ui/card'
import { CheckCircle, Zap, Target } from 'lucide-react'
import { COMPANY_MISSION } from '@/lib/mission-context'

interface TodaysExecutionFocusProps {
  powerMovesCompleted: number
  powerMovesTarget: number
  tasksCompleted: number
  tasksTotal: number
  period: 'today' | 'this-week' | 'this-month' | 'this-quarter'
}

export function TodaysExecutionFocus({
  powerMovesCompleted,
  powerMovesTarget,
  tasksCompleted,
  tasksTotal,
  period,
}: TodaysExecutionFocusProps) {
  const powerMovesProgress = (powerMovesCompleted / powerMovesTarget) * 100
  const tasksProgress = (tasksTotal > 0 ? (tasksCompleted / tasksTotal) * 100 : 0)
  const missionProgress = (COMPANY_MISSION.totalAchieved / COMPANY_MISSION.totalTarget) * 100

  const getPeriodLabel = () => {
    switch (period) {
      case 'today':
        return "Today's Focus"
      case 'this-week':
        return 'This Week'
      case 'this-month':
        return 'This Month'
      case 'this-quarter':
        return 'This Quarter'
    }
  }

  return (
    <div className='px-6 sm:px-8 lg:px-12 py-8 bg-slate-50 border-b border-slate-200'>
      <div className='max-w-7xl mx-auto'>
        <h2 className='text-sm font-bold uppercase tracking-widest text-slate-600 mb-6'>
          {getPeriodLabel()}
        </h2>

        {/* Primary Metric: Power Moves */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {/* Power Moves Progress */}
          <div className='bg-white rounded-lg border border-slate-200 p-6 hover:shadow-md transition-shadow'>
            <div className='flex items-start justify-between mb-4'>
              <div>
                <p className='text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1'>
                  Power Moves
                </p>
                <p className='text-3xl font-black text-slate-900'>
                  {powerMovesCompleted}
                  <span className='text-sm font-semibold text-slate-400 ml-1'>/{powerMovesTarget}</span>
                </p>
              </div>
              <Zap className='h-6 w-6 text-orange-500' />
            </div>
            <div className='h-2 bg-slate-200 rounded-full overflow-hidden'>
              <div
                className='h-full bg-orange-500 transition-all duration-300'
                style={{ width: `${powerMovesProgress}%` }}
              />
            </div>
            <p className='text-xs text-slate-500 mt-2'>
              {Math.round(powerMovesProgress)}% of daily target
            </p>
          </div>

          {/* Tasks Progress */}
          <div className='bg-white rounded-lg border border-slate-200 p-6 hover:shadow-md transition-shadow'>
            <div className='flex items-start justify-between mb-4'>
              <div>
                <p className='text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1'>
                  Tasks Completed
                </p>
                <p className='text-3xl font-black text-slate-900'>
                  {tasksCompleted}
                  <span className='text-sm font-semibold text-slate-400 ml-1'>/{tasksTotal}</span>
                </p>
              </div>
              <CheckCircle className='h-6 w-6 text-green-500' />
            </div>
            <div className='h-2 bg-slate-200 rounded-full overflow-hidden'>
              <div
                className='h-full bg-green-500 transition-all duration-300'
                style={{ width: `${tasksProgress}%` }}
              />
            </div>
            <p className='text-xs text-slate-500 mt-2'>
              {Math.round(tasksProgress)}% complete
            </p>
          </div>

          {/* Mission 30 Impact */}
          <div className='bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200 p-6 hover:shadow-md transition-shadow'>
            <div className='flex items-start justify-between mb-4'>
              <div>
                <p className='text-xs font-semibold uppercase tracking-wide text-orange-600 mb-1'>
                  Mission 30
                </p>
                <p className='text-3xl font-black text-orange-900'>
                  {COMPANY_MISSION.totalAchieved}
                  <span className='text-sm font-semibold text-orange-700 ml-1'>/{COMPANY_MISSION.totalTarget}</span>
                </p>
              </div>
              <Target className='h-6 w-6 text-orange-600' />
            </div>
            <div className='h-2 bg-orange-200 rounded-full overflow-hidden'>
              <div
                className='h-full bg-orange-600 transition-all duration-300'
                style={{ width: `${missionProgress}%` }}
              />
            </div>
            <p className='text-xs text-orange-700 mt-2'>
              {Math.round(missionProgress)}% toward 30% salary hike
            </p>
          </div>
        </div>

        {/* Connection Message */}
        <div className='mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg'>
          <p className='text-sm text-blue-900'>
            <span className='font-semibold'>Your execution matters:</span> Each power move you complete brings us closer to Mission 30. When we reach 30 clients, you earn your 30% salary hike.
          </p>
        </div>
      </div>
    </div>
  )
}
