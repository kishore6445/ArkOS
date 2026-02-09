"use client"

import { useMission } from "@/lib/mission-context"
import { CheckCircle, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface MissionContextSectionProps {
  type: 'individual' | 'department'
  brandName?: string
  departmentName?: string
}

export function MissionContextSection({
  type,
  brandName,
  departmentName,
}: MissionContextSectionProps) {
  const { mission, getBrandContribution } = useMission()

  if (type === 'individual' && brandName) {
    const contribution = getBrandContribution(brandName)
    if (!contribution) return null

    const progress = (contribution.achieved / contribution.target) * 100

    return (
      <div className='px-6 sm:px-8 lg:px-12 py-8 bg-white border-b border-slate-100'>
        <div className='max-w-7xl mx-auto'>
          <div className='flex items-center justify-between'>
            <div>
              <div className='flex items-center gap-2 mb-3'>
                <span className='text-xs font-bold uppercase tracking-wide text-slate-500'>Your contribution to</span>
                <span className='text-sm font-black text-slate-900'>{mission.name}</span>
              </div>
              <p className='text-sm text-slate-600 font-semibold'>
                {brandName}: {contribution.achieved} of {contribution.target} clients
              </p>
            </div>
            <div className='flex items-center gap-4 flex-shrink-0'>
              <div className='w-32 h-2 bg-slate-200 rounded-full overflow-hidden'>
                <div
                  className={cn(
                    'h-full transition-all duration-500 rounded-full',
                    progress >= 70 ? 'bg-green-500' :
                    progress >= 50 ? 'bg-amber-500' :
                    'bg-red-500'
                  )}
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
              <span className='text-sm font-bold text-slate-900 w-12 text-right'>
                {Math.round(progress)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (type === 'department') {
    return (
      <div className='px-6 sm:px-8 lg:px-12 py-8 bg-white border-b border-slate-100'>
        <div className='max-w-7xl mx-auto'>
          <div className='flex items-center gap-2 mb-6'>
            <span className='text-xs font-bold uppercase tracking-wide text-slate-500'>Your Role in</span>
            <span className='text-sm font-black text-slate-900'>{mission.name}</span>
          </div>

          {/* Brand Breakdown - Clean Grid */}
          <div className='grid grid-cols-3 gap-6'>
            {mission.brandBreakdown.map((brand) => {
              const progress = (brand.achieved / brand.target) * 100
              return (
                <div key={brand.name} className='flex items-center justify-between'>
                  <div>
                    <p className='text-xs font-bold text-slate-600 mb-2'>{brand.name}</p>
                    <p className='text-sm font-bold text-slate-900'>
                      {brand.achieved}
                      <span className='text-slate-500 font-normal text-xs'> / {brand.target}</span>
                    </p>
                  </div>
                  <div className='flex items-center gap-2'>
                    <div className='h-1.5 w-20 bg-slate-200 rounded-full overflow-hidden'>
                      <div
                        className='h-full transition-all duration-500 rounded-full'
                        style={{
                          width: `${Math.min(progress, 100)}%`,
                          backgroundColor: brand.color,
                        }}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  return null
}
