'use client'

import { COMPANY_MISSION, useMission } from '@/lib/mission-context'

export function MissionBanner() {
  const { getProgress } = useMission()
  const progress = getProgress()
  const clientsRemaining = COMPANY_MISSION.totalTarget - COMPANY_MISSION.totalAchieved

  return (
    <div className='bg-gradient-to-r from-orange-50 to-orange-100 border-b border-orange-200 px-6 py-4'>
      <div className='max-w-7xl mx-auto'>
        <div className='flex items-center justify-between gap-6'>
          <div className='flex-1'>
            <div className='flex items-baseline gap-3'>
              <h3 className='text-sm font-bold uppercase tracking-widest text-orange-900'>
                {COMPANY_MISSION.name}
              </h3>
              <span className='text-xs font-semibold text-orange-700'>
                {COMPANY_MISSION.totalAchieved}/{COMPANY_MISSION.totalTarget} clients
              </span>
            </div>
            <p className='text-sm text-orange-800 mt-1'>
              {clientsRemaining === 0 
                ? '🎉 Mission Complete!' 
                : `${clientsRemaining} clients away from ${COMPANY_MISSION.totalTarget}% salary hike`}
            </p>
          </div>
          <div className='hidden sm:block'>
            <div className='text-right'>
              <div className='text-2xl font-black text-orange-600'>
                {Math.round(progress)}%
              </div>
              <div className='text-xs font-semibold text-orange-700'>Complete</div>
            </div>
          </div>
        </div>
        <div className='mt-3 h-1.5 bg-white rounded-full overflow-hidden'>
          <div 
            className='h-full bg-orange-500 rounded-full transition-all duration-500' 
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  )
}
