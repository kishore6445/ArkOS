'use client'

import { Card } from '@/components/ui/card'
import { Target } from 'lucide-react'
import { cn } from '@/lib/utils'

interface WarGoalCardProps {
  companyWIG?: string
  className?: string
  equalHeight?: boolean
  minHeight?: string
}

export function WarGoalCard({ companyWIG, className, equalHeight, minHeight }: WarGoalCardProps) {
  const warGoalText = 'Onboard 50 Clients Across All Departments'
  const achieved = 0
  const target = 50
  const progress = target > 0 ? (achieved / target) * 100 : 0

  const statusColor = progress >= 70 ? '#16A34A' : progress >= 50 ? '#F59E0B' : '#DC2626'
  const statusBg = progress >= 70 ? 'bg-emerald-100' : progress >= 50 ? 'bg-amber-100' : 'bg-rose-100'
  const statusLabel = progress >= 70 ? 'On Track' : progress >= 50 ? 'At Risk' : 'Behind'

  return (
    <div className={cn('flex flex-col h-full', className)}>
      <div className={cn(
        'flex-1 p-6 lg:p-8 flex flex-col items-center justify-center text-center',
        equalHeight ? cn('bg-gradient-to-br from-purple-50 to-violet-50 border-l-2 border-l-purple-200 border-t-4 border-b-4 border-purple-400 border-r-4 border-r-purple-400 rounded-r-lg shadow-md hover:shadow-lg transition-shadow duration-300', minHeight ? `min-h-[${minHeight}]` : 'min-h-[340px]') : 'min-h-[280px] bg-white border-2 border-stone-200 rounded-lg'
      )}>
        <div className='space-y-3 w-full'>
          {/* Header */}
          <div className='space-y-1'>
            <p className={cn('text-base font-black uppercase tracking-[0.15em]', equalHeight ? 'text-purple-900' : 'text-stone-900')}>War Goal</p>
            {equalHeight && <div className='h-0.5 w-10 bg-purple-300 mx-auto rounded-full'></div>}
            <p className={cn('text-xs font-semibold mt-1', equalHeight ? 'text-purple-700' : 'text-stone-500')}>Company Mission (Lag Measure)</p>
          </div>

          {/* Main Text */}
          <div className='py-4'>
            <p className={cn('text-lg font-semibold leading-snug', equalHeight ? 'text-purple-900' : 'text-stone-900')}>
              {warGoalText}
            </p>
          </div>

          {/* Progress Number */}
          <div className='py-3'>
            <div className={cn('text-5xl font-black tabular-nums leading-none', equalHeight ? 'text-purple-900' : 'text-stone-900')}>
              {achieved}
            </div>
            <div className={cn('text-lg font-bold mt-2', equalHeight ? 'text-purple-400' : 'text-stone-400')}>/ {target}</div>
          </div>

          {/* Status Badge */}
          <div className={cn(
            'inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-black shadow-sm mx-auto',
            statusBg,
            progress >= 70 ? 'text-emerald-700' : progress >= 50 ? 'text-amber-700' : 'text-rose-700'
          )}>
            <Target className='h-4 w-4' />
            <span>{statusLabel}</span>
          </div>

          {/* Progress Bar */}
          <div className={cn('h-2 rounded-full overflow-hidden mt-4', equalHeight ? 'bg-purple-200' : 'bg-stone-200')}>
            <div
              className='h-full transition-all duration-500'
              style={{
                width: `${Math.min(progress, 100)}%`,
                backgroundColor: statusColor,
              }}
            />
          </div>

          {/* Footer text */}
          <p className={cn('text-xs mt-4 italic font-medium', equalHeight ? 'text-purple-600' : 'text-stone-400')}>
            Company-wide strategic outcome
          </p>
        </div>
      </div>
    </div>
  )
}
