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
import { ArrowLeft, Flame, Users, CheckCircle2 } from "lucide-react"
import { COMPANY_MISSION } from "@/lib/mission-context"

interface DailyReportFormState {
  powerMovesDone: Record<string, number>
  victoryTargetAlignment: boolean
  alignmentNote: string
  wins: string
  blocker: string
  blockerType: string
  tomorrowCommitment: string
  committedCheckbox: boolean
}

export default function DailyReportPage() {
  const router = useRouter()
  const today = new Date().toISOString().split("T")[0]

  const mockPowerMoves = [
    { id: "pm-1", name: "Client Discovery Calls", target: 5 },
    { id: "pm-2", name: "Proposal Follow-ups", target: 3 },
    { id: "pm-3", name: "Meeting Conversions", target: 2 },
  ]

  const mockTeamMembers = [
    { name: "Sarah Mitchell", hits: 5, streak: 23, role: "Marketing" },
    { name: "John Doe", hits: 5, streak: 15, role: "Sales" },
    { name: "You", hits: 0, streak: 0, role: "Your Department" },
  ]

  const [formState, setFormState] = useState<DailyReportFormState>({
    powerMovesDone: mockPowerMoves.reduce((acc, pm) => ({ ...acc, [pm.id]: 0 }), {}),
    victoryTargetAlignment: true,
    alignmentNote: "",
    wins: "",
    blocker: "",
    blockerType: "",
    tomorrowCommitment: "",
    committedCheckbox: false,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)

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
    setErrors((prev) => {
      const newErrors = { ...prev }
      delete newErrors[`done-${pmId}`]
      return newErrors
    })
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
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

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-orange-950 to-slate-950 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-green-400 bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="pt-8 text-center space-y-4">
            <div className="h-16 w-16 mx-auto bg-green-500 rounded-full flex items-center justify-center animate-pulse">
              <CheckCircle2 className="h-8 w-8 text-white" />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-black text-slate-900">Victory Logged</h2>
              <p className="text-slate-700 font-semibold">Your execution moved the mission forward</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-orange-950 to-slate-950">
      <header className="sticky top-0 z-50 bg-slate-900/95 border-b border-orange-500/30 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="text-orange-400 hover:text-orange-300">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Dashboard
          </Button>
          <h1 className="text-xl font-black text-orange-500">VICTORY PULSE</h1>
          <Button
            onClick={handleSubmit}
            disabled={!formState.committedCheckbox}
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold disabled:opacity-50"
            size="sm"
          >
            Submit Report
          </Button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* MISSION TRINITY */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-orange-500/50 bg-gradient-to-br from-orange-950 to-slate-900 text-white">
            <CardContent className="pt-6 text-center space-y-2">
              <p className="text-xs font-bold uppercase tracking-widest text-orange-300">Today's Battle</p>
              <p className="text-3xl font-black">Power Moves</p>
              <p className="text-xs text-slate-400">Your daily execution</p>
            </CardContent>
          </Card>
          <Card className="border-blue-500/50 bg-gradient-to-br from-blue-950 to-slate-900 text-white hidden md:block">
            <CardContent className="pt-6 text-center space-y-2">
              <p className="text-xs font-bold uppercase tracking-widest text-blue-300">Mission</p>
              <p className="text-3xl font-black">35 Clients</p>
              <p className="text-sm text-blue-300">28/35 onboarded</p>
            </CardContent>
          </Card>
          <Card className="border-green-500/50 bg-gradient-to-br from-green-950 to-slate-900 text-white">
            <CardContent className="pt-6 text-center space-y-2">
              <p className="text-xs font-bold uppercase tracking-widest text-green-300">Your Reward</p>
              <p className="text-3xl font-black">35% Hike</p>
              <p className="text-xs text-slate-400">When we win together</p>
            </CardContent>
          </Card>
        </div>

        {/* MAIN CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT: POWER MOVES + WINS */}
          <div className="lg:col-span-2 space-y-6">
            {/* WARRIOR STATS */}
            <Card className="border-orange-500/50 bg-gradient-to-br from-slate-900 to-slate-950 text-white">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <Flame className="h-5 w-5 text-orange-500" />
                  <CardTitle className="text-orange-500">Today's Warrior Stats</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {mockPowerMoves.map((pm) => {
                    const done = formState.powerMovesDone[pm.id] || 0
                    const isHit = done >= pm.target

                    return (
                      <div key={pm.id} className="space-y-2">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex-1">
                            <Badge variant="outline" className="bg-slate-800 border-orange-500/50 text-orange-300">
                              {pm.name}
                            </Badge>
                            <p className="text-xs text-slate-400 mt-1">Target: {pm.target}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <Input
                              type="number"
                              min="0"
                              value={done}
                              onChange={(e) => handlePowerMoveDone(pm.id, e.target.value)}
                              className="w-20 text-center bg-slate-800 border-slate-700 text-white font-bold"
                              placeholder="0"
                            />
                            <Badge className={`whitespace-nowrap ${isHit ? "bg-green-600 text-white" : "bg-red-600/50 text-red-200"}`}>
                              {isHit ? "✓ HIT" : "BEHIND"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    )
                  })}

                  <Separator className="bg-slate-700" />

                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">Overall Score</span>
                      <span className="text-2xl font-black text-orange-500">
                        {powerMovesHit}/{mockPowerMoves.length}
                      </span>
                    </div>
                    <Progress value={powerMovesPercentage} className="h-2" />
                    <p className="text-xs text-slate-400">Green days compound into legendary streaks</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* WINS SECTION */}
            <Card className="border-green-500/50 bg-gradient-to-br from-slate-900 to-slate-950 text-white">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <CardTitle className="text-green-500">What You Crushed Today</CardTitle>
                </div>
                <CardDescription className="text-slate-400">Tell your story. What wins matter?</CardDescription>
              </CardHeader>
              <CardContent>
                <textarea
                  placeholder="e.g., Closed $50K deal • 10 discovery calls (5 converted!) • Helped team with blocker"
                  value={formState.wins}
                  onChange={(e) => setFormState((prev) => ({ ...prev, wins: e.target.value }))}
                  maxLength={200}
                  className="w-full p-3 bg-slate-800 border border-slate-700 text-white rounded-lg text-sm placeholder-slate-500 focus:outline-none focus:border-green-500 resize-none"
                  rows={3}
                />
                <p className="text-xs text-slate-400 mt-2">{formState.wins.length}/200</p>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT: QUICK INPUTS */}
          <div className="space-y-6">
            {/* VICTORY TARGET ALIGNMENT */}
            <Card className="border-blue-500/50 bg-gradient-to-br from-slate-900 to-slate-950 text-white">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-blue-400">Victory Target Aligned?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Switch
                    checked={formState.victoryTargetAlignment}
                    onCheckedChange={(checked) =>
                      setFormState((prev) => ({ ...prev, victoryTargetAlignment: checked }))
                    }
                  />
                  <span className="text-sm font-bold">{formState.victoryTargetAlignment ? "Yes" : "No"}</span>
                </div>
                {!formState.victoryTargetAlignment && (
                  <Input
                    placeholder="What changed?"
                    maxLength={20}
                    value={formState.alignmentNote}
                    onChange={(e) => setFormState((prev) => ({ ...prev, alignmentNote: e.target.value }))}
                    className="text-sm bg-slate-800 border-slate-700 text-white placeholder-slate-500"
                  />
                )}
              </CardContent>
            </Card>

            {/* BLOCKERS */}
            <Card className="border-red-500/50 bg-gradient-to-br from-slate-900 to-slate-950 text-white">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-red-400">What Blocked You?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Input
                  placeholder="What stopped progress?"
                  value={formState.blocker}
                  onChange={(e) => setFormState((prev) => ({ ...prev, blocker: e.target.value }))}
                  className="text-sm bg-slate-800 border-slate-700 text-white placeholder-slate-500"
                />
                <Select value={formState.blockerType} onValueChange={(value) =>
                  setFormState((prev) => ({ ...prev, blockerType: value }))
                }>
                  <SelectTrigger className="text-sm bg-slate-800 border-slate-700 text-white">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="client" className="text-white">Client</SelectItem>
                    <SelectItem value="team" className="text-white">Team</SelectItem>
                    <SelectItem value="tech" className="text-white">Tech</SelectItem>
                    <SelectItem value="other" className="text-white">Other</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* TOMORROW COMMITMENT */}
            <Card className="border-purple-500/50 bg-gradient-to-br from-slate-900 to-slate-950 text-white">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-purple-400">Tomorrow's Commitment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Tomorrow I will..."
                  maxLength={80}
                  value={formState.tomorrowCommitment}
                  onChange={(e) => setFormState((prev) => ({ ...prev, tomorrowCommitment: e.target.value }))}
                  className="text-sm bg-slate-800 border-slate-700 text-white placeholder-slate-500"
                />
                <div className="flex items-center gap-2 p-3 bg-slate-800 rounded-lg border border-slate-700">
                  <Checkbox
                    id="commit"
                    checked={formState.committedCheckbox}
                    onCheckedChange={(checked) =>
                      setFormState((prev) => ({ ...prev, committedCheckbox: checked === true }))
                    }
                    className="border-purple-500"
                  />
                  <label htmlFor="commit" className="text-sm font-bold cursor-pointer">
                    I commit
                  </label>
                </div>
                {errors["committed"] && <p className="text-xs text-red-400">{errors["committed"]}</p>}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* TEAM MOMENTUM */}
        <Card className="border-yellow-500/50 bg-gradient-to-br from-slate-900 to-slate-950 text-white">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-yellow-500" />
              <CardTitle className="text-yellow-500">Team Momentum Today</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockTeamMembers.map((member, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 bg-slate-800/50 rounded-lg">
                  <div>
                    <p className="text-sm font-bold">{member.name}</p>
                    <p className="text-xs text-slate-400">{member.role}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-lg font-black text-orange-500">{member.hits}</p>
                      <p className="text-xs text-slate-400">hits</p>
                    </div>
                    {member.streak > 0 && (
                      <div className="text-right">
                        <p className="text-lg font-black text-green-500">{member.streak}</p>
                        <p className="text-xs text-slate-400">streak</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* MISSION PUSH */}
        <Card className="border-green-500/50 bg-gradient-to-br from-green-950/50 to-slate-950 text-white">
          <CardContent className="pt-6">
            <div className="text-center space-y-3">
              <p className="text-sm font-bold uppercase text-green-400">Mission 35 Status</p>
              <p className="text-4xl font-black text-green-500">28/35</p>
              <p className="text-sm text-slate-300">7 clients away from your 35% salary hike</p>
              <p className="text-xs text-slate-400 pt-2">If everyone hits today → We reach 35 in 3 days</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
