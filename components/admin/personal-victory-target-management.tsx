"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, MoreVertical } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

type PersonalTarget = {
  id: string
  employeeId: string
  personalTargetName: string
  quarter: "Q1" | "Q2" | "Q3" | "Q4"
  targetValue: number
  currentValue: number
  status: "On Track" | "At Risk" | "Behind"
  goalType: "Quantitative" | "Qualitative" | "Learning"
  createdAt: string
}

type UserOption = {
  id: string
  name: string
  email: string
}

export function PersonalVictoryTargetManagement() {
  const [personalTargets, setPersonalTargets] = useState<PersonalTarget[]>([])
  const [users, setUsers] = useState<UserOption[]>([])
  const [usersError, setUsersError] = useState<string | null>(null)
  const [personalTargetsError, setPersonalTargetsError] = useState<string | null>(null)
  const [isLoadingUsers, setIsLoadingUsers] = useState(false)
  const [isLoadingPersonalTargets, setIsLoadingPersonalTargets] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const [selectedQuarter, setSelectedQuarter] = useState("Q1")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedEmployee, setSelectedEmployee] = useState("")
  const [selectedGoalType, setSelectedGoalType] = useState<"Quantitative" | "Qualitative" | "Learning">("Quantitative")
  const [personalTargetNameInput, setPersonalTargetNameInput] = useState("")
  const [targetValueInput, setTargetValueInput] = useState("")
  const [error, setError] = useState("")

  const employeeMap = new Map(users.map((user) => [user.id, user.name]))
  const enrichedTargets = personalTargets.map((target) => ({
    ...target,
    employeeName: employeeMap.get(target.employeeId) || "Unknown",
  }))

  const filteredTargets = enrichedTargets.filter((target) => {
    const matchesQuarter = target.quarter === selectedQuarter
    const matchesSearch =
      target.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      target.personalTargetName.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesQuarter && matchesSearch
  })

  useEffect(() => {
    let isActive = true

    const loadData = async () => {
      setIsLoadingUsers(true)
      setIsLoadingPersonalTargets(true)
      setUsersError(null)
      setPersonalTargetsError(null)

      try {
        const [usersResponse, personalResponse] = await Promise.all([
          fetch("/api/admin/users", { cache: "no-store" }),
          fetch("/api/admin/personal-victory-targets", { cache: "no-store" }),
        ])

        const usersResult = await usersResponse.json().catch(() => ({}))
        const personalResult = await personalResponse.json().catch(() => ({}))

        if (!isActive) return

        if (!usersResponse.ok) {
          throw new Error(usersResult?.error || "Unable to load users.")
        }

        if (!personalResponse.ok) {
          throw new Error(personalResult?.error || "Unable to load personal targets.")
        }

        setUsers(
          Array.isArray(usersResult.users)
            ? usersResult.users.map((user: UserOption) => ({
                id: user.id,
                name: user.name,
                email: user.email,
              }))
            : [],
        )

        setPersonalTargets(
          Array.isArray(personalResult.targets)
            ? personalResult.targets.map((target: PersonalTarget) => ({
                id: target.id,
                employeeId: target.employeeId,
                personalTargetName: target.personalTargetName,
                quarter: target.quarter,
                targetValue: target.targetValue,
                currentValue: target.currentValue,
                status: target.status,
                goalType: target.goalType,
                createdAt: target.createdAt,
              }))
            : [],
        )
      } catch (err) {
        if (!isActive) return
        const message = err instanceof Error ? err.message : "Unable to load data."
        setUsersError(message)
        setPersonalTargetsError(message)
        setUsers([])
        setPersonalTargets([])
      } finally {
        if (!isActive) return
        setIsLoadingUsers(false)
        setIsLoadingPersonalTargets(false)
      }
    }

    loadData()

    return () => {
      isActive = false
    }
  }, [])


  const resetDialog = () => {
    setSelectedEmployee("")
    setSelectedGoalType("Quantitative")
    setPersonalTargetNameInput("")
    setTargetValueInput("")
    setError("")
  }

  const handleAddTarget = async () => {
    if (!selectedEmployee) {
      setError("Please select an employee first")
      return
    }

    if (!personalTargetNameInput.trim()) {
      setError("Please enter a target name")
      return
    }

    const targetValue = selectedGoalType === "Qualitative" ? 0 : Number(targetValueInput)
    if (selectedGoalType !== "Qualitative" && (Number.isNaN(targetValue) || targetValue <= 0)) {
      setError("Please enter a valid target value")
      return
    }

    // Check if employee already has 2 targets for this quarter
    const employeeTargetsThisQuarter = personalTargets.filter(
      (t) => t.employeeId === selectedEmployee && t.quarter === selectedQuarter
    )

    if (employeeTargetsThisQuarter.length >= 2) {
      const employeeName = employeeMap.get(selectedEmployee) || "This employee"
      setError(`${employeeName} already has 2 targets for ${selectedQuarter}`)
      setTimeout(() => setError(""), 3000)
      return
    }

    try {
      const response = await fetch("/api/admin/personal-victory-targets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employeeId: selectedEmployee,
          personalTargetName: personalTargetNameInput.trim(),
          quarter: selectedQuarter,
          goalType: selectedGoalType,
          targetValue,
          currentValue: 0,
        }),
      })

      const result = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(result?.error || "Unable to save target.")
      }

      if (result?.target) {
        setPersonalTargets((prev) => [result.target as PersonalTarget, ...prev])
      }

      setIsDialogOpen(false)
      resetDialog()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save target.")
    }
  }

  const handleDeleteTarget = async (id: string) => {
    try {
      const response = await fetch("/api/admin/personal-victory-targets", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })

      const result = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(result?.error || "Unable to delete target.")
      }

      setPersonalTargets((prev) => prev.filter((t) => t.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete target.")
    }
  }

  const handleUpdateTarget = async (id: string, updates: Partial<PersonalTarget>) => {
    try {
      const response = await fetch("/api/admin/personal-victory-targets", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...updates }),
      })

      const result = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(result?.error || "Unable to update target.")
      }

      if (result?.target) {
        setPersonalTargets((prev) => prev.map((t) => (t.id === id ? { ...t, ...result.target } : t)))
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update target.")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "On Track":
        return "bg-green-100 text-green-800"
      case "At Risk":
        return "bg-amber-100 text-amber-800"
      case "Behind":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getProgressPercentage = (current: number, target: number) => {
    if (target === 0) return 0
    return Math.round((current / target) * 100)
  }

  const getGoalTypeColor = (goalType: string) => {
    switch (goalType) {
      case "Quantitative":
        return "bg-blue-100 text-blue-800"
      case "Qualitative":
        return "bg-amber-100 text-amber-800"
      case "Learning":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Personal Victory Targets</h1>
          <p className="text-gray-600">
            Assign quarterly targets to individuals. Each employee's Power Moves roll up to these targets.
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700 gap-2">
          <Plus className="w-4 h-4" />
          Add Personal Target
        </Button>
      </div>

      <div className="flex gap-4 items-center">
        <div className="flex gap-2">
          {(["Q1", "Q2", "Q3", "Q4"] as const).map((quarter) => (
            <Button
              key={quarter}
              variant={selectedQuarter === quarter ? "default" : "outline"}
              onClick={() => setSelectedQuarter(quarter)}
              className={selectedQuarter === quarter ? "bg-blue-600" : ""}
            >
              {quarter}
            </Button>
          ))}
        </div>
        <Input
          placeholder="Search employee or target..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-xs"
        />
      </div>

      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        setIsDialogOpen(open)
        if (!open) resetDialog()
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Personal Victory Target</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Employee</label>
              <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                <SelectTrigger>
                  <SelectValue placeholder={isLoadingUsers ? "Loading employees..." : "Choose an employee"} />
                </SelectTrigger>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name} ({user.email}) ({personalTargets.filter((t) => t.employeeId === user.id && t.quarter === selectedQuarter).length}/2 targets for {selectedQuarter})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {usersError ? <p className="text-xs text-red-600 mt-2">{usersError}</p> : null}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Quarter</label>
                <Select value={selectedQuarter} onValueChange={setSelectedQuarter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(["Q1", "Q2", "Q3", "Q4"] as const).map((quarter) => (
                      <SelectItem key={quarter} value={quarter}>{quarter}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Goal Type</label>
                <Select value={selectedGoalType} onValueChange={(value) => setSelectedGoalType(value as "Quantitative" | "Qualitative" | "Learning")}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Quantitative">Quantitative (Measurable)</SelectItem>
                    <SelectItem value="Qualitative">Qualitative (Observable)</SelectItem>
                    <SelectItem value="Learning">Learning (Development)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Target Name</label>
              <Input
                value={personalTargetNameInput}
                onChange={(e) => setPersonalTargetNameInput(e.target.value)}
                placeholder="e.g., Improve onboarding speed"
              />
            </div>
            {selectedGoalType !== "Qualitative" ? (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Target Value</label>
                <Input
                  type="number"
                  value={targetValueInput}
                  onChange={(e) => setTargetValueInput(e.target.value)}
                  placeholder="0"
                />
              </div>
            ) : null}
            {error && <p className="text-red-600 text-sm font-semibold">{error}</p>}
            <p className="text-xs text-gray-600">Each employee can have up to 2 targets per quarter</p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddTarget} className="bg-blue-600 hover:bg-blue-700">
                Save Target
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>Employee</TableHead>
              <TableHead>Target Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Target</TableHead>
              <TableHead className="text-right">Current</TableHead>
              <TableHead className="text-right">Progress</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTargets.map((target) => (
              <TableRow key={target.id} className="hover:bg-gray-50">
                <TableCell className="font-medium">{target.employeeName}</TableCell>
                <TableCell>
                  <div className="max-w-xs">
                    <p className="font-medium text-sm">{target.personalTargetName}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getGoalTypeColor(target.goalType)}>{target.goalType}</Badge>
                </TableCell>
                <TableCell className="text-right font-mono font-semibold">{target.targetValue}</TableCell>
                <TableCell className="text-right font-mono">{target.currentValue}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${getProgressPercentage(target.currentValue, target.targetValue)}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-gray-700 w-10 text-right">
                      {getProgressPercentage(target.currentValue, target.targetValue)}%
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(target.status)}>{target.status}</Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => {
                          const newValue = prompt("Enter current value:", target.currentValue.toString())
                          if (newValue) {
                            const parsedValue = parseInt(newValue)
                            let status: "On Track" | "At Risk" | "Behind" = "Behind"
                            const progress = (parsedValue / target.targetValue) * 100
                            if (progress >= 70) status = "On Track"
                            else if (progress >= 50) status = "At Risk"

                            handleUpdateTarget(target.id, {
                              currentValue: parsedValue,
                              status,
                            })
                          }
                        }}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Update Value
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDeleteTarget(target.id)}
                        className="text-red-600 focus:text-red-600"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredTargets.length === 0 && !isLoadingPersonalTargets && (
        <div className="text-center py-12">
          <p className="text-gray-500">No personal targets for {selectedQuarter}. Create one to get started.</p>
        </div>
      )}

      {personalTargetsError && (
        <div className="text-center py-4">
          <p className="text-sm text-red-600">{personalTargetsError}</p>
        </div>
      )}

      <div className="grid grid-cols-3 gap-4 mt-8">
        <div className="border rounded-lg p-6 bg-green-50">
          <p className="text-sm text-green-700 font-semibold mb-2">On Track</p>
          <p className="text-3xl font-bold text-green-900">
            {filteredTargets.filter((t) => t.status === "On Track").length}
          </p>
        </div>
        <div className="border rounded-lg p-6 bg-amber-50">
          <p className="text-sm text-amber-700 font-semibold mb-2">At Risk</p>
          <p className="text-3xl font-bold text-amber-900">
            {filteredTargets.filter((t) => t.status === "At Risk").length}
          </p>
        </div>
        <div className="border rounded-lg p-6 bg-red-50">
          <p className="text-sm text-red-700 font-semibold mb-2">Behind</p>
          <p className="text-3xl font-bold text-red-900">
            {filteredTargets.filter((t) => t.status === "Behind").length}
          </p>
        </div>
      </div>
    </div>
  )
}
