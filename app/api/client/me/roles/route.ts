import { NextResponse }        from 'next/server'
import { getUser }             from '@/lib/supabaseServer'
import { createServiceClient } from '@/lib/supabase'

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
