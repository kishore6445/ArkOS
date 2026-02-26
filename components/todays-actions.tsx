"use client"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"

type Action = {
  id: string
  title: string
  completed: boolean
  type: "task" | "commitment"
}

interface TodaysActionsProps {
  tasks: any[]
  commitments: any[]
  onToggleTask: (id: string) => void
  onToggleCommitment: (id: string) => void
}

export function TodaysActions({ tasks, commitments, onToggleTask, onToggleCommitment }: TodaysActionsProps) {
  const allActions: Action[] = [
    ...tasks.map((t) => ({
      id: t.id,
      title: t.title,
      completed: t.completed,
      type: "task" as const,
    })),
    ...commitments.map((c) => ({
      id: c.id,
      title: c.title,
      completed: c.completed,
      type: "commitment" as const,
    })),
  ]

  const completedCount = allActions.filter((a) => a.completed).length
  const totalCount = allActions.length

  const handleToggle = (id: string, type: "task" | "commitment") => {
    if (type === "task") {
      onToggleTask(id)
    } else {
      onToggleCommitment(id)
    }
  }

  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden mt-6">
      <div className="px-6 py-5 border-b border-slate-200 bg-slate-50">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-slate-900">Today's Actions</p>
            <p className="text-xs text-slate-500 mt-1">
              {completedCount} of {totalCount} completed
            </p>
          </div>
          {totalCount > 0 && (
            <div className="text-right">
              <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center">
                <p className="text-xs font-bold text-orange-600">{completedCount}/{totalCount}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="divide-y divide-slate-200">
        {totalCount === 0 ? (
          <p className="px-6 py-8 text-sm text-slate-500 text-center">No actions for today</p>
        ) : (
          allActions.map((action) => (
            <div key={`${action.type}-${action.id}`} className="px-6 py-4 flex items-center gap-4 hover:bg-slate-50 transition-colors">
              <Checkbox
                checked={action.completed}
                onCheckedChange={() => handleToggle(action.id, action.type)}
                className="h-5 w-5"
              />
              <div className="flex-1 min-w-0">
                <p
                  className={cn(
                    "text-sm font-semibold text-slate-900",
                    action.completed && "line-through text-slate-400",
                  )}
                >
                  {action.title}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">{action.type === "task" ? "Task" : "Team Commitment"}</p>
              </div>
              <span
                className={cn(
                  "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap",
                  action.completed ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-700",
                )}
              >
                {action.completed ? "Done" : "Pending"}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
