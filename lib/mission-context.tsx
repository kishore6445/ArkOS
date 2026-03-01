"use client"

import type React from "react"
import { createContext, useContext } from "react"

export interface CompanyMission {
  name: string
  description: string
  totalTarget: number
  totalAchieved: number
  brandBreakdown: {
    name: string
    target: number
    achieved: number
    color: string
  }[]
}

// Company Mission 30: Onboard and serve 30 clients across three brands
export const COMPANY_MISSION: CompanyMission = {
  name: "Mission 30",
  description: "Onboard and serve 30 clients across three brands",
  totalTarget: 30,
  totalAchieved: 10, // 6 (Warrior) + 3 (Story) + 1 (Meta)
  brandBreakdown: [
    {
      name: "Warrior Systems",
      target: 18,
      achieved: 6,
      color: "#1e40af",
    },
    {
      name: "Story Marketing",
      target: 6,
      achieved: 3,
      color: "#7c3aed",
    },
    {
      name: "Meta Gurukul",
      target: 6,
      achieved: 1,
      color: "#059669",
    },
  ],
}

interface MissionContextType {
  mission: CompanyMission
  getProgress: () => number
  getBrandContribution: (brandName: string) => { target: number; achieved: number } | null
}

const MissionContext = createContext<MissionContextType | undefined>(undefined)

export function MissionProvider({ children }: { children: React.ReactNode }) {
  const missionValue: MissionContextType = {
    mission: COMPANY_MISSION,
    getProgress: () => (COMPANY_MISSION.totalAchieved / COMPANY_MISSION.totalTarget) * 100,
    getBrandContribution: (brandName: string) => {
      const brand = COMPANY_MISSION.brandBreakdown.find(b => b.name === brandName)
      return brand ? { target: brand.target, achieved: brand.achieved } : null
    },
  }

  return (
    <MissionContext.Provider value={missionValue}>
      {children}
    </MissionContext.Provider>
  )
}

export function useMission() {
  const context = useContext(MissionContext)
  if (!context) {
    return {
      mission: COMPANY_MISSION,
      getProgress: () => (COMPANY_MISSION.totalAchieved / COMPANY_MISSION.totalTarget) * 100,
      getBrandContribution: (brandName: string) => {
        const brand = COMPANY_MISSION.brandBreakdown.find(b => b.name === brandName)
        return brand ? { target: brand.target, achieved: brand.achieved } : null
      },
    }
  }
  return context
}
