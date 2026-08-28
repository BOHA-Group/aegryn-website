import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient }       from '@/lib/supabase'
import { checkAdminAccess }          from '@/lib/adminAuth'

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { searchParams } = new URL(req.url)
  const token = searchParams.get('token') ?? undefined
  await checkAdminAccess(token)

  const { id } = await params
  const numId = parseInt(id, 10)
  if (isNaN(numId)) {
    return NextResponse.json({ error: 'invalid id' }, { status: 400 })
  }

  const supa = createServiceClient()
  const { error } = await supa
    .from('print_wishlist')
    .delete()
    .eq('id', numId)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
