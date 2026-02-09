"use client"

import { useBrand } from "@/lib/brand-context"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, Building2 } from "lucide-react"

export function UserBrandSelector() {
  const mockAssignments = [
    { brand: "warrior-systems", department: "marketing" },
    { brand: "warrior-systems", department: "accounts" },
    { brand: "story-marketing", department: "accounts" },
  ]

  const { activeBrand, setActiveBrand } = useBrand()

  const uniqueBrands = Array.from(new Set(mockAssignments.map((a) => a.brand)))

  if (uniqueBrands.length === 1) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Building2 className="h-4 w-4" />
        <span>Working on 1 brand</span>
      </div>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
          <Building2 className="h-4 w-4" />
          {uniqueBrands.length} Brands
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Your Brand Assignments</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {uniqueBrands.map((brand) => {
          const depts = mockAssignments.filter((a) => a.brand === brand).map((a) => a.department)

          const brandNames = {
            "warrior-systems": "The Warrior Systems",
            "story-marketing": "Story Marketing",
            "meta-gurukul": "Meta Gurukul",
          }

          return (
            <DropdownMenuItem
              key={brand}
              onClick={() => setActiveBrand(brand)}
              className="flex flex-col items-start gap-1"
            >
              <div className="font-medium">{brandNames[brand]}</div>
              <div className="text-xs text-muted-foreground">
                {depts.length} department{depts.length !== 1 ? "s" : ""}
              </div>
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
