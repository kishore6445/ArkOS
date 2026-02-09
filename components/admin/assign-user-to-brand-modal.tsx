"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

type BrandAssignment = {
  id: string
  userId: string
  userName: string
  userEmail: string
  brandId: "warrior-systems" | "story-marketing" | "meta-gurukul"
  brandName: string
  departments: Array<{
    code: "M" | "A" | "S" | "T" | "E" | "R" | "Y"
    name: string
    permission: "admin" | "member" | "view"
  }>
}

type UserOption = {
  id: string
  name: string
  email: string
  departments: Array<{
    code: "M" | "A" | "S" | "T" | "E" | "R" | "Y"
    permission: "admin" | "member" | "view"
  }>
}

interface AssignUserToBrandModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  assignment: BrandAssignment | null
  users: UserOption[]
  onSave: (assignment: Partial<BrandAssignment>) => void
}

const BRANDS = [
  { id: "warrior-systems" as const, name: "Warrior Systems" },
  { id: "story-marketing" as const, name: "Story Marketing" },
  { id: "meta-gurukul" as const, name: "Meta Gurukul" },
]

const DEPARTMENT_LABELS: Record<UserOption["departments"][number]["code"], string> = {
  M: "Marketing",
  A: "Accounts/Finance",
  S: "Sales",
  T: "Team Tools & SOPs",
  E: "Execution/Ops",
  R: "R&D/Risk",
  Y: "Leadership",
}

export function AssignUserToBrandModal({
  open,
  onOpenChange,
  assignment,
  users,
  onSave,
}: AssignUserToBrandModalProps) {
  const [userId, setUserId] = useState("")
  const [brandId, setBrandId] = useState<"warrior-systems" | "story-marketing" | "meta-gurukul">(
    "warrior-systems",
  )

  useEffect(() => {
    if (assignment) {
      setUserId(assignment.userId)
      setBrandId(assignment.brandId)
    } else {
      resetForm()
    }
  }, [assignment, open])

  const resetForm = () => {
    setUserId("")
    setBrandId("warrior-systems")
  }

  const handleSave = () => {
    const selectedUser = users.find((u) => u.id === userId)
    const selectedBrand = BRANDS.find((b) => b.id === brandId)
    
    console.log("Selected User:", selectedUser);
    console.log("Selected Brand:", selectedBrand);

    if (!selectedUser || !selectedBrand) return

    onSave({
      userId,
      userName: selectedUser.name,
      userEmail: selectedUser.email,
      brandId,
      brandName: selectedBrand.name,
      departments: selectedUser.departments.map((dept) => ({
        code: dept.code,
        name: DEPARTMENT_LABELS[dept.code],
        permission: dept.permission,
      })),
    })
  }

  const canSave = userId && brandId

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{assignment ? "Edit Brand Assignment" : "Assign User to Brand"}</DialogTitle>
          <DialogDescription>
            Select a user, brand, and the departments they should have access to within that brand.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>User</Label>
              <Select value={userId} onValueChange={setUserId} disabled={!!assignment}>
                <SelectTrigger>
                  <SelectValue placeholder="Select user" />
                </SelectTrigger>
                <SelectContent>
                  {users.length === 0 ? (
                    <SelectItem value="no-users" disabled>
                      No users available
                    </SelectItem>
                  ) : (
                    users.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-xs text-gray-600">{user.email}</div>
                        </div>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Brand</Label>
              <Select value={brandId} onValueChange={(v) => setBrandId(v as typeof brandId)} disabled={!!assignment}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BRANDS.map((brand) => (
                    <SelectItem key={brand.id} value={brand.id}>
                      {brand.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3">
            <Label>Departments (from user profile)</Label>
            <div className="space-y-2">
              {(users.find((u) => u.id === userId)?.departments || []).length === 0 ? (
                <div className="rounded-lg border border-dashed p-3 text-sm text-muted-foreground">
                  No departments assigned to this user.
                </div>
              ) : (
                (users.find((u) => u.id === userId)?.departments || []).map((dept) => (
                  <div key={dept.code} className="flex items-center justify-between gap-4 p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">{DEPARTMENT_LABELS[dept.code]}</div>
                    </div>
                    <Badge
                      variant={dept.permission === "admin" ? "default" : dept.permission === "member" ? "secondary" : "outline"}
                      className="text-xs"
                    >
                      {dept.permission}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!canSave} className="bg-blue-600 hover:bg-blue-700">
            {assignment ? "Update Assignment" : "Assign to Brand_1233"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
