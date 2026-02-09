import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

type CreatePayload = {
  employeeId: string
  personalTargetName: string
  quarter: "Q1" | "Q2" | "Q3" | "Q4"
  goalType: "Quantitative" | "Qualitative" | "Learning"
  targetValue: number
  currentValue?: number
  status?: "On Track" | "At Risk" | "Behind"
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

function getAdminClient() {
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing Supabase service role credentials")
  }
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

function getStatus(currentValue: number, targetValue: number) {
  if (targetValue <= 0) return "Behind"
  const progress = (currentValue / targetValue) * 100
  if (progress >= 70) return "On Track"
  if (progress >= 50) return "At Risk"
  return "Behind"
}

export async function GET() {
  try {
    const supabase = getAdminClient()

    const { data, error } = await supabase
      .from("personal_victory_targets")
      .select("id, employee_id, personal_target_name, quarter, goal_type, target_value, current_value, status, created_at")
      .order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    const targets = (data || []).map((row) => ({
      id: row.id,
      employeeId: row.employee_id,
      personalTargetName: row.personal_target_name,
      quarter: row.quarter,
      goalType: row.goal_type,
      targetValue: row.target_value,
      currentValue: row.current_value,
      status: row.status,
      createdAt: row.created_at,
    }))

    return NextResponse.json({ targets }, { status: 200 })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as Partial<CreatePayload>

    if (
      !payload?.employeeId ||
      !payload?.personalTargetName ||
      !payload?.quarter ||
      !payload?.goalType ||
      typeof payload.targetValue !== "number"
    ) {
      return NextResponse.json(
        { error: "employeeId, personalTargetName, quarter, goalType, and targetValue are required." },
        { status: 400 },
      )
    }

    const currentValue = typeof payload.currentValue === "number" ? payload.currentValue : 0
    const status = payload.status ?? getStatus(currentValue, payload.targetValue)

    const supabase = getAdminClient()

    const { data, error } = await supabase
      .from("personal_victory_targets")
      .insert({
        employee_id: payload.employeeId,
        personal_target_name: payload.personalTargetName,
        quarter: payload.quarter,
        goal_type: payload.goalType,
        target_value: payload.targetValue,
        current_value: currentValue,
        status,
      })
      .select("id, employee_id, personal_target_name, quarter, goal_type, target_value, current_value, status, created_at")
      .single()

    if (error || !data) {
      return NextResponse.json({ error: error?.message || "Insert failed." }, { status: 400 })
    }

    return NextResponse.json(
      {
        target: {
          id: data.id,
          employeeId: data.employee_id,
          personalTargetName: data.personal_target_name,
          quarter: data.quarter,
          goalType: data.goal_type,
          targetValue: data.target_value,
          currentValue: data.current_value,
          status: data.status,
          createdAt: data.created_at,
        },
      },
      { status: 200 },
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const payload = (await request.json()) as Partial<CreatePayload> & { id?: string }

    if (!payload?.id) {
      return NextResponse.json({ error: "id is required." }, { status: 400 })
    }

    const updateRow: Record<string, unknown> = {}

    if (payload.employeeId) updateRow.employee_id = payload.employeeId
    if (payload.personalTargetName) updateRow.personal_target_name = payload.personalTargetName
    if (payload.quarter) updateRow.quarter = payload.quarter
    if (payload.goalType) updateRow.goal_type = payload.goalType
    if (typeof payload.targetValue === "number") updateRow.target_value = payload.targetValue
    if (typeof payload.currentValue === "number") updateRow.current_value = payload.currentValue

    const targetValue = typeof payload.targetValue === "number" ? payload.targetValue : null
    const currentValue = typeof payload.currentValue === "number" ? payload.currentValue : null

    if (!payload.status && targetValue !== null && currentValue !== null) {
      updateRow.status = getStatus(currentValue, targetValue)
    } else if (payload.status) {
      updateRow.status = payload.status
    }

    const supabase = getAdminClient()

    const { data, error } = await supabase
      .from("personal_victory_targets")
      .update(updateRow)
      .eq("id", payload.id)
      .select("id, employee_id, personal_target_name, quarter, goal_type, target_value, current_value, status, created_at")
      .single()

    if (error || !data) {
      return NextResponse.json({ error: error?.message || "Update failed." }, { status: 400 })
    }

    return NextResponse.json(
      {
        target: {
          id: data.id,
          employeeId: data.employee_id,
          personalTargetName: data.personal_target_name,
          quarter: data.quarter,
          goalType: data.goal_type,
          targetValue: data.target_value,
          currentValue: data.current_value,
          status: data.status,
          createdAt: data.created_at,
        },
      },
      { status: 200 },
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const payload = (await request.json()) as { id?: string }

    if (!payload?.id) {
      return NextResponse.json({ error: "id is required." }, { status: 400 })
    }

    const supabase = getAdminClient()
    const { error } = await supabase.from("personal_victory_targets").delete().eq("id", payload.id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
