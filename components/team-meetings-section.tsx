'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, ChevronDown, CheckCircle, AlertCircle, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface MOM {
  id: string
  owner: string
  commitment: string
  dueDate: string
  status: 'on-track' | 'at-risk' | 'overdue'
}

export interface TeamMeeting {
  id: string
  date: string
  attendeeCount: number
  moms: MOM[]
  notes?: string
}

interface TeamMeetingsSectionProps {
  meetings: TeamMeeting[]
  onCreateMeeting?: () => void
  onReviewMeeting?: (meeting: TeamMeeting) => void
}

export function TeamMeetingsSection({ meetings, onCreateMeeting, onReviewMeeting }: TeamMeetingsSectionProps) {
  const [expandedMeetingId, setExpandedMeetingId] = useState<string | null>(null)

  if (meetings.length === 0) {
    return (
      <div className='p-8 text-center border border-dashed border-slate-300 rounded-lg bg-slate-50'>
        <p className='text-sm font-semibold text-slate-600 mb-4'>No team meetings scheduled</p>
        <Button 
          className='bg-blue-500 hover:bg-blue-600 text-white font-bold'
          onClick={onCreateMeeting}
        >
          <Plus className='h-4 w-4 mr-2' />
          Schedule Team Meeting
        </Button>
      </div>
    )
  }

  const getStatusIcon = (status: 'on-track' | 'at-risk' | 'overdue') => {
    switch (status) {
      case 'on-track':
        return <CheckCircle className='h-4 w-4 text-green-600' />
      case 'at-risk':
        return <AlertCircle className='h-4 w-4 text-amber-600' />
      case 'overdue':
        return <XCircle className='h-4 w-4 text-red-600' />
    }
  }

  const getStatusColor = (status: 'on-track' | 'at-risk' | 'overdue') => {
    switch (status) {
      case 'on-track':
        return 'text-green-600'
      case 'at-risk':
        return 'text-amber-600'
      case 'overdue':
        return 'text-red-600'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <div className='space-y-3'>
      {meetings.map((meeting) => (
        <div
          key={meeting.id}
          className='border border-slate-200 rounded-lg overflow-hidden bg-white hover:shadow-md transition-shadow duration-200'
        >
          {/* Meeting Header - Always Visible */}
          <button
            onClick={() => setExpandedMeetingId(expandedMeetingId === meeting.id ? null : meeting.id)}
            className='w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors duration-200'
          >
            <div className='flex items-center gap-4 flex-1 text-left'>
              <div>
                <p className='text-sm font-bold text-slate-900'>{formatDate(meeting.date)}</p>
                <p className='text-xs text-slate-500 mt-1'>{meeting.attendeeCount} attendees</p>
              </div>
            </div>

            {/* MOMs Summary at a Glance */}
            <div className='flex items-center gap-2'>
              <div className='flex items-center gap-1 bg-slate-50 px-3 py-1 rounded'>
                <span className='text-xs font-bold text-slate-700'>{meeting.moms.length}</span>
                <span className='text-xs text-slate-600'>commits</span>
              </div>
              <ChevronDown
                className={cn(
                  'h-5 w-5 text-slate-400 transition-transform duration-200',
                  expandedMeetingId === meeting.id && 'rotate-180'
                )}
              />
            </div>
          </button>

          {/* MOMs List - Expands on Click */}
          {expandedMeetingId === meeting.id && (
            <div className='border-t border-slate-200 bg-slate-50 p-6 space-y-4'>
              {meeting.moms.length === 0 ? (
                <p className='text-xs text-slate-500 text-center py-4'>No commitments recorded</p>
              ) : (
                <div className='space-y-2'>
                  {meeting.moms.map((mom) => (
                    <div key={mom.id} className='flex items-start gap-3 py-2'>
                      <div className='flex-shrink-0 mt-1'>
                        {getStatusIcon(mom.status)}
                      </div>
                      <div className='flex-1 min-w-0'>
                        <div className='flex items-center gap-2 flex-wrap'>
                          <span className='text-xs font-bold text-slate-900'>{mom.owner}</span>
                          <span className='text-xs text-slate-600'>—</span>
                          <span className='text-xs text-slate-700 flex-1'>{mom.commitment}</span>
                        </div>
                        <p className={cn('text-xs font-semibold mt-1', getStatusColor(mom.status))}>
                          Due: {formatDate(mom.dueDate)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className='mt-4 pt-4 border-t border-slate-200 flex gap-2'>
                <Button 
                  variant='outline' 
                  size='sm' 
                  className='text-xs'
                  onClick={() => onReviewMeeting?.(meeting)}
                >
                  Review & Update
                </Button>
                {meeting.notes && (
                  <Button variant='outline' size='sm' className='text-xs'>
                    View Full Notes
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Quick Add Button */}
      <div className='pt-4'>
        <Button
          variant='outline'
          className='w-full border-blue-300 text-blue-600 hover:bg-blue-50 font-bold'
          onClick={onCreateMeeting}
        >
          <Plus className='h-4 w-4 mr-2' />
          New Team Meeting
        </Button>
      </div>
    </div>
  )
}
