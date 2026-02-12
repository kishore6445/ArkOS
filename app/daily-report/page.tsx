"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, ChevronRight, AlertCircle } from "lucide-react"
import { COMPANY_MISSION } from "@/lib/mission-context"

interface PowerMove {
  id: string
  name: string
  target: number
}

interface DailyReportFormState {
  powerMovesDone: Record<string, number>
  victoryTargetAlignment: boolean
  alignmentNote: string
  blocker: string
  blockerType: string
  tomorrowCommitment: string
  committedCheckbox: boolean
}

export default function DailyReportPage() {
  const router = useRouter()
  const today = new Date().toISOString().split("T")[0]

  // Mock power moves - in production, fetch from user's actual power moves
  const mockPowerMoves: PowerMove[] = [
    { id: "pm-1", name: "Client Discovery Calls", target: 5 },
    { id: "pm-2", name: "Proposal Follow-ups", target: 3 },
    { id: "pm-3", name: "Meeting Conversions", target: 2 },
  ]

  const [formState, setFormState] = useState<DailyReportFormState>({
    powerMovesDone: mockPowerMoves.reduce((acc, pm) => ({ ...acc, [pm.id]: 0 }), {}),
    victoryTargetAlignment: true,
    alignmentNote: "",
    blocker: "",
    blockerType: "",
    tomorrowCommitment: "",
    committedCheckbox: false,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)

  // Calculate power moves score
  const powerMovesHit = mockPowerMoves.filter((pm) => {
    const done = formState.powerMovesDone[pm.id] || 0
    return done >= pm.target
  }).length

  const powerMovesPercentage = mockPowerMoves.length > 0 ? Math.round((powerMovesHit / mockPowerMoves.length) * 100) : 0

  const handlePowerMoveDone = (pmId: string, value: string) => {
    const numValue = parseInt(value) || 0
    if (numValue < 0) return

    setFormState((prev) => ({
      ...prev,
      powerMovesDone: { ...prev.powerMovesDone, [pmId]: numValue },
    }))

    // Clear error for this field
    setErrors((prev) => {
      const newErrors = { ...prev }
      delete newErrors[`done-${pmId}`]
      return newErrors
    })
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Check if all done values are numeric
    mockPowerMoves.forEach((pm) => {
      const value = formState.powerMovesDone[pm.id]
      if (typeof value !== "number" || isNaN(value)) {
        newErrors[`done-${pm.id}`] = "Must be a number"
      }
    })

    // Check if committed
    if (!formState.committedCheckbox) {
      newErrors["committed"] = "You must commit to continue"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (!validateForm()) return

    console.log("[v0] Daily report submitted:", formState)
    setSubmitted(true)

    setTimeout(() => {
      router.push("/dashboard")
    }, 2000)
  }

  const isFormValid = mockPowerMoves.length > 0 && formState.committedCheckbox && Object.keys(errors).length === 0

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-green-200 bg-green-50">
          <CardContent className="pt-8 text-center space-y-4">
            <div className="h-16 w-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-3xl">✓</span>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-slate-900">Daily Report Submitted</h2>
              <p className="text-slate-600">Warrior mode logged. Redirecting...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* STICKY HEADER */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.back()} className="text-slate-600">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
          </div>
          <h1 className="text-2xl font-black text-slate-900">Daily Report</h1>
          <div className="flex items-center gap-3">
            <input
              type="date"
              value={today}
              disabled
              className="px-3 py-1 text-sm border border-slate-300 rounded-lg bg-slate-50 text-slate-600"
            />
            <Button
              onClick={handleSubmit}
              disabled={!isFormValid}
              className="bg-orange-600 hover:bg-orange-700 text-white disabled:opacity-50"
              size="sm"
            >
              Submit
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* EXECUTION CHAIN */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-slate-200 bg-white">
            <CardContent className="pt-6">
              <div className="space-y-2 text-center">
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Today's Focus</p>
                <p className="text-2xl font-black text-slate-900">Power Moves</p>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-center text-slate-400 md:block hidden">
            <ChevronRight className="h-6 w-6" />
          </div>

          <Card className="border-slate-200 bg-white">
            <CardContent className="pt-6">
              <div className="space-y-2 text-center">
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Department Target</p>
                <p className="text-lg font-bold text-slate-900">Warrior Systems</p>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-center text-slate-400 md:block hidden">
            <ChevronRight className="h-6 w-6" />
          </div>

          <Card className="border-orange-200 bg-orange-50 md:col-span-1 col-span-1 md:col-start-3">
            <CardContent className="pt-6">
              <div className="space-y-2 text-center">
                <p className="text-sm font-semibold text-orange-600 uppercase tracking-wide">War Goal</p>
                <p className="text-xl font-black text-orange-900">Onboard 35 Clients</p>
                <p className="text-xs text-orange-700 mt-2">28 / 35</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* MAIN CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT COLUMN - Power Moves Scoreboard */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-slate-200 bg-white">
              <CardHeader className="flex items-start justify-between pb-4">
                <div>
                  <CardTitle>Today's Power Moves</CardTitle>
                  <CardDescription>Targets are set in your Power Moves page.</CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push("/dashboard")}
                  className="text-xs text-slate-500 hover:text-slate-700"
                >
                  Edit Power Moves
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                {mockPowerMoves.length === 0 ? (
                  <div className="text-center py-12 space-y-4">
                    <AlertCircle className="h-12 w-12 text-slate-400 mx-auto" />
                    <div>
                      <p className="font-semibold text-slate-900 mb-2">No Power Moves set yet.</p>
                      <p className="text-sm text-slate-600 mb-4">
                        Set your 3–5 Power Moves first to start daily execution.
                      </p>
                    </div>
                    <Button onClick={() => router.push("/dashboard")} className="bg-orange-600 hover:bg-orange-700">
                      Set My Power Moves
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {mockPowerMoves.map((pm) => {
                      const done = formState.powerMovesDone[pm.id] || 0
                      const isHit = done >= pm.target
                      const hasError = errors[`done-${pm.id}`]

                      return (
                        <div key={pm.id} className="space-y-2">
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex-1">
                              <Badge variant="outline" className="text-slate-700">
                                {pm.name}
                              </Badge>
                              <p className="text-xs text-slate-500 mt-1">Target: {pm.target}</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <Input
                                type="number"
                                min="0"
                                value={done}
                                onChange={(e) => handlePowerMoveDone(pm.id, e.target.value)}
                                className={`w-20 text-center ${hasError ? "border-red-500" : ""}`}
                                placeholder="0"
                              />
                              <Badge
                                className={`whitespace-nowrap ${isHit ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                              >
                                {isHit ? "✓ Hit" : "Behind"}
                              </Badge>
                            </div>
                          </div>
                          {hasError && <p className="text-xs text-red-600">{hasError}</p>}
                        </div>
                      )
                    })}

                    <Separator className="my-4" />

                    {/* Overall Score */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-900">Overall Score</span>
                        <span className="text-sm font-bold text-orange-600">
                          {powerMovesHit} / {mockPowerMoves.length}
                        </span>
                      </div>
                      <Progress value={powerMovesPercentage} className="h-2" />
                      <p className="text-xs text-slate-500 mt-2">Green days compound.</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* RIGHT COLUMN - Right Side Cards */}
          <div className="space-y-6">
            {/* Victory Target Alignment */}
            <Card className="border-slate-200 bg-white">
              <CardHeader>
                <CardTitle className="text-base">Victory Target Alignment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm text-slate-600">Did today move your Victory Target forward?</p>
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={formState.victoryTargetAlignment}
                      onCheckedChange={(checked) =>
                        setFormState((prev) => ({ ...prev, victoryTargetAlignment: checked }))
                      }
                    />
                    <span className="text-sm font-semibold text-slate-700">
                      {formState.victoryTargetAlignment ? "Yes" : "No"}
                    </span>
                  </div>
                </div>

                {!formState.victoryTargetAlignment && (
                  <Input
                    placeholder="What changed?"
                    maxLength={20}
                    value={formState.alignmentNote}
                    onChange={(e) =>
                      setFormState((prev) => ({ ...prev, alignmentNote: e.target.value }))
                    }
                    className="text-sm"
                  />
                )}
              </CardContent>
            </Card>

            {/* Blockers */}
            <Card className="border-slate-200 bg-white">
              <CardHeader>
                <CardTitle className="text-base">Blockers</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Input
                  placeholder="What blocked you today?"
                  value={formState.blocker}
                  onChange={(e) =>
                    setFormState((prev) => ({ ...prev, blocker: e.target.value }))
                  }
                  className="text-sm"
                />
                <Select value={formState.blockerType} onValueChange={(value) =>
                  setFormState((prev) => ({ ...prev, blockerType: value }))
                }>
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder="Blocker type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="client">Client</SelectItem>
                    <SelectItem value="team">Team</SelectItem>
                    <SelectItem value="tech">Tech</SelectItem>
                    <SelectItem value="process">Process</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Tomorrow Commitment */}
            <Card className="border-slate-200 bg-white">
              <CardHeader>
                <CardTitle className="text-base">Tomorrow Commitment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Tomorrow I will…"
                  maxLength={100}
                  value={formState.tomorrowCommitment}
                  onChange={(e) =>
                    setFormState((prev) => ({ ...prev, tomorrowCommitment: e.target.value }))
                  }
                  className="text-sm"
                />
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="commit"
                    checked={formState.committedCheckbox}
                    onCheckedChange={(checked) =>
                      setFormState((prev) => ({ ...prev, committedCheckbox: checked === true }))
                    }
                  />
                  <label htmlFor="commit" className="text-sm font-semibold text-slate-700 cursor-pointer">
                    I commit
                  </label>
                </div>
                {errors["committed"] && <p className="text-xs text-red-600">{errors["committed"]}</p>}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* SUBMISSION PREVIEW */}
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="text-base text-orange-900">Submission Preview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-700">Power moves hit:</span>
              <span className="font-semibold text-orange-900">
                {powerMovesHit} / {mockPowerMoves.length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-700">Alignment:</span>
              <span className="font-semibold text-orange-900">{formState.victoryTargetAlignment ? "Yes" : "No"}</span>
            </div>
            {formState.blocker && (
              <div className="flex justify-between">
                <span className="text-slate-700">Blocker:</span>
                <span className="font-semibold text-orange-900 text-right">{formState.blocker}</span>
              </div>
            )}
            {formState.tomorrowCommitment && (
              <div className="flex justify-between">
                <span className="text-slate-700">Tomorrow:</span>
                <span className="font-semibold text-orange-900 text-right">{formState.tomorrowCommitment}</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
