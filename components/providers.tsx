"use client"

import type React from "react"

import { BrandProvider } from "@/lib/brand-context"
import { UserProvider } from "@/lib/user-context"
import { MissionProvider } from "@/lib/mission-context"
import { Toaster } from "@/components/ui/toaster"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <BrandProvider>
      <MissionProvider>
        <UserProvider>
          {children}
          <Toaster />
        </UserProvider>
      </MissionProvider>
    </BrandProvider>
  )
}
