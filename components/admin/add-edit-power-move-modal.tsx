"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type PowerMove = {
  id: string
  brandId: string
  department: "M" | "A" | "S" | "T" | "E" | "R" | "Y"
  name: string
  frequency: "daily" | "weekly" | "monthly"
  weeklyTarget: number
  owner: string
  ownerId?: string
  linkedVictoryTargetId?: string
  linkedVictoryTargetTitle: string
}

type UserOption = {
  id: string
  name: string
  email: string
  role?: string
  departments?: Array<{ code: PowerMove["department"]; permission: "admin" | "member" | "view" }>
}

type VictoryTargetOption = {
  id: string
  title: string
  owner?: string
  ownerId?: string
  brandId?: string
  department?: "M" | "A" | "S" | "T" | "E" | "R" | "Y"
}

interface AddEditPowerMoveModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  powerMove: PowerMove | null
  onSave: (data: Partial<PowerMove>) => void
}

export function AddEditPowerMoveModal({ open, onOpenChange, powerMove, onSave }: AddEditPowerMoveModalProps) {
  const [formData, setFormData] = useState({
    brandId: "warrior-systems" as const,
    department: "M" as const,
    name: "",
    frequency: "weekly" as const,
    weeklyTarget: 0,
    owner: "",
    ownerId: undefined as string | undefined,
    linkedVictoryTargetId: undefined as string | undefined,
    linkedVictoryTargetTitle: "",
  })
  const [users, setUsers] = useState<UserOption[]>([])
  const [victoryTargets, setVictoryTargets] = useState<VictoryTargetOption[]>([])
  const [isLoadingUsers, setIsLoadingUsers] = useState(false)
  const [isLoadingTargets, setIsLoadingTargets] = useState(false)
  const [usersError, setUsersError] = useState<string | null>(null)
  const [targetsError, setTargetsError] = useState<string | null>(null)

  useEffect(() => {
    if (powerMove) {
      setFormData({
        brandId: powerMove.brandId,
        department: powerMove.department,
        name: powerMove.name,
        frequency: powerMove.frequency,
        weeklyTarget: powerMove.weeklyTarget,
        owner: powerMove.owner,
        ownerId: powerMove.ownerId,
        linkedVictoryTargetId: powerMove.linkedVictoryTargetId,
        linkedVictoryTargetTitle: powerMove.linkedVictoryTargetTitle,
      })
    } else {
      setFormData({
        brandId: "warrior-systems",
        department: "M",
        name: "",
        frequency: "weekly",
        weeklyTarget: 0,
        owner: "",
        ownerId: undefined,
        linkedVictoryTargetId: undefined,
        linkedVictoryTargetTitle: "",
      })
    }
  }, [powerMove, open])

  const filteredVictoryTargets = victoryTargets.filter((target) => {
    const matchesBrand = target.brandId ? target.brandId === formData.brandId : true
    const matchesDepartment = target.department ? target.department === formData.department : true
    return matchesBrand && matchesDepartment
  })

  const availableOwners = users.filter((user) => user.departments?.some((dept) => dept.code === formData.department))

  useEffect(() => {
    if (!formData.linkedVictoryTargetId) return
    const stillValid = filteredVictoryTargets.some((target) => target.id === formData.linkedVictoryTargetId)
    if (!stillValid) {
      setFormData((prev) => ({ ...prev, linkedVictoryTargetId: undefined, linkedVictoryTargetTitle: "" }))
    }
  }, [filteredVictoryTargets, formData.linkedVictoryTargetId])

  useEffect(() => {
    if (!open) return

    const loadUsers = async () => {
      setIsLoadingUsers(true)
      setUsersError(null)
      try {
        const response = await fetch("/api/admin/users", { cache: "no-store" })
        const result = await response.json()
        if (!response.ok) {
          setUsersError(result?.error || "Unable to load users.")
          setUsers([])
          return
        }

        if (Array.isArray(result.users)) {
          setUsers(result.users)
        } else {
          setUsers([])
        }
      } catch (error) {
        setUsersError(error instanceof Error ? error.message : "Unable to load users.")
        setUsers([])
      } finally {
        setIsLoadingUsers(false)
      }
    }

    const loadTargets = async () => {
      setIsLoadingTargets(true)
      setTargetsError(null)
      try {
        const response = await fetch("/api/admin/victory-targets", { cache: "no-store" })
        const result = await response.json()
        if (!response.ok) {
          setTargetsError(result?.error || "Unable to load victory targets.")
          setVictoryTargets([])
          return
        }

        if (Array.isArray(result.targets)) {
          setVictoryTargets(
            result.targets.map((target) => ({
              id: target.id,
              title: target.title,
              owner: target.owner,
              ownerId: target.ownerId,
              brandId: target.brandId,
              department: target.department,
            })),
          )
        } else {
          setVictoryTargets([])
        }
      } catch (error) {
        setTargetsError(error instanceof Error ? error.message : "Unable to load victory targets.")
        setVictoryTargets([])
      } finally {
        setIsLoadingTargets(false)
      }
    }

    loadUsers()
    loadTargets()
  }, [open])

  useEffect(() => {
    if (!formData.ownerId) return
    const stillValid = availableOwners.some((user) => user.id === formData.ownerId)
    if (!stillValid) {
      setFormData((prev) => ({ ...prev, owner: "", ownerId: undefined }))
    }
  }, [availableOwners, formData.ownerId])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{powerMove ? "Edit Power Move" : "Add Power Move"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="brand">Brand</Label>
            <Select value={formData.brandId} onValueChange={(value) => setFormData({ ...formData, brandId: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="warrior-systems">The Warrior Systems</SelectItem>
                <SelectItem value="story-marketing">Story Marketing</SelectItem>
                <SelectItem value="meta-gurukul">Meta Gurukul</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-gray-500">Select which brand this Power Move belongs to</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Select
                value={formData.department}
                onValueChange={(value: any) => setFormData({ ...formData, department: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["M", "A", "S", "T", "E", "R", "Y"].map((code) => (
                    <SelectItem key={code} value={code}>
                      {code === "M"
                        ? "Marketing"
                        : code === "A"
                          ? "Accounts/Finance"
                          : code === "S"
                            ? "Sales"
                            : code === "T"
                              ? "Team Tools & SOPs"
                              : code === "E"
                                ? "Execution/Ops"
                                : code === "R"
                                  ? "R&D/Risk"
                                  : "Leadership"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="owner">Owner</Label>
              <Select
                value={formData.ownerId || ""}
                onValueChange={(value) => {
                  const selectedUser = availableOwners.find((user) => user.id === value)
                  setFormData({
                    ...formData,
                    ownerId: value,
                    owner: selectedUser?.name || "",
                  })
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder={isLoadingUsers ? "Loading users..." : "Select owner"} />
                </SelectTrigger>
                <SelectContent>
                  {availableOwners.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {usersError ? <p className="text-sm text-rose-600">{usersError}</p> : null}
              {!usersError && availableOwners.length === 0 ? (
                <p className="text-xs text-gray-500">No owners assigned to this department.</p>
              ) : null}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Power Move Name (Lead Measure)</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Client Discovery Calls"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="frequency">Frequency</Label>
              <Select
                value={formData.frequency}
                onValueChange={(value: "daily" | "weekly" | "monthly") =>
                  setFormData({ ...formData, frequency: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="weeklyTarget">Weekly Target</Label>
              <Input
                id="weeklyTarget"
                type="number"
                value={formData.weeklyTarget}
                onChange={(e) => setFormData({ ...formData, weeklyTarget: Number(e.target.value) })}
                placeholder="10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="linkedVictoryTarget">Linked Victory Target</Label>
            {filteredVictoryTargets.length > 0 ? (
              <Select
                value={formData.linkedVictoryTargetId || ""}
                onValueChange={(value) => {
                  const selectedTarget = victoryTargets.find((target) => target.id === value)
                  setFormData({
                    ...formData,
                    linkedVictoryTargetId: value,
                    linkedVictoryTargetTitle: selectedTarget?.title || "",
                  })
                }}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={isLoadingTargets ? "Loading victory targets..." : "Select victory target"}
                  />
                </SelectTrigger>
                <SelectContent>
                  {filteredVictoryTargets.map((target) => (
                    <SelectItem key={target.id} value={target.id}>
                      {target.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <p className="text-sm text-gray-500">No victory targets found for the selected department.</p>
            )}
            {targetsError ? <p className="text-sm text-rose-600">{targetsError}</p> : null}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              <strong>Lead Measure:</strong> This Power Move should be predictive and influenceable. When warriors
              complete this activity consistently, it should drive progress toward the linked Victory Target.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              {powerMove ? "Update" : "Create"} Power Move
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
