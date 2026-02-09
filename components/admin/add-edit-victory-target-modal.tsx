"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type VictoryTarget = {
  id: string
  brandId?: string
  department: "M" | "A" | "S" | "T" | "E" | "R" | "Y"
  title: string
  target: number
  achieved: number
  unit: string
  deadline: string
  owner: string
  ownerId?: string
  status: "on-track" | "at-risk" | "critical"
}

type VictoryTargetFormData = {
  brandId: string
  department: VictoryTarget["department"]
  title: string
  target: number
  achieved: number
  unit: string
  deadline: string
  owner: string
  ownerId?: string
  status: VictoryTarget["status"]
}

interface AddEditVictoryTargetModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  target: VictoryTarget | null
  onSave: (data: Partial<VictoryTarget>) => void
}

export function AddEditVictoryTargetModal({ open, onOpenChange, target, onSave }: AddEditVictoryTargetModalProps) {
  const [formData, setFormData] = useState<VictoryTargetFormData>({
    brandId: "warrior-systems",
    department: "M",
    title: "",
    target: 0,
    achieved: 0,
    unit: "clients",
    deadline: "",
    owner: "Department",
    ownerId: undefined,
    status: "on-track",
  })

  useEffect(() => {
    if (target) {
      setFormData({
        brandId: target.brandId || "warrior-systems",
        department: target.department,
        title: target.title,
        target: target.target,
        achieved: target.achieved,
        unit: target.unit,
        deadline: target.deadline,
        owner: target.owner || "Department",
        ownerId: target.ownerId,
        status: target.status,
      })
    } else {
      setFormData({
        brandId: "warrior-systems",
        department: "M",
        title: "",
        target: 0,
        achieved: 0,
        unit: "clients",
        deadline: "",
        owner: "Department",
        ownerId: undefined,
        status: "on-track",
      })
    }
  }, [target, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{target ? "Edit Victory Target" : "Add Victory Target"}</DialogTitle>
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
            <p className="text-sm text-gray-500">Select which brand this Victory Target belongs to</p>
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Victory Target Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Qualified Conversations Touched"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="target">Target Number</Label>
              <Input
                id="target"
                type="number"
                value={formData.target}
                onChange={(e) => setFormData({ ...formData, target: Number(e.target.value) })}
                placeholder="1500"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit">Unit</Label>
              <Input
                id="unit"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                placeholder="clients"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="achieved">Current Achievement_test</Label>
            <Input
              id="achieved"
              type="number"
              value={formData.achieved}
              onChange={(e) => setFormData({ ...formData, achieved: Number(e.target.value) })}
              placeholder="420"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="deadline">Deadline</Label>
              <Input
                id="deadline"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                placeholder="Dec 31, 2026"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: any) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="on-track">On Track</SelectItem>
                  <SelectItem value="at-risk">At Risk</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              {target ? "Update" : "Create"} Victory Target
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
