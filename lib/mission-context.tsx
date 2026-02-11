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

// Company Mission 35: Onboard and serve 35 clients across three brands
export const COMPANY_MISSION: CompanyMission = {
  name: "Mission 35",
  description: "Onboard and serve 35 clients across three brands. Get 35% Salary Hike once we achieve 35 Clients",
  totalTarget: 35,
  totalAchieved: 28, // 13 (Warrior) + 10 (Story) + 5 (Meta)
  brandBreakdown: [
    {
      name: "Warrior Systems",
      target: 21,
      achieved: 13,
      color: "#1e40af",
    },
    {
      name: "Story Marketing",
      target: 7,
      achieved: 10,
      color: "#7c3aed",
    },
    {
      name: "Meta Gurukul",
      target: 7,
      achieved: 5,
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
