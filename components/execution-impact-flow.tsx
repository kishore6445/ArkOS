'use client'

import { Card } from '@/components/ui/card'
import { ArrowRight, ArrowDown } from 'lucide-react'

export function ExecutionImpactFlow() {
  const steps = [
    {
      title: 'Power Moves',
      subtitle: 'Lead Measures',
      description: 'Daily & weekly actions',
    },
    {
      title: 'Department Victory Targets',
      subtitle: 'Lag Measures',
      description: 'Monthly / Quarterly outcomes',
    },
    {
      title: 'War Goal',
      subtitle: 'Strategic Outcome',
      description: 'Onboard 50 Clients',
    },
  ]

  return (
    <Card className="border border-stone-200 bg-white">
      <div className="p-6 lg:p-8">
        <h3 className="text-base font-semibold text-stone-900 mb-6">Execution Impact Flow</h3>

        {/* Desktop Flow (Horizontal) */}
        <div className="hidden md:flex items-center justify-between gap-6 mb-6">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center flex-1">
              {/* Step Box */}
              <div className="flex-1">
                <div className="bg-stone-50 border border-stone-200 rounded-lg p-4">
                  <p className="font-semibold text-sm text-stone-900">{step.title}</p>
                  <p className="text-xs text-stone-500 mt-1">{step.subtitle}</p>
                </div>
              </div>

              {/* Arrow (only if not last) */}
              {index < steps.length - 1 && (
                <div className="flex items-center justify-center px-4 flex-shrink-0">
                  <ArrowRight className="h-5 w-5 text-stone-300" aria-hidden="true" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Mobile Flow (Vertical) */}
        <div className="md:hidden space-y-4">
          {steps.map((step, index) => (
            <div key={index}>
              <div className="bg-stone-50 border border-stone-200 rounded-lg p-4">
                <p className="font-semibold text-sm text-stone-900">{step.title}</p>
                <p className="text-xs text-stone-500 mt-1">{step.subtitle}</p>
              </div>
              {/* Arrow (only if not last) */}
              {index < steps.length - 1 && (
                <div className="flex justify-center py-2">
                  <ArrowDown className="h-4 w-4 text-stone-300" aria-hidden="true" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom Note */}
        <div className="mt-6 pt-4 border-t border-stone-100">
          <p className="text-xs text-stone-600 text-center leading-relaxed">
            <span className="font-semibold text-stone-700">Weekly power moves</span> compound into monthly targets, which drive your <span className="font-semibold text-stone-700">war goal</span>
          </p>
        </div>
      </div>
    </Card>
  )
}
