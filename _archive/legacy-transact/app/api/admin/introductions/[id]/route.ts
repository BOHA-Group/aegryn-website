import { NextRequest, NextResponse } from 'next/server'
import { z }                          from 'zod'
import { checkAdminAccess }           from '@/lib/adminAuth'
import { createServiceClient }        from '@/lib/supabase'

const patchSchema = z.object({
  introduction_status: z.enum(['new', 'contacted', 'qualified', 'closed_won', 'closed_lost']).optional(),
  admin_note:          z.string().max(2000).nullable().optional(),
})

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { searchParams } = req.nextUrl
  await checkAdminAccess(searchParams.get('token') ?? undefined)

  const { id } = await params
  const body   = await req.json().catch(() => null)
  const parsed = patchSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })

  const supa = createServiceClient()
  const { error } = await supa
    .from('introductions')
    .update(parsed.data)
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
