'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'

export interface TutorialCardProps {
  id: string
  title: string
  description: string
  icon?: React.ReactNode
  action?: {
    label: string
    onClick: () => void
  }
}

export function TutorialCard({ id, title, description, icon, action }: TutorialCardProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check localStorage to see if user has dismissed this tutorial
    const dismissed = localStorage.getItem(`tutorial-dismissed-${id}`)
    setIsVisible(!dismissed)
  }, [id])

  const handleDismiss = () => {
    localStorage.setItem(`tutorial-dismissed-${id}`, 'true')
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div className='bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-4 animate-fade-in-up'>
      {icon && (
        <div className='flex-shrink-0 text-blue-600 mt-1'>
          {icon}
        </div>
      )}
      <div className='flex-1'>
        <h4 className='text-sm font-semibold text-blue-900'>{title}</h4>
        <p className='text-sm text-blue-700 mt-1'>{description}</p>
        {action && (
          <Button
            size='sm'
            variant='outline'
            onClick={action.onClick}
            className='mt-3 border-blue-300 text-blue-700 hover:bg-blue-100'
          >
            {action.label}
          </Button>
        )}
      </div>
      <button
        onClick={handleDismiss}
        className='flex-shrink-0 text-blue-600 hover:text-blue-700 transition'
        aria-label='Dismiss'
      >
        <X className='h-4 w-4' />
      </button>
    </div>
  )
}
