'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { X, Plus, Loader2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { TeamMeeting } from './team-meetings-section'

export interface CreateTeamMeetingData {
  date: string
  attendees: string[]
  notes?: string
}

interface CreateTeamMeetingModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  departmentName: string
  onSave: (meetingData: TeamMeeting) => void
}

export function CreateTeamMeetingModal({
  open,
  onOpenChange,
  departmentName,
  onSave,
}: CreateTeamMeetingModalProps) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [attendees, setAttendees] = useState<string[]>([])
  const [attendeeInput, setAttendeeInput] = useState('')
  const [notes, setNotes] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleAddAttendee = () => {
    if (attendeeInput.trim() && !attendees.includes(attendeeInput.trim())) {
      setAttendees([...attendees, attendeeInput.trim()])
      setAttendeeInput('')
    }
  }

  const handleRemoveAttendee = (attendee: string) => {
    setAttendees(attendees.filter((a) => a !== attendee))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!date) newErrors.date = 'Meeting date is required'
    if (attendees.length === 0) newErrors.attendees = 'Add at least one attendee'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validateForm()) return

    setIsLoading(true)
    try {
      const newMeeting: TeamMeeting = {
        id: Date.now().toString(),
        date,
        attendeeCount: attendees.length,
        moms: [],
        notes: notes || undefined,
      }

      onSave(newMeeting)
      resetForm()
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setDate(new Date().toISOString().split('T')[0])
    setAttendees([])
    setAttendeeInput('')
    setNotes('')
    setErrors({})
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle className='text-xl font-black'>Create Team Meeting</DialogTitle>
          <DialogDescription>{departmentName}</DialogDescription>
        </DialogHeader>

        <div className='space-y-5 py-4'>
          {/* Meeting Date */}
          <div className='space-y-2'>
            <Label htmlFor='meeting-date' className='text-sm font-bold'>
              Meeting Date
            </Label>
            <Input
              id='meeting-date'
              type='date'
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className='border-slate-300'
            />
            {errors.date && <p className='text-xs text-red-600'>{errors.date}</p>}
          </div>

          {/* Attendees */}
          <div className='space-y-2'>
            <Label htmlFor='attendee-input' className='text-sm font-bold'>
              Attendees
            </Label>
            <div className='flex gap-2'>
              <Input
                id='attendee-input'
                type='text'
                placeholder='Add team member name'
                value={attendeeInput}
                onChange={(e) => setAttendeeInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddAttendee()
                  }
                }}
                className='border-slate-300 text-sm'
              />
              <Button
                type='button'
                onClick={handleAddAttendee}
                variant='outline'
                size='sm'
                className='px-3'
              >
                <Plus className='h-4 w-4' />
              </Button>
            </div>

            {/* Attendee Tags */}
            {attendees.length > 0 && (
              <div className='flex flex-wrap gap-2'>
                {attendees.map((attendee) => (
                  <Badge
                    key={attendee}
                    variant='secondary'
                    className='flex items-center gap-2 px-3 py-1'
                  >
                    {attendee}
                    <button
                      onClick={() => handleRemoveAttendee(attendee)}
                      className='hover:opacity-70'
                    >
                      <X className='h-3 w-3' />
                    </button>
                  </Badge>
                ))}
              </div>
            )}

            {errors.attendees && <p className='text-xs text-red-600'>{errors.attendees}</p>}
            <p className='text-xs text-slate-500'>
              {attendees.length} attendee{attendees.length !== 1 ? 's' : ''} added
            </p>
          </div>

          {/* Optional Notes */}
          <div className='space-y-2'>
            <Label htmlFor='meeting-notes' className='text-sm font-bold'>
              Notes (Optional)
            </Label>
            <Textarea
              id='meeting-notes'
              placeholder='Key discussion points, agenda items...'
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className='border-slate-300 resize-none text-sm'
            />
          </div>
        </div>

        <div className='flex gap-2 justify-end pt-4 border-t border-slate-200'>
          <Button
            variant='outline'
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isLoading || !date || attendees.length === 0}
            className='bg-blue-600 hover:bg-blue-700 text-white'
          >
            {isLoading && <Loader2 className='h-4 w-4 mr-2 animate-spin' />}
            Create Meeting
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
