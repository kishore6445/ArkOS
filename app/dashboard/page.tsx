'use client'

import { useState, useEffect } from 'react'
import { AppShell } from '@/components/app-shell'
import { IndividualDashboard } from '@/components/individual-dashboard'
import { useUser } from '@/lib/user-context'

export default function DashboardPage() {
  const { currentUser, isLoading } = useUser()
  const [showContent, setShowContent] = useState(false)
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true)
    }, 2000)
    
    return () => clearTimeout(timer)
  }, [])

  const isAdmin = currentUser?.role === 'super_admin'
  const currentUserName = currentUser?.name ?? ''
  const currentUserId = currentUser?.id ?? ''

  if (isLoading && !showContent) {
    return (
      <AppShell>
        <div className='flex items-center justify-center min-h-[420px]'>
          <p className='text-sm text-stone-500'>Loading dashboard...</p>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <IndividualDashboard
        isAdmin={isAdmin}
        currentUserName={currentUserName}
        currentUserId={currentUserId}
      />
    </AppShell>
  )
}
