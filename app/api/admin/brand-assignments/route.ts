import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

type AssignmentRow = {
  id: string
  user_id: string
  brand_id: string
  created_at: string | null
  users: { name: string; email: string } | { name: string; email: string }[] | null
  brands: { name: string; slug: string } | { name: string; slug: string }[] | null
}

type UserRow = {
  id: string
  name: string
  email: string
}

type BrandRow = {
  id: string
  name: string
  slug: string
}

type CreateAssignmentPayload = {
  userId: string
  brandId: string
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

function normalizeUser(user: AssignmentRow["users"]) {
  return Array.isArray(user) ? user[0] : user
}

function normalizeBrand(brand: AssignmentRow["brands"]) {
  return Array.isArray(brand) ? brand[0] : brand
}

async function hydrateAssignments(
  supabase: ReturnType<typeof getAdminClient>,
  rows: AssignmentRow[],
) {
  const userIds = new Set<string>()
  const brandIds = new Set<string>()

  rows.forEach((row) => {
    const user = normalizeUser(row.users)
    const brand = normalizeBrand(row.brands)
    if (!user?.name || !user?.email) {
      userIds.add(row.user_id)
    }
    if (!brand?.name || !brand?.slug) {
      brandIds.add(row.brand_id)
    }
  })

  const [userResult, brandResult] = await Promise.all([
    userIds.size > 0
      ? supabase.from("users").select("id, name, email").in("id", Array.from(userIds))
      : Promise.resolve({ data: [] as UserRow[], error: null }),
    brandIds.size > 0
      ? supabase.from("brands").select("id, name, slug").in("id", Array.from(brandIds))
      : Promise.resolve({ data: [] as BrandRow[], error: null }),
  ])

  const userMap = new Map((userResult.data || []).map((user) => [user.id, user]))
  const brandMap = new Map((brandResult.data || []).map((brand) => [brand.id, brand]))

  return rows.map((row) => {
    const joinedUser = normalizeUser(row.users)
    const joinedBrand = normalizeBrand(row.brands)
    const user = joinedUser?.name && joinedUser?.email ? joinedUser : userMap.get(row.user_id)
    const brand = joinedBrand?.name && joinedBrand?.slug ? joinedBrand : brandMap.get(row.brand_id)

    return {
      id: row.id,
      userId: row.user_id,
      userName: user?.name || "",
      userEmail: user?.email || "",
      brandId: brand?.slug || "",
      brandName: brand?.name || "",
      departments: [],
      createdAt: row.created_at ? new Date(row.created_at).toISOString().split("T")[0] : "",
    }
  })
}

export async function GET() {
  try {
    const supabase = getAdminClient()

    const { data, error } = await supabase
      .from("user_brand_access")
      .select("id, user_id, brand_id, created_at, users(name, email), brands(name, slug)")
      .order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    const assignments = await hydrateAssignments(supabase, (data || []) as AssignmentRow[])
    return NextResponse.json({ assignments }, { status: 200 })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as CreateAssignmentPayload

    if (!payload?.userId || !payload?.brandId) {
      return NextResponse.json({ error: "User and brand are required." }, { status: 400 })
    }

    const supabase = getAdminClient()

    const { data: brand, error: brandError } = await supabase
      .from("brands")
      .select("id, name, slug")
      .eq("slug", payload.brandId)
      .maybeSingle()

    if (brandError || !brand) {
      return NextResponse.json({ error: brandError?.message || "Brand not found." }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("user_brand_access")
      .insert({ user_id: payload.userId, brand_id: brand.id })
      .select("id, user_id, brand_id, created_at, users(name, email), brands(name, slug)")
      .single()

    if (error || !data) {
      return NextResponse.json({ error: error?.message || "Unable to assign brand." }, { status: 400 })
    }

    const [assignment] = await hydrateAssignments(supabase, [data as AssignmentRow])
    return NextResponse.json({ assignment }, { status: 200 })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const payload = (await request.json()) as { id?: string }

    if (!payload?.id) {
      return NextResponse.json({ error: "Assignment id is required." }, { status: 400 })
    }

    const supabase = getAdminClient()

    const { data, error } = await supabase
      .from("user_brand_access")
      .select("id, user_id, brand_id, created_at, users(name, email), brands(name, slug)")
      .eq("id", payload.id)
      .single()

    if (error || !data) {
      return NextResponse.json({ error: error?.message || "Assignment not found." }, { status: 400 })
    }

    const [assignment] = await hydrateAssignments(supabase, [data as AssignmentRow])
    return NextResponse.json({ assignment }, { status: 200 })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url)
    const id = url.searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Assignment id is required." }, { status: 400 })
    }

    const supabase = getAdminClient()

    const { error } = await supabase.from("user_brand_access").delete().eq("id", id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
