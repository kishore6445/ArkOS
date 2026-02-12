"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, CheckCircle2 } from "lucide-react"

interface DailyReportFormState {
  powerMovesDone: string
  learningAchieved: string
  missionWin: string
  blocker: string
  tomorrowCommitment: string
  committedCheckbox: boolean
}

export default function DailyReportPage() {
  const router = useRouter()
  const today = new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })

  const [formState, setFormState] = useState<DailyReportFormState>({
    powerMovesDone: "",
    learningAchieved: "",
    missionWin: "",
    blocker: "",
    tomorrowCommitment: "",
    committedCheckbox: false,
  })

  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    if (!formState.committedCheckbox) return

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
              <p className="text-slate-700 font-semibold">Mission 35 moves forward</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-orange-950 to-slate-950">
      {/* STICKY HEADER */}
      <header className="sticky top-0 z-50 bg-slate-900/95 border-b border-orange-500/30 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="text-orange-400 hover:text-orange-300">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-lg font-black text-orange-500">Daily Report</h1>
          <div className="text-sm text-slate-400">{today}</div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* TODAY SECTION */}
        <div className="space-y-4">
          <h2 className="text-2xl font-black text-white">TODAY</h2>

          {/* Power Moves Done */}
          <Card className="border-orange-500/50 bg-gradient-to-br from-slate-900 to-slate-950 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-orange-400">Power Moves Done</CardTitle>
              <p className="text-xs text-slate-400 mt-1">What moved revenue / systems / brand?</p>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="e.g., 5 client discovery calls • 2 proposals sent • Closed $50K deal"
                value={formState.powerMovesDone}
                onChange={(e) => setFormState((prev) => ({ ...prev, powerMovesDone: e.target.value }))}
                maxLength={200}
                className="bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-orange-500 resize-none"
                rows={2}
              />
              <p className="text-xs text-slate-400 mt-2">{formState.powerMovesDone.length}/200</p>
            </CardContent>
          </Card>

          {/* Learning Achieved */}
          <Card className="border-blue-500/50 bg-gradient-to-br from-slate-900 to-slate-950 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-blue-400">Learning Achieved</CardTitle>
              <p className="text-xs text-slate-400 mt-1">What sharpened your capability?</p>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="e.g., Discovered shorter calls convert better • Learned new sales technique • Improved communication with clients"
                value={formState.learningAchieved}
                onChange={(e) => setFormState((prev) => ({ ...prev, learningAchieved: e.target.value }))}
                maxLength={200}
                className="bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-blue-500 resize-none"
                rows={2}
              />
              <p className="text-xs text-slate-400 mt-2">{formState.learningAchieved.length}/200</p>
            </CardContent>
          </Card>

          {/* Win for Mission 35 */}
          <Card className="border-green-500/50 bg-gradient-to-br from-slate-900 to-slate-950 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-green-400">Win for Mission 35</CardTitle>
              <p className="text-xs text-slate-400 mt-1">How did today move us closer to 35 clients?</p>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="e.g., 1 new client onboarded • 2 qualified leads in pipeline • Contract signed"
                value={formState.missionWin}
                onChange={(e) => setFormState((prev) => ({ ...prev, missionWin: e.target.value }))}
                maxLength={150}
                className="bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-green-500 resize-none"
                rows={2}
              />
              <p className="text-xs text-slate-400 mt-2">{formState.missionWin.length}/150</p>
            </CardContent>
          </Card>
        </div>

        {/* BLOCKER SECTION */}
        <div className="space-y-4">
          <h2 className="text-2xl font-black text-white">BLOCKER</h2>

          <Card className="border-red-500/50 bg-gradient-to-br from-slate-900 to-slate-950 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-red-400">What Slowed Execution?</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="e.g., Waiting on legal approval • Client delayed decision • System outage"
                value={formState.blocker}
                onChange={(e) => setFormState((prev) => ({ ...prev, blocker: e.target.value }))}
                maxLength={150}
                className="bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-red-500 resize-none"
                rows={2}
              />
              <p className="text-xs text-slate-400 mt-2">{formState.blocker.length}/150</p>
            </CardContent>
          </Card>
        </div>

        {/* TOMORROW SECTION */}
        <div className="space-y-4">
          <h2 className="text-2xl font-black text-white">TOMORROW</h2>

          <Card className="border-purple-500/50 bg-gradient-to-br from-slate-900 to-slate-950 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-purple-400">I Commit To</CardTitle>
              <p className="text-xs text-slate-400 mt-1">1–3 measurable power moves only</p>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="e.g., 5 discovery calls • 3 proposal follow-ups • Close 1 deal"
                value={formState.tomorrowCommitment}
                onChange={(e) => setFormState((prev) => ({ ...prev, tomorrowCommitment: e.target.value }))}
                maxLength={150}
                className="bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-purple-500 resize-none"
                rows={2}
              />
              <p className="text-xs text-slate-400 mt-2">{formState.tomorrowCommitment.length}/150</p>
            </CardContent>
          </Card>

          {/* Commit Checkbox */}
          <div className="flex items-center gap-3 p-4 bg-slate-800 border border-slate-700 rounded-lg">
            <Checkbox
              id="commit"
              checked={formState.committedCheckbox}
              onCheckedChange={(checked) =>
                setFormState((prev) => ({ ...prev, committedCheckbox: checked === true }))
              }
              className="border-purple-500"
            />
            <label htmlFor="commit" className="text-sm font-bold cursor-pointer text-white">
              I commit to these power moves
            </label>
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="flex gap-3">
          <Button
            onClick={() => router.back()}
            variant="outline"
            className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-800"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!formState.committedCheckbox}
            className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold disabled:opacity-50"
          >
            Submit Report
          </Button>
        </div>
      </div>
    </main>
  )
}
