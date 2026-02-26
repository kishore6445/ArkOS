'use client'

import { AppShell } from '@/components/app-shell'

export default function DashboardPage() {
  return (
    <AppShell>
      <div className='px-6 py-12'>
        <h1 className='text-4xl font-black text-slate-900 mb-4'>Dashboard</h1>
        <p className='text-slate-600'>Testing if page loads...</p>
      </div>
    </AppShell>
  )
}
