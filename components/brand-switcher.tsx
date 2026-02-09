"use client"

import { Check, Building2, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useBrand, BRANDS } from "@/lib/brand-context"
import { cn } from "@/lib/utils"

export function BrandSwitcher() {
  const { currentBrand, setCurrentBrand, brandConfig, isReady } = useBrand()

  if (!isReady) {
    return (
      <Button
        variant="outline"
        className="h-10 px-4 gap-2 border-gray-300 bg-transparent opacity-50"
        disabled
        aria-label="Loading brand selector"
      >
        <Building2 className="h-4 w-4" aria-hidden="true" />
        <span className="font-medium text-sm">{brandConfig.name}</span>
        <ChevronDown className="h-4 w-4 text-gray-500" aria-hidden="true" />
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="h-10 px-4 gap-2 border-gray-300 hover:bg-gray-50 bg-transparent"
          aria-label={`Switch brand. Current: ${brandConfig.name}`}
        >
          <Building2 className="h-4 w-4" aria-hidden="true" />
          <span className="font-medium text-sm">{brandConfig.name}</span>
          <ChevronDown className="h-4 w-4 text-gray-500" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        {Object.values(BRANDS).map((brand) => (
          <DropdownMenuItem
            key={brand.id}
            onClick={() => setCurrentBrand(brand.id)}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 cursor-pointer",
              currentBrand === brand.id && "bg-blue-50",
            )}
          >
            <span className="text-xl" aria-hidden="true">
              {brand.logo}
            </span>
            <div className="flex-1">
              <div className="font-medium text-sm">{brand.name}</div>
            </div>
            {currentBrand === brand.id && <Check className="h-4 w-4 text-blue-600" aria-hidden="true" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
