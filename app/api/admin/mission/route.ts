import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

type MissionPayload = {
  missionTitle: string
  missionYear: number
  totalTarget: number
  currentTargetAchieved: number
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

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as Partial<MissionPayload>

    if (!payload?.missionTitle || typeof payload.missionYear !== "number" || typeof payload.totalTarget !== "number") {
      return NextResponse.json(
        { error: "missionTitle, missionYear, and totalTarget are required." },
        { status: 400 },
      )
    }

    const supabase = getAdminClient()

    const { data: existing, error: fetchError } = await supabase
      .from("mission")
      .select("id")
      .eq("missionyear", payload.missionYear)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle()

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 400 })
    }

    const row = {
      mission_title: payload.missionTitle,
      missionyear: payload.missionYear,
      total_target: payload.totalTarget,
      current_target_achieved: payload.currentTargetAchieved ?? 0,
      updated_at: new Date().toISOString(),
    }

    if (existing?.id) {
      const { error: updateError } = await supabase
        .from("mission")
        .update(row)
        .eq("id", existing.id)

      if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 400 })
      }

      return NextResponse.json({ id: existing.id }, { status: 200 })
    }

    const { data, error: insertError } = await supabase
      .from("mission")
      .insert(row)
      .select("id")
      .single()

    if (insertError || !data) {
      return NextResponse.json({ error: insertError?.message || "Insert failed." }, { status: 400 })
    }

    return NextResponse.json({ id: data.id }, { status: 200 })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const missionYearParam = searchParams.get("missionYear")
    const missionYear = missionYearParam ? Number(missionYearParam) : null

    if (missionYearParam && Number.isNaN(missionYear)) {
      return NextResponse.json({ error: "missionYear must be a number." }, { status: 400 })
    }

    const supabase = getAdminClient()

    let query = supabase
      .from("mission")
      .select("id, mission_title, missionyear, total_target, current_target_achieved, created_at, updated_at")

    if (missionYear !== null) {
      query = query.eq("missionyear", missionYear)
    }

    const { data, error } = await query.order("created_at", { ascending: false }).limit(1).maybeSingle()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    if (!data) {
      return NextResponse.json({ mission: null }, { status: 200 })
    }

    return NextResponse.json(
      {
        mission: {
          id: data.id,
          missionTitle: data.mission_title,
          missionYear: data.missionyear,
          totalTarget: data.total_target,
          currentTargetAchieved: data.current_target_achieved,
        },
      },
      { status: 200 },
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
