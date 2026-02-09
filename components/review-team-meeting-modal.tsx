"use client"

import type React from "react"
import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Plus, Trash2, CheckCircle2, AlertCircle, XCircle, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"
import type { TeamMeeting } from "./team-meetings-section"

interface MOMInput {
  id: string
  owner: string
  commitment: string
  dueDate: string
}

interface ReviewTeamMeetingModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  departmentName?: string
  meeting?: TeamMeeting | null
  onSave?: (meetingData: TeamMeeting) => void
}

export function ReviewTeamMeetingModal({
  open,
  onOpenChange,
  departmentName = "Department",
  meeting,
  onSave,
}: ReviewTeamMeetingModalProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Form state - START WITH CURRENT MEETING DATA (only if meeting exists)
  const [meetingDate, setMeetingDate] = useState(meeting?.date || "")
  const [attendeeCount, setAttendeeCount] = useState(meeting?.attendeeCount || 0)
  const [moms, setMoms] = useState<MOMInput[]>(
    meeting?.moms?.map(m => ({
      id: m.id,
      owner: m.owner,
      commitment: m.commitment,
      dueDate: m.dueDate,
    })) || []
  )
  const [notes, setNotes] = useState(meeting?.notes || "")

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!meetingDate) newErrors.meetingDate = "Meeting date is required"
    if (attendeeCount === 0) newErrors.attendeeCount = "Add at least one attendee"
    
    const validMoms = moms.filter(m => m.owner && m.commitment && m.dueDate)
    if (validMoms.length === 0) {
      newErrors.moms = "Add at least one commitment"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle save
  const handleSave = async () => {
    if (!validateForm()) return

    setIsLoading(true)
    try {
      const validMoms = moms.filter(m => m.owner && m.commitment && m.dueDate)
      
      const newMeeting: TeamMeeting = {
        id: Date.now().toString(),
        date: meetingDate,
        attendeeCount,
        moms: validMoms.map(m => ({
          id: m.id,
          owner: m.owner,
          commitment: m.commitment,
          dueDate: m.dueDate,
          status: 'on-track',
        })),
        notes,
      }

      onSave?.(newMeeting)
      resetForm()
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setMeetingDate(new Date().toISOString().split('T')[0])
    setAttendeeCount(0)
    setMoms([{ id: "1", owner: "", commitment: "", dueDate: "" }])
    setNotes("")
    setErrors({})
    onOpenChange(false)
  }

  // Add new MOM row
  const addMOM = () => {
    setMoms([
      ...moms,
      { id: Date.now().toString(), owner: "", commitment: "", dueDate: "" },
    ])
  }

  // Remove MOM row
  const removeMOM = (id: string) => {
    setMoms(moms.filter(m => m.id !== id))
  }

  // Update MOM field
  const updateMOM = (id: string, field: string, value: string) => {
    setMoms(moms.map(m => (m.id === id ? { ...m, [field]: value } : m)))
  }

  return (
    <Dialog open={open && !!meeting} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        {meeting ? (
          <>
        <DialogHeader>
          <DialogTitle className="text-2xl font-black">Review Meeting - {departmentName}</DialogTitle>
          <DialogDescription>
            Review last week's results, update this week's MOMs
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-6 py-6">
          {/* LEFT PANEL: THIS MEETING'S MOMs - ACCOUNTABILITY VIEW */}
          <div className="border-r border-slate-200 pr-6">
            <h3 className="text-sm font-bold uppercase text-slate-700 mb-4">Meeting MOMs - Accountability Check</h3>
            
            {meeting.moms && meeting.moms.length > 0 ? (
              <div className="space-y-3">
                {meeting.moms.map((mom) => {
                  const statusIcon = mom.status === 'on-track' 
                    ? <CheckCircle2 className="h-4 w-4 text-green-600" />
                    : mom.status === 'at-risk'
                    ? <AlertCircle className="h-4 w-4 text-amber-600" />
                    : <XCircle className="h-4 w-4 text-red-600" />

                  const statusColor = mom.status === 'on-track'
                    ? 'bg-green-50 border-green-200'
                    : mom.status === 'at-risk'
                    ? 'bg-amber-50 border-amber-200'
                    : 'bg-red-50 border-red-200'

                  return (
                    <div key={mom.id} className={cn("border rounded-lg p-3", statusColor)}>
                      <div className="flex items-start gap-2 mb-2">
                        {statusIcon}
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-slate-700">{mom.owner}</p>
                          <p className="text-xs text-slate-600 mt-1 line-clamp-2">{mom.commitment}</p>
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Due: {mom.dueDate}
                      </p>
                      <div className="mt-2 pt-2 border-t border-current border-opacity-10">
                        <span className={cn(
                          "text-xs font-bold px-2 py-0.5 rounded inline-block",
                          mom.status === 'on-track' ? 'bg-green-100 text-green-800' :
                          mom.status === 'at-risk' ? 'bg-amber-100 text-amber-800' :
                          'bg-red-100 text-red-800'
                        )}>
                          {mom.status === 'on-track' ? 'Completed' : mom.status === 'at-risk' ? 'In Progress' : 'Overdue'}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500">
                <p className="text-xs font-semibold">No MOMs recorded</p>
                <p className="text-xs text-slate-400 mt-1">Add commitments for this meeting</p>
              </div>
            )}
          </div>

          {/* RIGHT PANEL: THIS WEEK - NEW COMMITMENTS FORM */}
          <div className="pl-6">
            <h3 className="text-sm font-bold uppercase text-slate-700 mb-4">This Week's Commitments</h3>

            <div className="space-y-4">
              {/* Meeting Date */}
              <div>
                <Label htmlFor="meeting-date" className="text-xs font-bold text-slate-700">Meeting Date</Label>
                <Input
                  id="meeting-date"
                  type="date"
                  value={meetingDate}
                  onChange={(e) => setMeetingDate(e.target.value)}
                  className="mt-1 text-sm"
                />
                {errors.meetingDate && <p className="text-xs text-red-600 mt-1">{errors.meetingDate}</p>}
              </div>

              {/* Attendee Count */}
              <div>
                <Label htmlFor="attendee-count" className="text-xs font-bold text-slate-700">Number of Attendees</Label>
                <Input
                  id="attendee-count"
                  type="number"
                  min="1"
                  value={attendeeCount}
                  onChange={(e) => setAttendeeCount(parseInt(e.target.value) || 0)}
                  className="mt-1 text-sm"
                />
                {errors.attendeeCount && <p className="text-xs text-red-600 mt-1">{errors.attendeeCount}</p>}
              </div>

              {/* MOMs Section */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-xs font-bold text-slate-700">Commitments (MOMs)</Label>
                  <span className="text-xs text-slate-500">{moms.filter(m => m.owner && m.commitment && m.dueDate).length} added</span>
                </div>

                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {moms.map((mom, index) => (
                    <div key={mom.id} className="flex gap-2 items-start">
                      <div className="flex-1 space-y-2">
                        <Input
                          placeholder="Owner name"
                          value={mom.owner}
                          onChange={(e) => updateMOM(mom.id, 'owner', e.target.value)}
                          className="text-xs h-8"
                        />
                        <Input
                          placeholder="What's the commitment?"
                          value={mom.commitment}
                          onChange={(e) => updateMOM(mom.id, 'commitment', e.target.value)}
                          className="text-xs h-8"
                        />
                        <Input
                          type="date"
                          value={mom.dueDate}
                          onChange={(e) => updateMOM(mom.id, 'dueDate', e.target.value)}
                          className="text-xs h-8"
                        />
                      </div>
                      {moms.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeMOM(mom.id)}
                          className="mt-8 h-8 w-8 p-0"
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                {errors.moms && <p className="text-xs text-red-600 mt-1">{errors.moms}</p>}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={addMOM}
                  className="w-full mt-3 text-xs"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add Another Commitment
                </Button>
              </div>

              {/* Notes */}
              <div>
                <Label htmlFor="notes" className="text-xs font-bold text-slate-700">Meeting Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Key decisions, discussion points, etc."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="mt-1 text-xs min-h-20 resize-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="border-t border-slate-200 pt-4 flex items-center justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Save Meeting
          </Button>
        </div>
          </>
        ) : (
          <p className="text-center text-slate-500 py-8">No meeting data available</p>
        )}
      </DialogContent>
    </Dialog>
  )
}
