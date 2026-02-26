'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface PersonalGoal {
  id: string
  name: string
  goalType: 'Quantitative' | 'Qualitative' | 'Learning'
  currentValue: number
  targetValue: number
  status: 'On Track' | 'At Risk' | 'Behind'
}

interface PersonalGoalsCollapsibleProps {
  goals: PersonalGoal[]
}

export function PersonalGoalsCollapsible({ goals }: PersonalGoalsCollapsibleProps) {
  const [isOpen, setIsOpen] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'On Track':
        return 'bg-green-100 text-green-700'
      case 'At Risk':
        return 'bg-amber-100 text-amber-700'
      case 'Behind':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-slate-100 text-slate-700'
    }
  }

  const getGoalTypeIcon = (type: string) => {
    switch (type) {
      case 'Quantitative':
        return '📊'
      case 'Qualitative':
        return '✍️'
      case 'Learning':
        return '📚'
      default:
        return '🎯'
    }
  }

  return (
    <div className='px-6 sm:px-8 lg:px-12 py-6 bg-white border-b border-slate-200'>
      <div className='max-w-7xl mx-auto'>
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger className='w-full'>
            <div className='flex items-center justify-between group cursor-pointer'>
              <div className='text-left'>
                <h3 className='text-sm font-bold uppercase tracking-widest text-slate-900'>
                  Personal Goals
                </h3>
                <p className='text-xs text-slate-500 mt-1'>
                  {goals.length} goal{goals.length !== 1 ? 's' : ''} · Click to expand
                </p>
              </div>
              <ChevronDown
                className={cn(
                  'h-5 w-5 text-slate-400 transition-transform duration-200 group-hover:text-slate-600',
                  isOpen && 'rotate-180'
                )}
              />
            </div>
          </CollapsibleTrigger>

          <CollapsibleContent className='mt-4 space-y-3 animate-fade-in-up'>
            {goals.length === 0 ? (
              <div className='p-4 bg-slate-50 rounded-lg border border-slate-200'>
                <p className='text-sm text-slate-600'>No personal goals yet. Define your goals to track progress.</p>
              </div>
            ) : (
              goals.map((goal) => (
                <div key={goal.id} className='bg-slate-50 rounded-lg p-4 border border-slate-200 hover:border-slate-300 transition-colors'>
                  <div className='flex items-start justify-between mb-3'>
                    <div className='flex items-center gap-3 flex-1'>
                      <span className='text-lg'>{getGoalTypeIcon(goal.goalType)}</span>
                      <div className='flex-1'>
                        <p className='text-sm font-semibold text-slate-900'>{goal.name}</p>
                        <p className='text-xs text-slate-500 mt-0.5'>{goal.goalType}</p>
                      </div>
                    </div>
                    <Badge className={cn('flex-shrink-0', getStatusColor(goal.status))}>
                      {goal.status}
                    </Badge>
                  </div>

                  {/* Progress bar */}
                  <div className='flex items-center gap-3'>
                    <div className='flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden'>
                      <div
                        className={cn(
                          'h-full transition-all duration-300',
                          goal.status === 'On Track' ? 'bg-green-500' :
                          goal.status === 'At Risk' ? 'bg-amber-500' :
                          'bg-red-500'
                        )}
                        style={{ width: `${Math.min((goal.currentValue / goal.targetValue) * 100, 100)}%` }}
                      />
                    </div>
                    <span className='text-xs font-semibold text-slate-600 flex-shrink-0'>
                      {goal.currentValue}/{goal.targetValue}
                    </span>
                  </div>
                </div>
              ))
            )}
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  )
}
