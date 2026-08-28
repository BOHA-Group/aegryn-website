import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { checkAdminAccess } from '@/lib/adminAuth'

type Params = { params: Promise<{ id: string }> }

/**
 * DELETE /api/admin/partners/[id]
 * Retire le rôle 'partner' du profil (ne supprime pas le compte).
 */
export async function DELETE(req: NextRequest, { params }: Params) {
  await checkAdminAccess()
  const { id } = await params

  const supa = createServiceClient()

  const { data: profile, error: fetchErr } = await supa
    .from('profiles')
    .select('roles')
    .eq('id', id)
    .single()

  if (fetchErr || !profile) {
    return NextResponse.json({ error: 'Profil introuvable' }, { status: 404 })
  }

  const roles = (profile.roles as string[] ?? []).filter(r => r !== 'partner')

  const { error } = await supa
    .from('profiles')
    .update({ roles })
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
