'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface Section {
  id: string
  title: string
  offset: number
}

const SECTIONS: Section[] = [
  { id: 'header', title: 'Mission 2026', offset: 0 },
  { id: 'quarter-review', title: 'Quarter Review', offset: 0 },
  { id: 'execution-health', title: 'Execution Health', offset: 0 },
  { id: 'constraint', title: 'Current Constraint', offset: 0 },
  { id: 'client-movement', title: 'Client Movement', offset: 0 },
  { id: 'founder-verdict', title: 'Founder Verdict', offset: 0 },
  { id: 'strategic-decision', title: 'Strategic Decision', offset: 0 },
]

export function SectionNavigation() {
  const [activeSection, setActiveSection] = useState<string>('header')
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      // Hide on very small screens
      if (window.innerWidth < 1280) {
        setIsVisible(false)
        return
      }
      setIsVisible(true)

      // Find active section
      const sections = document.querySelectorAll('[data-section]')
      let current = 'header'

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect()
        if (rect.top <= 200) {
          current = section.getAttribute('data-section') || 'header'
        }
      })

      setActiveSection(current)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!isVisible) return null

  const scrollToSection = (sectionId: string) => {
    const element = document.querySelector(`[data-section="${sectionId}"]`)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <nav className='fixed right-8 top-32 z-40 hidden xl:block max-w-xs'>
      <div className='space-y-1 bg-white rounded-lg border border-slate-200 shadow-lg p-3'>
        <p className='text-xs font-bold uppercase tracking-widest text-slate-600 px-3 py-2'>Sections</p>
        {SECTIONS.map((section) => (
          <button
            key={section.id}
            onClick={() => scrollToSection(section.id)}
            className={cn(
              'block w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-all duration-200',
              activeSection === section.id
                ? 'bg-orange-100 text-orange-900 border-l-2 border-l-orange-500'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            )}
          >
            {section.title}
          </button>
        ))}
      </div>
    </nav>
  )
}
