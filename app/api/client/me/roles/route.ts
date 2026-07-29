import { NextRequest, NextResponse } from 'next/server'
import { getUser }                   from '@/lib/supabaseServer'
import { createServiceClient }       from '@/lib/supabase'

const ACTIVATABLE_ROLES = ['buyer', 'seller', 'partner'] as const
type ActivatableRole = typeof ACTIVATABLE_ROLES[number]

export async function GET() {
  const user = await getUser()
  if (!user) return NextResponse.json({ roles: [] }, { status: 401 })

  const supa = createServiceClient()
  const { data } = await supa
    .from('profiles')
    .select('roles')
    .eq('id', user.id)
    .single()

  const roles = (data?.roles ?? []) as string[]
  return NextResponse.json({ roles })
}

/** Activer un profil supplémentaire (buyer, seller, partner) */
export async function POST(req: NextRequest) {
  const user = await getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json() as { role?: string }
  const role = body.role as ActivatableRole | undefined

  if (!role || !ACTIVATABLE_ROLES.includes(role)) {
    return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
  }

  const supa = createServiceClient()
  const { data: profile } = await supa
    .from('profiles')
    .select('roles')
    .eq('id', user.id)
    .single()

  const current: string[] = Array.isArray(profile?.roles) ? profile.roles : []

  if (current.includes(role)) {
    return NextResponse.json({ roles: current })
  }

  const updated = [...current, role]
  const { error } = await supa
    .from('profiles')
    .update({ roles: updated })
    .eq('id', user.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ roles: updated })
}
