"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle2, TrendingUp, AlertCircle, Plus, X, ChevronDown, ChevronUp } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface GoalProgress {
  id: string
  goalName: string
  goalType: "Quantitative" | "Qualitative" | "Learning"
  target?: number
  current?: number
  description?: string
  notes?: string
}

interface DailyReportFormProps {
  onSubmit: (report: any) => void
}

export function DailyReportForm({ onSubmit }: DailyReportFormProps) {
  const [step, setStep] = useState<"goals" | "wins" | "blockers" | "tomorrow">("goals")
  const [goalProgress, setGoalProgress] = useState<GoalProgress[]>([])
  const [wins, setWins] = useState<string[]>([""])
  const [blockers, setBlockers] = useState<string[]>([""])
  const [tomorrow, setTomorrow] = useState<string[]>([""])

  // Mock data - replace with actual user's goals
  const mockGoals: GoalProgress[] = [
    {
      id: "1",
      goalName: "Client Discovery Calls",
      goalType: "Quantitative",
      target: 5,
      current: 0,
    },
    {
      id: "2",
      goalName: "Team Collaboration Quality",
      goalType: "Qualitative",
      description: "Ensure team members feel heard and engaged",
      notes: "",
    },
    {
      id: "3",
      goalName: "Learn Advanced Analytics",
      goalType: "Learning",
      description: "Complete Google Analytics certification",
      notes: "",
    },
  ]

  const handleGoalUpdate = (id: string, field: string, value: any) => {
    const exists = goalProgress.find((g) => g.id === id)
    if (exists) {
      setGoalProgress(goalProgress.map((g) => (g.id === id ? { ...g, [field]: value } : g)))
    } else {
      const mockGoal = mockGoals.find((g) => g.id === id)
      if (mockGoal) {
        setGoalProgress([...goalProgress, { ...mockGoal, [field]: value }])
      }
    }
  }

  const handleAddWin = () => setWins([...wins, ""])
  const handleAddBlocker = () => setBlockers([...blockers, ""])
  const handleAddTomorrow = () => setTomorrow([...tomorrow, ""])

  const handleWinChange = (index: number, value: string) => {
    const newWins = [...wins]
    newWins[index] = value
    setWins(newWins)
  }

  const handleBlockerChange = (index: number, value: string) => {
    const newBlockers = [...blockers]
    newBlockers[index] = value
    setBlockers(newBlockers)
  }

  const handleTomorrowChange = (index: number, value: string) => {
    const newTomorrow = [...tomorrow]
    newTomorrow[index] = value
    setTomorrow(newTomorrow)
  }

  const handleRemoveWin = (index: number) => setWins(wins.filter((_, i) => i !== index))
  const handleRemoveBlocker = (index: number) => setBlockers(blockers.filter((_, i) => i !== index))
  const handleRemoveTomorrow = (index: number) => setTomorrow(tomorrow.filter((_, i) => i !== index))

  const handleSubmit = () => {
    onSubmit({
      goalProgress,
      wins: wins.filter((w) => w.trim()),
      blockers: blockers.filter((b) => b.trim()),
      tomorrow: tomorrow.filter((t) => t.trim()),
    })
  }

  const getGoalTypeColor = (type: string) => {
    switch (type) {
      case "Quantitative":
        return "bg-blue-50 border-blue-200"
      case "Qualitative":
        return "bg-amber-50 border-amber-200"
      case "Learning":
        return "bg-purple-50 border-purple-200"
      default:
        return "bg-gray-50 border-gray-200"
    }
  }

  const getGoalTypeBadgeColor = (type: string) => {
    switch (type) {
      case "Quantitative":
        return "bg-blue-100 text-blue-800"
      case "Qualitative":
        return "bg-amber-100 text-amber-800"
      case "Learning":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Step Indicator */}
      <div className="flex gap-2 items-center justify-between">
        <div className="flex gap-1">
          {["goals", "wins", "blockers", "tomorrow"].map((s) => (
            <button
              key={s}
              onClick={() => setStep(s as any)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                step === s ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {s === "goals" && "Goals"}
              {s === "wins" && "Wins"}
              {s === "blockers" && "Blockers"}
              {s === "tomorrow" && "Tomorrow"}
            </button>
          ))}
        </div>
      </div>

      {/* STEP 1: Goals Progress */}
      {step === "goals" && (
        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-slate-900">Today's Goals</h3>
            <p className="text-slate-600">Update your progress on each goal.</p>
          </div>

          <div className="space-y-3">
            {mockGoals.map((goal) => (
              <div key={goal.id} className={`border-2 rounded-xl p-5 transition ${getGoalTypeColor(goal.goalType)}`}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-slate-900">{goal.goalName}</h4>
                      <span className={`text-xs font-bold px-2 py-1 rounded ${getGoalTypeBadgeColor(goal.goalType)}`}>
                        {goal.goalType}
                      </span>
                    </div>
                    {goal.description && <p className="text-sm text-slate-600">{goal.description}</p>}
                  </div>
                </div>

                {goal.goalType === "Quantitative" && (
                  <div className="space-y-3">
                    <div className="flex items-end gap-3">
                      <div className="flex-1">
                        <Label className="text-xs font-bold text-slate-700 block mb-2">Completed</Label>
                        <Input
                          type="number"
                          value={
                            goalProgress.find((g) => g.id === goal.id)?.current ??
                            goalProgress.find((g) => g.id === goal.id)?.current ??
                            0
                          }
                          onChange={(e) => handleGoalUpdate(goal.id, "current", parseInt(e.target.value))}
                          className="text-2xl font-bold text-center"
                          min="0"
                        />
                      </div>
                      <div className="text-slate-600 font-bold text-lg">/ {goal.target}</div>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all"
                        style={{ width: `${Math.min(((goalProgress.find((g) => g.id === goal.id)?.current ?? 0) / (goal.target ?? 1)) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                )}

                {goal.goalType === "Qualitative" && (
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-700">How went it today?</Label>
                    <Textarea
                      value={goalProgress.find((g) => g.id === goal.id)?.notes ?? ""}
                      onChange={(e) => handleGoalUpdate(goal.id, "notes", e.target.value)}
                      placeholder="Describe what you observed or accomplished..."
                      className="resize-none min-h-[80px] text-base"
                    />
                  </div>
                )}

                {goal.goalType === "Learning" && (
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-700">Progress on this learning goal?</Label>
                    <Textarea
                      value={goalProgress.find((g) => g.id === goal.id)?.notes ?? ""}
                      onChange={(e) => handleGoalUpdate(goal.id, "notes", e.target.value)}
                      placeholder="What did you learn today? What did you complete?"
                      className="resize-none min-h-[80px] text-base"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          <Button onClick={() => setStep("wins")} className="w-full bg-slate-900 hover:bg-slate-800" size="lg">
            Continue
          </Button>
        </div>
      )}

      {/* STEP 2: Wins */}
      {step === "wins" && (
        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-slate-900">What Went Well?</h3>
            <p className="text-slate-600">Highlight wins, successes, or breakthroughs today.</p>
          </div>

          <div className="space-y-3">
            {wins.map((win, index) => (
              <div key={index} className="flex gap-3">
                <div className="flex-1">
                  <Textarea
                    value={win}
                    onChange={(e) => handleWinChange(index, e.target.value)}
                    placeholder="e.g., Closed a deal, fixed a critical bug, great team collaboration..."
                    className="resize-none min-h-[60px] text-base"
                  />
                </div>
                {wins.length > 1 && (
                  <Button
                    onClick={() => handleRemoveWin(index)}
                    variant="ghost"
                    size="sm"
                    className="self-start text-red-600 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          <Button
            onClick={handleAddWin}
            variant="outline"
            className="w-full border-slate-300 text-slate-700 hover:bg-slate-50"
            size="sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Another Win
          </Button>

          <div className="flex gap-3">
            <Button onClick={() => setStep("goals")} variant="outline" className="flex-1">
              Back
            </Button>
            <Button onClick={() => setStep("blockers")} className="flex-1 bg-slate-900 hover:bg-slate-800">
              Continue
            </Button>
          </div>
        </div>
      )}

      {/* STEP 3: Blockers */}
      {step === "blockers" && (
        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-slate-900">Blockers & Challenges</h3>
            <p className="text-slate-600">What slowed you down or needs attention?</p>
          </div>

          <div className="space-y-3">
            {blockers.map((blocker, index) => (
              <div key={index} className="flex gap-3">
                <div className="flex-1">
                  <Textarea
                    value={blocker}
                    onChange={(e) => handleBlockerChange(index, e.target.value)}
                    placeholder="e.g., Waiting for design feedback, server downtime, unclear requirements..."
                    className="resize-none min-h-[60px] text-base"
                  />
                </div>
                {blockers.length > 1 && (
                  <Button
                    onClick={() => handleRemoveBlocker(index)}
                    variant="ghost"
                    size="sm"
                    className="self-start text-red-600 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          <Button
            onClick={handleAddBlocker}
            variant="outline"
            className="w-full border-slate-300 text-slate-700 hover:bg-slate-50"
            size="sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Another Blocker
          </Button>

          <div className="flex gap-3">
            <Button onClick={() => setStep("wins")} variant="outline" className="flex-1">
              Back
            </Button>
            <Button onClick={() => setStep("tomorrow")} className="flex-1 bg-slate-900 hover:bg-slate-800">
              Continue
            </Button>
          </div>
        </div>
      )}

      {/* STEP 4: Tomorrow */}
      {step === "tomorrow" && (
        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-slate-900">Tomorrow's Focus</h3>
            <p className="text-slate-600">What's your priority for tomorrow?</p>
          </div>

          <div className="space-y-3">
            {tomorrow.map((item, index) => (
              <div key={index} className="flex gap-3">
                <div className="flex-1">
                  <Textarea
                    value={item}
                    onChange={(e) => handleTomorrowChange(index, e.target.value)}
                    placeholder="e.g., Follow up on proposals, finish project review..."
                    className="resize-none min-h-[60px] text-base"
                  />
                </div>
                {tomorrow.length > 1 && (
                  <Button
                    onClick={() => handleRemoveTomorrow(index)}
                    variant="ghost"
                    size="sm"
                    className="self-start text-red-600 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          <Button
            onClick={handleAddTomorrow}
            variant="outline"
            className="w-full border-slate-300 text-slate-700 hover:bg-slate-50"
            size="sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Priority
          </Button>

          <div className="flex gap-3">
            <Button onClick={() => setStep("blockers")} variant="outline" className="flex-1">
              Back
            </Button>
            <Button onClick={handleSubmit} className="flex-1 bg-green-600 hover:bg-green-700">
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Submit Report
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
