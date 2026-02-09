import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

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

function normalizeJoined<T>(value: T | T[] | null) {
  return Array.isArray(value) ? value[0] : value
}

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("authorization") || ""
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : ""

    if (!token) {
      return NextResponse.json({ error: "Missing access token." }, { status: 401 })
    }

    const supabase = getAdminClient()

    const { data: userData, error: userError } = await supabase.auth.getUser(token)
    if (userError || !userData?.user) {
      return NextResponse.json({ error: "Invalid session." }, { status: 401 })
    }

    const userId = userData.user.id

    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("id, name, email, role, avatar_url")
      .eq("id", userId)
      .single()

    if (profileError || !profile) {
      return NextResponse.json({ error: profileError?.message || "Profile not found." }, { status: 404 })
    }

    const { data: brandAccess, error: brandError } = await supabase
      .from("user_brand_access")
      .select("brands(slug)")
      .eq("user_id", userId)

    if (brandError) {
      return NextResponse.json({ error: brandError.message }, { status: 400 })
    }

    const { data: departmentAccess, error: departmentError } = await supabase
      .from("user_department_access")
      .select("departments(slug)")
      .eq("user_id", userId)

    if (departmentError) {
      return NextResponse.json({ error: departmentError.message }, { status: 400 })
    }

    const brands = (brandAccess || [])
      .map((row) => normalizeJoined(row.brands)?.slug)
      .filter(Boolean)

    const departments = (departmentAccess || [])
      .map((row) => normalizeJoined(row.departments)?.slug)
      .filter(Boolean)

    const assignments = brands.flatMap((brand) =>
      departments.map((department) => ({ brand, department })),
    )

    return NextResponse.json(
      {
        user: {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          avatar: profile.avatar_url || undefined,
          role: profile.role,
          assignments,
        },
      },
      { status: 200 },
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
