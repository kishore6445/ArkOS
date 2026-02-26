'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { AlertCircle, Info, Plus, Trash2, Lock } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ClientEvent {
  id: string
  name: string
  brand: 'Warrior Systems' | 'Story Marketing'
  eventType: 'Added' | 'Dropped'
  month: string
}

interface QuarterlyOutcome {
  quarter: string
  plannedClients: number
  actualClients: number
  verdict: 'On Track' | 'At Risk' | 'Off Track'
  explanation: string
}

interface DepartmentHealth {
  department: string
  status: 'Stable' | 'At Risk' | 'Off Track'
  explanation: string
}

export function CompanyPerformanceAdmin() {
  const currentYear = new Date().getFullYear()
  const [missionTitle, setMissionTitle] = useState('Onboard 30 Clients')
  const [missionYear, setMissionYear] = useState(String(currentYear))
  const [totalTarget, setTotalTarget] = useState('30')
  const [currentActiveClients, setCurrentActiveClients] = useState('3')
  const [isSavingMission, setIsSavingMission] = useState(false)

  const [quarterlyTargets, setQuarterlyTargets] = useState([
    { quarter: 'Q1', plannedClients: 0, plannedRevenue: 0 },
    { quarter: 'Q2', plannedClients: 6, plannedRevenue: 210000 },
    { quarter: 'Q3', plannedClients: 12, plannedRevenue: 420000 },
    { quarter: 'Q4', plannedClients: 18, plannedRevenue: 630000 },
  ])

  const [selectedQuarter, setSelectedQuarter] = useState('Q1')
  const [quarterlyOutcome, setQuarterlyOutcome] = useState<QuarterlyOutcome>({
    quarter: 'Q1',
    plannedClients: 0,
    actualClients: 3,
    verdict: 'On Track',
    explanation: 'Q1 serves as baseline. Growth tracking begins Q2.'
  })

  const [departmentHealth, setDepartmentHealth] = useState<DepartmentHealth[]>([
    { department: 'Sales', status: 'At Risk', explanation: 'Follow-up discipline weak. Pipeline needs acceleration.' },
    { department: 'Marketing', status: 'At Risk', explanation: 'Lead flow inconsistent across weeks.' },
    { department: 'Delivery', status: 'Stable', explanation: 'Client retention strong. No escalations.' },
    { department: 'Operations', status: 'Stable', explanation: 'No bottlenecks. Systems running smoothly.' }
  ])

  const [constraintTitle, setConstraintTitle] = useState('Sales Conversion Discipline')
  const [constraintDesc, setConstraintDesc] = useState('Leads exist, but follow-up rhythm and closure consistency are breaking.')
  const [constraintSeverity, setConstraintSeverity] = useState('Critical')

  const [clientEvents, setClientEvents] = useState<ClientEvent[]>([
    { id: '1', name: 'Client A', brand: 'Warrior Systems', eventType: 'Added', month: 'Jan 2026' },
    { id: '2', name: 'Client B', brand: 'Story Marketing', eventType: 'Added', month: 'Feb 2026' },
    { id: '3', name: 'Client C', brand: 'Warrior Systems', eventType: 'Added', month: 'Mar 2026' }
  ])

  const [founderVerdict, setFounderVerdict] = useState('Q1 focus was fragmented. Core sales cadence weakened while experiments increased. We need discipline—not perfection—to hit Mission 30.')

  const [strategyTitle, setStrategyTitle] = useState('Freeze acquisition experiments')
  const [strategyDesc, setStrategyDesc] = useState('Reinforce sales cadence and follow-up rhythm.')
  const [strategyActions, setStrategyActions] = useState(['Pause new initiatives', 'Focus 100% on operational excellence', 'Weekly rhythm reviews'])

  const [reviewDate, setReviewDate] = useState('2026-03-31')
  const [reviewedBy, setReviewedBy] = useState('Founder')
  const [isLocked, setIsLocked] = useState(false)

  const verdictColors = {
    'On Track': 'border-green-500 bg-green-50',
    'At Risk': 'border-amber-500 bg-amber-50',
    'Off Track': 'border-red-500 bg-red-50'
  }

  const statusColors = {
    'Stable': 'bg-green-100 text-green-800',
    'At Risk': 'bg-amber-100 text-amber-800',
    'Off Track': 'bg-red-100 text-red-800'
  }

  const handleSaveMission = async () => {
    const totalTargetValue = Number(totalTarget)
    const currentTargetAchievedValue = Number(currentActiveClients)

    const missionYearValue = currentYear

    if (!missionTitle.trim() || Number.isNaN(totalTargetValue)) {
      alert('Please provide a mission title, year, and total target.')
      return
    }

    setIsSavingMission(true)
    try {
      const response = await fetch('/api/admin/mission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          missionTitle: missionTitle.trim(),
          missionYear: missionYearValue,
          totalTarget: totalTargetValue,
          currentTargetAchieved: Number.isNaN(currentTargetAchievedValue) ? 0 : currentTargetAchievedValue,
        }),
      })

      const result = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(result?.error || 'Unable to save mission.')
      }

      alert('Mission updated')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to save mission.'
      alert(message)
    } finally {
      setIsSavingMission(false)
    }
  }

  return (
    <div className="space-y-6 p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">Company Performance Admin</h1>
        <p className="text-slate-600">Truth Engine — Configure targets, plans, and client reality (admin only)</p>
      </div>

      {/* 1️⃣ MISSION & YEAR SETUP */}
      <Card className="border-2 border-slate-200">
        <CardHeader className="border-b bg-slate-50">
          <div className="flex items-center gap-2">
            <CardTitle className="text-xl">Mission & Year Setup</CardTitle>
            <div className="relative group">
              <Info className="w-4 h-4 text-blue-600 cursor-help" />
              <div className="absolute bottom-full left-0 mb-2 bg-slate-900 text-white text-xs rounded p-2 w-48 hidden group-hover:block z-10">
                This defines the company's North Star. Change carefully.
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Mission Title</label>
              <Input value={missionTitle} onChange={(e) => setMissionTitle(e.target.value)} disabled={isLocked} />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Year</label>
              <Input value={missionYear} onChange={(e) => setMissionYear(e.target.value)} disabled />
              <p className="text-xs text-slate-500 mt-1">Year is fixed to the current year.</p>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Total Client Target</label>
              <Input value={totalTarget} onChange={(e) => setTotalTarget(e.target.value)} disabled={isLocked} type="number" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Current Active Clients</label>
              <Input value={currentActiveClients} onChange={(e) => setCurrentActiveClients(e.target.value)} disabled={isLocked} type="number" />
            </div>
          </div>
          <Button
            onClick={handleSaveMission}
            disabled={isLocked || isSavingMission}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {isSavingMission ? 'Saving...' : 'Save Mission_test'}
          </Button>
        </CardContent>
      </Card>

      {/* 2️⃣ QUARTERLY TARGETS (LAG PLANNING) */}
      <Card className="border-2 border-slate-200">
        <CardHeader className="border-b bg-slate-50">
          <CardTitle className="text-xl">Quarterly Targets — Growth Planning</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="overflow-x-auto mb-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-bold">Quarter</TableHead>
                  <TableHead className="font-bold">Planned Clients</TableHead>
                  <TableHead className="font-bold">Planned Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {quarterlyTargets.map((qt, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="font-bold">{qt.quarter}</TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={qt.plannedClients}
                        onChange={(e) => {
                          const updated = [...quarterlyTargets]
                          updated[idx].plannedClients = parseInt(e.target.value)
                          setQuarterlyTargets(updated)
                        }}
                        disabled={isLocked}
                        className="w-24"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={qt.plannedRevenue}
                        onChange={(e) => {
                          const updated = [...quarterlyTargets]
                          updated[idx].plannedRevenue = parseInt(e.target.value)
                          setQuarterlyTargets(updated)
                        }}
                        disabled={isLocked}
                        className="w-32"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <p className="text-xs text-slate-600 italic mb-4">These are outcome targets. Execution lives in departments.</p>
          <Button onClick={() => alert('Targets saved')} disabled={isLocked} className="w-full bg-blue-600 hover:bg-blue-700">Save Quarterly Targets</Button>
        </CardContent>
      </Card>

      {/* 3️⃣ QUARTERLY OUTCOME (THE MOST IMPORTANT) */}
      <Card className={cn('border-4', verdictColors[quarterlyOutcome.verdict])}>
        <CardHeader className="border-b bg-slate-50">
          <CardTitle className="text-xl">{selectedQuarter} Outcome — Leadership Verdict</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Quarter</label>
              <Select value={selectedQuarter} onValueChange={(q) => {
                setSelectedQuarter(q)
                setQuarterlyOutcome({...quarterlyOutcome, quarter: q})
              }} disabled={isLocked}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {['Q1', 'Q2', 'Q3', 'Q4'].map(q => (
                    <SelectItem key={q} value={q}>{q}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Planned Clients</label>
              <Input value={quarterlyOutcome.plannedClients} disabled className="bg-slate-100" type="number" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Actual Clients</label>
              <Input
                type="number"
                value={quarterlyOutcome.actualClients}
                onChange={(e) => setQuarterlyOutcome({...quarterlyOutcome, actualClients: parseInt(e.target.value)})}
                disabled={isLocked}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Verdict</label>
              <Select value={quarterlyOutcome.verdict} onValueChange={(v) => setQuarterlyOutcome({...quarterlyOutcome, verdict: v as any})} disabled={isLocked}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="On Track">✅ On Track</SelectItem>
                  <SelectItem value="At Risk">⚠️ At Risk</SelectItem>
                  <SelectItem value="Off Track">❌ Off Track</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Verdict Explanation (Required)</label>
            <Textarea
              value={quarterlyOutcome.explanation}
              onChange={(e) => setQuarterlyOutcome({...quarterlyOutcome, explanation: e.target.value})}
              disabled={isLocked}
              placeholder="Explain what happened and why."
              rows={3}
            />
          </div>
          <Button onClick={() => alert('Outcome saved')} disabled={isLocked} className="w-full bg-blue-600 hover:bg-blue-700">Save Quarterly Outcome</Button>
        </CardContent>
      </Card>

      {/* 4️⃣ DEPARTMENT EXECUTION HEALTH */}
      <Card className="border-2 border-slate-200">
        <CardHeader className="border-b bg-slate-50">
          <CardTitle className="text-xl">Department Execution Health (Quarter Summary)</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="overflow-x-auto mb-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-bold">Department</TableHead>
                  <TableHead className="font-bold">Status</TableHead>
                  <TableHead className="font-bold">Explanation</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {departmentHealth.map((dept, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="font-bold">{dept.department}</TableCell>
                    <TableCell>
                      <Select value={dept.status} onValueChange={(s) => {
                        const updated = [...departmentHealth]
                        updated[idx].status = s as any
                        setDepartmentHealth(updated)
                      }} disabled={isLocked}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Stable">🟢 Stable</SelectItem>
                          <SelectItem value="At Risk">🟡 At Risk</SelectItem>
                          <SelectItem value="Off Track">🔴 Off Track</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Input
                        value={dept.explanation}
                        onChange={(e) => {
                          const updated = [...departmentHealth]
                          updated[idx].explanation = e.target.value
                          setDepartmentHealth(updated)
                        }}
                        disabled={isLocked}
                        className="w-96"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <p className="text-xs text-slate-600 italic mb-4">Derived from department scorecards. Do not restate metrics.</p>
          <Button onClick={() => alert('Department health saved')} disabled={isLocked} className="w-full bg-blue-600 hover:bg-blue-700">Save Department Health</Button>
        </CardContent>
      </Card>

      {/* 5️⃣ CURRENT QUARTER CONSTRAINT */}
      <Card className="border-4 border-red-500 bg-red-50">
        <CardHeader className="border-b bg-red-100">
          <CardTitle className="text-xl flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            Primary Constraint — This Quarter (Only ONE)
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div>
            <label className="block text-sm font-bold text-red-900 mb-2">Constraint Title</label>
            <Input value={constraintTitle} onChange={(e) => setConstraintTitle(e.target.value)} disabled={isLocked} />
          </div>
          <div>
            <label className="block text-sm font-bold text-red-900 mb-2">Constraint Description</label>
            <Textarea value={constraintDesc} onChange={(e) => setConstraintDesc(e.target.value)} disabled={isLocked} rows={2} />
          </div>
          <div>
            <label className="block text-sm font-bold text-red-900 mb-2">Severity</label>
            <Select value={constraintSeverity} onValueChange={setConstraintSeverity} disabled={isLocked}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Critical">🔴 Critical</SelectItem>
                <SelectItem value="Moderate">🟡 Moderate</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <p className="text-xs text-red-700 font-bold italic">Everything else is secondary this quarter.</p>
          <Button onClick={() => alert('Constraint saved')} disabled={isLocked} className="w-full bg-red-600 hover:bg-red-700">Save Constraint</Button>
        </CardContent>
      </Card>

      {/* 6️⃣ CLIENT MOVEMENT (EVIDENCE) */}
      <Card className="border-2 border-slate-200">
        <CardHeader className="border-b bg-slate-50">
          <CardTitle className="text-xl">Client Movement — This Quarter</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="flex gap-2 mb-4">
            <Button onClick={() => {
              const name = prompt('Client name:')
              if (name) setClientEvents([...clientEvents, {
                id: `c-${Date.now()}`,
                name,
                brand: 'Warrior Systems',
                eventType: 'Added',
                month: 'Mar 2026'
              }])
            }} disabled={isLocked} className="gap-2 bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4" />
              Add Client Event
            </Button>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-bold">Client</TableHead>
                  <TableHead className="font-bold">Brand</TableHead>
                  <TableHead className="font-bold">Event</TableHead>
                  <TableHead className="font-bold">Month</TableHead>
                  <TableHead className="font-bold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clientEvents.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-semibold">{client.name}</TableCell>
                    <TableCell>{client.brand}</TableCell>
                    <TableCell><Badge className={client.eventType === 'Added' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>{client.eventType}</Badge></TableCell>
                    <TableCell>{client.month}</TableCell>
                    <TableCell>
                      <button onClick={() => setClientEvents(clientEvents.filter(c => c.id !== client.id))} disabled={isLocked}>
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <p className="text-xs text-slate-600 italic">This feeds frontend read-only. This is evidence, not analysis.</p>
        </CardContent>
      </Card>

      {/* 7️⃣ FOUNDER / CEO VERDICT */}
      <Card className="border-2 border-slate-200">
        <CardHeader className="border-b bg-slate-50">
          <CardTitle className="text-xl">Founder / CEO Verdict</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Verdict Narrative (2-4 lines max)</label>
            <Textarea value={founderVerdict} onChange={(e) => setFounderVerdict(e.target.value)} disabled={isLocked} rows={3} placeholder="Your judgment, not reporting." />
          </div>
          <p className="text-xs text-slate-600 italic">No metrics allowed here. This is judgment.</p>
          <Button onClick={() => alert('Verdict saved')} disabled={isLocked} className="w-full bg-blue-600 hover:bg-blue-700">Save Founder Verdict</Button>
        </CardContent>
      </Card>

      {/* 8️⃣ STRATEGIC DECISION FOR NEXT QUARTER */}
      <Card className="border-2 border-orange-500 bg-orange-50">
        <CardHeader className="border-b bg-orange-100">
          <CardTitle className="text-xl">Strategic Decision for Next Quarter</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div>
            <label className="block text-sm font-bold text-orange-900 mb-2">Decision Title</label>
            <Input value={strategyTitle} onChange={(e) => setStrategyTitle(e.target.value)} disabled={isLocked} />
          </div>
          <div>
            <label className="block text-sm font-bold text-orange-900 mb-2">Decision Description</label>
            <Textarea value={strategyDesc} onChange={(e) => setStrategyDesc(e.target.value)} disabled={isLocked} rows={2} />
          </div>
          <div>
            <label className="block text-sm font-bold text-orange-900 mb-2">Supporting Actions (Max 3)</label>
            <div className="space-y-2">
              {strategyActions.map((action, idx) => (
                <div key={idx} className="flex gap-2">
                  <Input value={action} onChange={(e) => {
                    const updated = [...strategyActions]
                    updated[idx] = e.target.value
                    setStrategyActions(updated)
                  }} disabled={isLocked} />
                </div>
              ))}
            </div>
          </div>
          <Button onClick={() => alert('Strategy saved')} disabled={isLocked} className="w-full bg-orange-600 hover:bg-orange-700">Save Strategic Decision</Button>
        </CardContent>
      </Card>

      {/* 9️⃣ REVIEW LOCK & AUDIT */}
      <Card className="border-2 border-slate-200">
        <CardHeader className="border-b bg-slate-50">
          <CardTitle className="text-xl flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Quarter Closure & Review Lock
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Review Date</label>
              <Input type="date" value={reviewDate} onChange={(e) => setReviewDate(e.target.value)} disabled={isLocked} />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Reviewed By</label>
              <Input value={reviewedBy} onChange={(e) => setReviewedBy(e.target.value)} disabled={isLocked} />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Lock Quarter</label>
              <Button onClick={() => setIsLocked(!isLocked)} className={isLocked ? 'bg-red-600 hover:bg-red-700 w-full' : 'bg-green-600 hover:bg-green-700 w-full'}>
                {isLocked ? '🔒 LOCKED' : '🔓 UNLOCK'}
              </Button>
            </div>
          </div>
          <p className="text-xs text-slate-600 italic">Once locked: fields become read-only. Frontend reflects "Reviewed".</p>
        </CardContent>
      </Card>
    </div>
  )
}
