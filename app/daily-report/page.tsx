"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, CheckCircle2, User } from "lucide-react"
import { useUser } from "@/lib/user-context"

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
  const { currentUser, isLoading: isUserLoading } = useUser()
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

  // Get user's department from first assignment (they can have multiple)
  const userDepartment = currentUser?.assignments?.[0]?.department || "Team"
  const userBrand = currentUser?.assignments?.[0]?.brand || "Warrior Systems"

  const handleSubmit = () => {
    if (!formState.committedCheckbox) return

    const reportData = {
      userId: currentUser?.id,
      userName: currentUser?.name,
      email: currentUser?.email,
      department: userDepartment,
      brand: userBrand,
      date: today,
      ...formState,
    }

    console.log("[v0] Daily report submitted:", reportData)
    setSubmitted(true)

    setTimeout(() => {
      router.push("/dashboard")
    }, 2000)
  }

  if (isUserLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-orange-300 border-t-orange-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading your daily report...</p>
        </div>
      </div>
    )
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-red-200 bg-red-50">
          <CardContent className="pt-8 text-center space-y-4">
            <p className="text-red-800 font-semibold">Unable to load your profile</p>
            <Button onClick={() => router.back()}>Go Back</Button>
          </CardContent>
        </Card>
      </div>
    )
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
    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      {/* STICKY HEADER */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-orange-100 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="text-orange-600 hover:text-orange-700 hover:bg-orange-50">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="text-center">
            <h1 className="text-lg font-black text-slate-900">Daily Report</h1>
            <p className="text-xs text-orange-600 font-semibold">{today}</p>
          </div>
          <div className="w-12"></div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* USER IDENTITY SECTION - Personal Ownership */}
        <Card className="border-2 border-orange-200 bg-gradient-to-br from-white via-orange-50 to-white shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center gap-6">
              {/* Photo Placeholder - Visual Identity */}
              <div className="flex-shrink-0">
                <div className="h-24 w-24 rounded-full bg-gradient-to-br from-orange-400 via-orange-300 to-amber-400 flex items-center justify-center border-3 border-white shadow-lg flex-shrink-0">
                  {currentUser.avatar ? (
                    <img src={currentUser.avatar} alt={currentUser.name} className="h-24 w-24 rounded-full object-cover" />
                  ) : (
                    <User className="h-12 w-12 text-white" />
                  )}
                </div>
              </div>

              {/* User Info */}
              <div className="flex-1">
                <h2 className="text-3xl font-black text-slate-900">{currentUser.name}</h2>
                <p className="text-orange-600 font-bold text-sm mt-1">
                  {userDepartment.charAt(0).toUpperCase() + userDepartment.slice(1)} • {userBrand === "warrior-systems" ? "Warrior Systems" : userBrand === "story-marketing" ? "Story Marketing" : "Meta Gurukul"}
                </p>
                <p className="text-sm text-slate-600 mt-2 font-semibold">Own your execution. Show your impact.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FORM SECTIONS */}
        <div className="space-y-5">
          {/* TODAY - Power Moves Done */}
          <Card className="border-2 border-orange-200 bg-gradient-to-br from-white to-orange-50 hover:border-orange-300 hover:shadow-md transition-all">
            <CardHeader className="pb-3 bg-gradient-to-r from-orange-100/80 to-transparent border-b border-orange-200">
              <CardTitle className="text-lg text-orange-900">TODAY: Power Moves Done</CardTitle>
              <p className="text-xs text-orange-700 font-semibold mt-1">What moved revenue / systems / brand?</p>
            </CardHeader>
            <CardContent className="pt-4">
              <Textarea
                placeholder="E.g., Closed 2 client contracts • Delivered system documentation • Launched social content"
                value={formState.powerMovesDone}
                onChange={(e) => setFormState((prev) => ({ ...prev, powerMovesDone: e.target.value }))}
                maxLength={300}
                className="resize-none text-sm border-orange-200 focus:ring-orange-400 focus:border-orange-400"
                rows={3}
              />
              <p className="text-xs text-orange-600 font-semibold mt-2">{formState.powerMovesDone.length}/300</p>
            </CardContent>
          </Card>

          {/* Learning Achieved */}
          <Card className="border-2 border-blue-200 bg-gradient-to-br from-white to-blue-50 hover:border-blue-300 hover:shadow-md transition-all">
            <CardHeader className="pb-3 bg-gradient-to-r from-blue-100/80 to-transparent border-b border-blue-200">
              <CardTitle className="text-lg text-blue-900">Learning Achieved</CardTitle>
              <p className="text-xs text-blue-700 font-semibold mt-1">What sharpened your capability?</p>
            </CardHeader>
            <CardContent className="pt-4">
              <Textarea
                placeholder="E.g., Discovered X approach converts 40% better • Learned Y from client feedback • Mastered Z tool"
                value={formState.learningAchieved}
                onChange={(e) => setFormState((prev) => ({ ...prev, learningAchieved: e.target.value }))}
                maxLength={300}
                className="resize-none text-sm border-blue-200 focus:ring-blue-400 focus:border-blue-400"
                rows={3}
              />
              <p className="text-xs text-blue-600 font-semibold mt-2">{formState.learningAchieved.length}/300</p>
            </CardContent>
          </Card>

          {/* Win for Mission 35 */}
          <Card className="border-2 border-green-200 bg-gradient-to-br from-white to-green-50 hover:border-green-300 hover:shadow-md transition-all">
            <CardHeader className="pb-3 bg-gradient-to-r from-green-100/80 to-transparent border-b border-green-200">
              <CardTitle className="text-lg text-green-900">Win for Mission 35</CardTitle>
              <p className="text-xs text-green-700 font-semibold mt-1">How did today move us closer to 35 clients?</p>
            </CardHeader>
            <CardContent className="pt-4">
              <Textarea
                placeholder="E.g., Onboarded 1 new client • Advanced 2 prospects to sales stage • Resolved client concern"
                value={formState.missionWin}
                onChange={(e) => setFormState((prev) => ({ ...prev, missionWin: e.target.value }))}
                maxLength={300}
                className="resize-none text-sm border-green-200 focus:ring-green-400 focus:border-green-400"
                rows={3}
              />
              <p className="text-xs text-green-600 font-semibold mt-2">{formState.missionWin.length}/300</p>
            </CardContent>
          </Card>

          {/* BLOCKER */}
          <Card className="border-2 border-red-200 bg-gradient-to-br from-white to-red-50 hover:border-red-300 hover:shadow-md transition-all">
            <CardHeader className="pb-3 bg-gradient-to-r from-red-100/80 to-transparent border-b border-red-200">
              <CardTitle className="text-lg text-red-900">BLOCKER</CardTitle>
              <p className="text-xs text-red-700 font-semibold mt-1">What slowed execution?</p>
            </CardHeader>
            <CardContent className="pt-4">
              <Textarea
                placeholder="E.g., Waiting on legal approval • Client delayed decision • Technical issue with system"
                value={formState.blocker}
                onChange={(e) => setFormState((prev) => ({ ...prev, blocker: e.target.value }))}
                maxLength={200}
                className="resize-none text-sm border-red-200 focus:ring-red-400 focus:border-red-400"
                rows={2}
              />
              <p className="text-xs text-red-600 font-semibold mt-2">{formState.blocker.length}/200</p>
            </CardContent>
          </Card>

          {/* TOMORROW - Commitment */}
          <Card className="border-2 border-purple-200 bg-gradient-to-br from-white to-purple-50 hover:border-purple-300 hover:shadow-md transition-all">
            <CardHeader className="pb-3 bg-gradient-to-r from-purple-100/80 to-transparent border-b border-purple-200">
              <CardTitle className="text-lg text-purple-900">TOMORROW: I Commit To</CardTitle>
              <p className="text-xs text-purple-700 font-semibold mt-1">1–3 measurable power moves only</p>
            </CardHeader>
            <CardContent className="pt-4">
              <Textarea
                placeholder="E.g., 5 discovery calls • 3 proposal follow-ups • Deliver onboarding docs"
                value={formState.tomorrowCommitment}
                onChange={(e) => setFormState((prev) => ({ ...prev, tomorrowCommitment: e.target.value }))}
                maxLength={250}
                className="resize-none text-sm border-purple-200 focus:ring-purple-400 focus:border-purple-400"
                rows={2}
              />
              <p className="text-xs text-purple-600 font-semibold mt-2">{formState.tomorrowCommitment.length}/250</p>
            </CardContent>
          </Card>
        </div>

        {/* COMMITMENT CHECKBOX & SUBMIT */}
        <Card className="border-2 border-orange-300 bg-gradient-to-br from-orange-50 via-amber-50 to-orange-50 shadow-md">
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-start gap-3">
              <Checkbox
                id="commit"
                checked={formState.committedCheckbox}
                onCheckedChange={(checked) =>
                  setFormState((prev) => ({ ...prev, committedCheckbox: checked === true }))
                }
                className="border-orange-400 mt-1"
              />
              <label htmlFor="commit" className="text-sm font-bold text-slate-900 cursor-pointer">
                I own this report and commit to these power moves
              </label>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={!formState.committedCheckbox}
              className="w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-bold py-6 shadow-md disabled:opacity-50"
              size="lg"
            >
              Submit Daily Report
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
