"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, CheckCircle2, User } from "lucide-react"

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

  // Mock user data - in production, fetch from auth context
  const user = {
    name: "Sarah Mitchell",
    role: "Sales",
    department: "Warrior Systems",
    image: null, // Placeholder for user photo
  }

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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-green-200 bg-green-50">
          <CardContent className="pt-8 text-center space-y-4">
            <div className="h-16 w-16 mx-auto bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8 text-white" />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-black text-slate-900">Victory Logged</h2>
              <p className="text-slate-600 font-semibold">Mission 35 moves forward</p>
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
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="text-slate-600 hover:text-slate-900">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-lg font-black text-slate-900">Daily Report</h1>
          <div className="text-sm text-slate-500">{today}</div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* USER IDENTITY SECTION */}
        <Card className="border-slate-200 bg-white">
          <CardContent className="pt-6">
            <div className="flex items-center gap-6">
              {/* Photo Placeholder */}
              <div className="flex-shrink-0">
                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center border-2 border-orange-300 flex-shrink-0">
                  {user.image ? (
                    <img src={user.image} alt={user.name} className="h-20 w-20 rounded-full object-cover" />
                  ) : (
                    <User className="h-10 w-10 text-orange-600" />
                  )}
                </div>
              </div>

              {/* User Info */}
              <div className="flex-1">
                <h2 className="text-2xl font-black text-slate-900">{user.name}</h2>
                <p className="text-sm text-slate-600 mt-1">{user.role} • {user.department}</p>
                <p className="text-xs text-slate-500 mt-2">Own your execution. Show your impact.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* TODAY SECTION */}
        <div className="space-y-4">
          <h2 className="text-2xl font-black text-slate-900">TODAY</h2>

          {/* Power Moves Done */}
          <Card className="border-orange-200 bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-slate-900">Power Moves Done</CardTitle>
              <p className="text-xs text-slate-500 mt-1">What moved revenue / systems / brand?</p>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="e.g., 5 client discovery calls • 2 proposals sent • Closed $50K deal"
                value={formState.powerMovesDone}
                onChange={(e) => setFormState((prev) => ({ ...prev, powerMovesDone: e.target.value }))}
                maxLength={200}
                className="border-slate-300 text-slate-900 placeholder-slate-400 focus:border-orange-500 resize-none"
                rows={2}
              />
              <p className="text-xs text-slate-500 mt-2">{formState.powerMovesDone.length}/200</p>
            </CardContent>
          </Card>

          {/* Learning Achieved */}
          <Card className="border-blue-200 bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-slate-900">Learning Achieved</CardTitle>
              <p className="text-xs text-slate-500 mt-1">What sharpened your capability?</p>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="e.g., Discovered shorter calls convert better • Learned new sales technique • Improved communication with clients"
                value={formState.learningAchieved}
                onChange={(e) => setFormState((prev) => ({ ...prev, learningAchieved: e.target.value }))}
                maxLength={200}
                className="border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-500 resize-none"
                rows={2}
              />
              <p className="text-xs text-slate-500 mt-2">{formState.learningAchieved.length}/200</p>
            </CardContent>
          </Card>

          {/* Win for Mission 35 */}
          <Card className="border-green-200 bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-slate-900">Win for Mission 35</CardTitle>
              <p className="text-xs text-slate-500 mt-1">How did today move us closer to 35 clients?</p>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="e.g., 1 new client onboarded • 2 qualified leads in pipeline • Contract signed"
                value={formState.missionWin}
                onChange={(e) => setFormState((prev) => ({ ...prev, missionWin: e.target.value }))}
                maxLength={150}
                className="border-slate-300 text-slate-900 placeholder-slate-400 focus:border-green-500 resize-none"
                rows={2}
              />
              <p className="text-xs text-slate-500 mt-2">{formState.missionWin.length}/150</p>
            </CardContent>
          </Card>
        </div>

        {/* BLOCKER SECTION */}
        <div className="space-y-4">
          <h2 className="text-2xl font-black text-slate-900">BLOCKER</h2>

          <Card className="border-red-200 bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-slate-900">What Slowed Execution?</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="e.g., Waiting on legal approval • Client delayed decision • System outage"
                value={formState.blocker}
                onChange={(e) => setFormState((prev) => ({ ...prev, blocker: e.target.value }))}
                maxLength={150}
                className="border-slate-300 text-slate-900 placeholder-slate-400 focus:border-red-500 resize-none"
                rows={2}
              />
              <p className="text-xs text-slate-500 mt-2">{formState.blocker.length}/150</p>
            </CardContent>
          </Card>
        </div>

        {/* TOMORROW SECTION */}
        <div className="space-y-4">
          <h2 className="text-2xl font-black text-slate-900">TOMORROW</h2>

          <Card className="border-purple-200 bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-slate-900">I Commit To</CardTitle>
              <p className="text-xs text-slate-500 mt-1">1–3 measurable power moves only</p>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="e.g., 5 discovery calls • 3 proposal follow-ups • Close 1 deal"
                value={formState.tomorrowCommitment}
                onChange={(e) => setFormState((prev) => ({ ...prev, tomorrowCommitment: e.target.value }))}
                maxLength={150}
                className="border-slate-300 text-slate-900 placeholder-slate-400 focus:border-purple-500 resize-none"
                rows={2}
              />
              <p className="text-xs text-slate-500 mt-2">{formState.tomorrowCommitment.length}/150</p>
            </CardContent>
          </Card>

          {/* Commit Checkbox */}
          <div className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-200 rounded-lg">
            <Checkbox
              id="commit"
              checked={formState.committedCheckbox}
              onCheckedChange={(checked) =>
                setFormState((prev) => ({ ...prev, committedCheckbox: checked === true }))
              }
            />
            <label htmlFor="commit" className="text-sm font-bold cursor-pointer text-slate-900">
              I commit to these power moves
            </label>
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="flex gap-3">
          <Button
            onClick={() => router.back()}
            variant="outline"
            className="flex-1 border-slate-300 text-slate-700 hover:bg-slate-100"
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
