'use client'

import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { AlertCircle } from 'lucide-react'
import { SectionNavigation } from '@/components/section-navigation'

const REVENUE_PER_CLIENT = 30000

type ClientOrigin = 'Existing' | 'Planned' | 'Bonus'

interface Client {
  id: string
  name: string
  brand: 'Warrior Systems' | 'Story Marketing'
  joinMonth: string
  origin: ClientOrigin
  status: 'active' | 'dropped'
}

export function CompanyPerformance() {
  const currentYear = new Date().getFullYear()
  const [clients, setClients] = useState<Client[]>([
    { id: '1', name: 'Client A', brand: 'Warrior Systems', joinMonth: 'Jan 2026', origin: 'Existing', status: 'active' },
    { id: '2', name: 'Client B', brand: 'Story Marketing', joinMonth: 'Feb 2026', origin: 'Existing', status: 'active' },
    { id: '3', name: 'Client C', brand: 'Warrior Systems', joinMonth: 'Mar 2026', origin: 'Existing', status: 'active' },
  ])

  const [missionData, setMissionData] = useState({
    missionTitle: 'Onboard 35 Clients',
    totalTarget: 35,
    currentTargetAchieved: 3,
  })

  const currentQuarter = 'Q1'
  const activeClients = clients.filter((c) => c.status === 'active')
  const activeClientsCount = missionData.currentTargetAchieved
  const totalPlannedClients = missionData.totalTarget

  // Calculate progress metrics
  const monthsElapsed = 3 // Q1 = 3 months
  const monthsRemaining = 10
  const requiredPacePerMonth = totalPlannedClients / 12
  const plannedForQuarter = 0 // Q1 is baseline
  const actualForQuarter = activeClientsCount
  const verdictStatus = actualForQuarter >= plannedForQuarter * 0.9 ? 'on-track' : actualForQuarter >= plannedForQuarter * 0.7 ? 'at-risk' : 'off-track'

  useEffect(() => {
    let isActive = true

    const loadMission = async () => {
      try {
        const response = await fetch(`/api/admin/mission?missionYear=${currentYear}`, { cache: 'no-store' })
        const result = await response.json().catch(() => ({}))

        if (!response.ok || !result?.mission) return
        if (!isActive) return

        setMissionData({
          missionTitle: result.mission.missionTitle || missionData.missionTitle,
          totalTarget: Number(result.mission.totalTarget) || missionData.totalTarget,
          currentTargetAchieved: Number(result.mission.currentTargetAchieved) || 0,
        })
      } catch {
        // Ignore load errors for now
      }
    }

    loadMission()

    return () => {
      isActive = false
    }
  }, [currentYear])

  return (
    <main className="space-y-0 relative">
      <SectionNavigation />
      
      {/* SECTION 1: FIXED HEADER */}
      <section data-section="header" className="sticky top-0 z-10 bg-slate-950 px-6 py-8 border-b-2 border-orange-500">
        <div className="mx-auto max-w-7xl">
          <p className="text-orange-400 text-sm font-bold uppercase tracking-widest mb-2">Mission {currentYear}</p>
          <h1 className="text-5xl font-black text-white mb-6">{missionData.missionTitle}</h1>
          <div className="grid grid-cols-3 gap-12">
            <div>
              <p className="text-slate-300 text-xs uppercase font-bold mb-1">Progress</p>
              <p className="text-3xl font-black text-orange-400">{activeClientsCount} / {totalPlannedClients}</p>
            </div>
            <div>
              <p className="text-slate-300 text-xs uppercase font-bold mb-1">Time Left</p>
              <p className="text-3xl font-black text-slate-200">{monthsRemaining} months</p>
            </div>
            <div>
              <p className="text-slate-300 text-xs uppercase font-bold mb-1">Required Pace</p>
              <p className="text-3xl font-black text-slate-200">{requiredPacePerMonth.toFixed(1)} / month</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: QUARTER REVIEW CARD */}
      <section data-section="quarter-review" className="bg-white px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="space-y-8">
            <div>
              <p className="text-slate-500 text-xs uppercase font-bold tracking-widest mb-2">Q{currentQuarter[1]} {currentYear} — Company Review</p>
              <h2 className="text-4xl font-bold text-slate-900">Quarter Outcome</h2>
            </div>
            
            <div className="grid gap-8 lg:grid-cols-3">
              <div className="rounded-lg border-2 border-slate-200 p-8 text-center bg-slate-50">
                <p className="text-slate-500 text-xs uppercase font-bold mb-3">Planned</p>
                <p className="text-6xl font-black text-slate-900">{plannedForQuarter}</p>
              </div>
              <div className="rounded-lg border-2 border-slate-200 p-8 text-center bg-slate-50">
                <p className="text-slate-500 text-xs uppercase font-bold mb-3">Actual</p>
                <p className="text-6xl font-black text-slate-900">{actualForQuarter}</p>
              </div>
              <div className={cn(
                "rounded-lg border-2 p-8 text-center",
                verdictStatus === 'on-track' ? 'border-green-500 bg-green-50' :
                verdictStatus === 'at-risk' ? 'border-amber-500 bg-amber-50' :
                'border-slate-200 bg-slate-50'
              )}>
                <p className={cn(
                  "text-xs uppercase font-bold mb-3",
                  verdictStatus === 'on-track' ? 'text-green-700' :
                  verdictStatus === 'at-risk' ? 'text-amber-700' :
                  'text-slate-500'
                )}>Verdict</p>
                <p className={cn(
                  "text-4xl font-black mb-2",
                  verdictStatus === 'on-track' ? 'text-green-900' :
                  verdictStatus === 'at-risk' ? 'text-amber-900' :
                  'text-slate-900'
                )}>
                  {verdictStatus === 'on-track' ? '✓' : verdictStatus === 'at-risk' ? '⚠' : '—'}
                </p>
                <Badge className={cn(
                  "text-xs font-bold",
                  verdictStatus === 'on-track' ? 'bg-green-100 text-green-800' :
                  verdictStatus === 'at-risk' ? 'bg-amber-100 text-amber-800' :
                  'bg-slate-100 text-slate-800'
                )}>
                  {verdictStatus === 'on-track' ? 'ON TRACK' : verdictStatus === 'at-risk' ? 'AT RISK' : 'BASELINE'}
                </Badge>
              </div>
            </div>

            <div className="rounded-lg bg-slate-50 border border-slate-200 p-4">
              <p className="text-slate-700 text-sm font-semibold">
                {verdictStatus === 'baseline' ? 'Q1 serves as baseline. Planned growth begins Q2.' :
                 'Execution gap detected. Current pace will impact annual target.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: DEPARTMENT EXECUTION HEALTH */}
      <section data-section="execution-health" className="bg-slate-950 px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="space-y-8">
            <div>
              <p className="text-orange-400 text-xs uppercase font-bold tracking-widest mb-2">Execution Health</p>
              <h2 className="text-4xl font-bold text-white">Department Performance</h2>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[
                { dept: 'Sales', status: 'stable', meaning: 'Pipeline healthy' },
                { dept: 'Marketing', status: 'at-risk', meaning: 'Lead flow uneven' },
                { dept: 'Delivery', status: 'stable', meaning: 'Retention strong' },
                { dept: 'Operations', status: 'stable', meaning: 'No bottlenecks' }
              ].map((item, idx) => (
                <div key={idx} className="rounded-lg border-l-4 border-orange-500 bg-white p-6">
                  <p className="text-slate-500 text-xs uppercase font-bold mb-2">{item.dept}</p>
                  <Badge className={cn(
                    "mb-2 text-xs font-bold",
                    item.status === 'stable' ? 'bg-green-100 text-green-800' :
                    'bg-amber-100 text-amber-800'
                  )}>
                    {item.status === 'stable' ? '✓ Stable' : '⚠ At Risk'}
                  </Badge>
                  <p className="text-slate-600 text-sm">{item.meaning}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: CURRENT QUARTER CONSTRAINT */}
      <section data-section="constraint" className="bg-white px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="space-y-8">
            <div>
              <p className="text-slate-500 text-xs uppercase font-bold tracking-widest mb-2">Forced Focus</p>
              <h2 className="text-4xl font-bold text-slate-900">Current Quarter Constraint</h2>
            </div>
            
            <div className="rounded-lg border-4 border-red-600 bg-red-50 p-8">
              <div className="flex items-start gap-4">
                <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-2xl font-bold text-red-900 mb-2">Sales Conversion Discipline</h3>
                  <p className="text-red-800 font-semibold mb-3">
                    Leads exist, but follow-up consistency and closure rate are weak. This is the bottleneck.
                  </p>
                  <p className="text-sm text-red-700">
                    <strong>Impact:</strong> Directly affects Mission 35 progress and Q1 baseline establishment.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: CLIENT MOVEMENT EVIDENCE */}
      <section data-section="client-movement" className="bg-slate-950 px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="space-y-8">
            <div>
              <p className="text-orange-400 text-xs uppercase font-bold tracking-widest mb-2">Evidence</p>
              <h2 className="text-4xl font-bold text-white">Client Movement — Q1 2026</h2>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              <div className="rounded-lg bg-white p-6 text-center">
                <p className="text-slate-500 text-xs uppercase font-bold mb-2">Added</p>
                <p className="text-5xl font-black text-green-600">+{activeClients.filter(c => c.origin === 'Planned').length}</p>
              </div>
              <div className="rounded-lg bg-white p-6 text-center">
                <p className="text-slate-500 text-xs uppercase font-bold mb-2">Dropped</p>
                <p className="text-5xl font-black text-slate-300">0</p>
              </div>
              <div className="rounded-lg bg-orange-600 p-6 text-center">
                <p className="text-orange-100 text-xs uppercase font-bold mb-2">Net Change</p>
                <p className="text-5xl font-black text-orange-100">+{activeClientsCount}</p>
              </div>
            </div>

            <div className="rounded-lg border-2 border-slate-700 bg-slate-900 p-6 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-3 px-4 text-orange-400 font-bold uppercase text-xs">Client</th>
                    <th className="text-left py-3 px-4 text-orange-400 font-bold uppercase text-xs">Brand</th>
                    <th className="text-left py-3 px-4 text-orange-400 font-bold uppercase text-xs">Event</th>
                    <th className="text-left py-3 px-4 text-orange-400 font-bold uppercase text-xs">Month</th>
                  </tr>
                </thead>
                <tbody>
                  {activeClients.map((client) => (
                    <tr key={client.id} className="border-b border-slate-800 hover:bg-slate-800 transition">
                      <td className="py-3 px-4 text-white font-semibold">{client.name}</td>
                      <td className="py-3 px-4 text-slate-300">{client.brand}</td>
                      <td className="py-3 px-4">
                        <Badge className="bg-green-100 text-green-800 text-xs font-bold">Added</Badge>
                      </td>
                      <td className="py-3 px-4 text-slate-300">{client.joinMonth}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <p className="text-slate-300 text-sm italic">
              Client updates are managed in Admin. This list reflects verified outcomes.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 6: FOUNDER VERDICT */}
      <section data-section="founder-verdict" className="bg-white px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="space-y-8">
            <div>
              <p className="text-slate-500 text-xs uppercase font-bold tracking-widest mb-2">Leadership</p>
              <h2 className="text-4xl font-bold text-slate-900">Founder Verdict</h2>
            </div>

            <div className="rounded-lg border-l-4 border-orange-500 bg-slate-50 p-8">
              <p className="text-lg font-semibold text-slate-800 italic">
                "Q1 focus was fragmented. Core sales cadence weakened while experiments increased. We need discipline—not perfection—to hit Mission 50."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: STRATEGIC DECISION */}
      <section data-section="strategic-decision" className="bg-slate-950 px-6 py-16 border-t-2 border-orange-500">
        <div className="mx-auto max-w-7xl">
          <div className="space-y-8">
            <div>
              <p className="text-orange-400 text-xs uppercase font-bold tracking-widest mb-2">Next Quarter Direction</p>
              <h2 className="text-4xl font-bold text-white">Strategic Decision for Q2</h2>
            </div>

            <div className="rounded-lg bg-orange-600 p-8 text-center">
              <p className="text-orange-100 text-sm uppercase font-bold mb-2">Approved</p>
              <p className="text-2xl font-bold text-white">
                Freeze acquisition experiments. Reinforce sales cadence and follow-up rhythm.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3 text-slate-300 text-sm">
              <div className="rounded-lg border border-slate-700 bg-slate-900 p-4">
                <p className="font-bold mb-2 text-white">What This Means</p>
                <p>Pause new initiatives. Focus 100% on operational excellence.</p>
              </div>
              <div className="rounded-lg border border-slate-700 bg-slate-900 p-4">
                <p className="font-bold mb-2 text-white">Who's Responsible</p>
                <p>Sales team owns the rhythm. Marketing enables through aligned cadence.</p>
              </div>
              <div className="rounded-lg border border-slate-700 bg-slate-900 p-4">
                <p className="font-bold mb-2 text-white">Success Looks Like</p>
                <p>10+ planned clients by June 30. Zero preventable delays.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
