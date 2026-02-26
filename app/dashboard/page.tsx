'use client'

import { useUser } from '@/lib/user-context'
import { AppShell } from '@/components/app-shell'
import { IndividualDashboard } from '@/components/individual-dashboard'

export default function DashboardPage() {
  const { currentUser, isLoading } = useUser()
  
  const isAdmin = currentUser?.role === 'super_admin'
  const currentUserName = currentUser?.name ?? ''
  const currentUserId = currentUser?.id ?? ''

  if (isLoading) {
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
