import { NextRequest, NextResponse } from 'next/server'
import { getUser }              from '@/lib/supabaseServer'
import { createServiceClient } from '@/lib/supabase'

const MAX_SIZE = 5 * 1024 * 1024

export async function POST(req: NextRequest) {
  const user = await getUser()
  if (!user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })

  const form = await req.formData().catch(() => null)
  if (!form) return NextResponse.json({ error: 'invalid_form' }, { status: 400 })

  const file = form.get('file') as File | null
  if (!file) return NextResponse.json({ error: 'missing_file' }, { status: 400 })
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type))
    return NextResponse.json({ error: 'invalid_type' }, { status: 400 })
  if (file.size > MAX_SIZE)
    return NextResponse.json({ error: 'file_too_large' }, { status: 413 })

  const supa  = createServiceClient()
  const ext   = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg'
  const path  = `avatars/${user.id}.${ext}`
  const buffer = Buffer.from(await file.arrayBuffer())

  const { error: uploadError } = await supa.storage
    .from('kyc-documents')
    .upload(path, buffer, { contentType: file.type, upsert: true })

  if (uploadError) {
    console.error('[experts/avatar]', uploadError)
    return NextResponse.json({ error: 'upload_failed' }, { status: 500 })
  }

  const { data: { publicUrl } } = supa.storage.from('kyc-documents').getPublicUrl(path)

  /* Persister l'url sur expert_profiles si la fiche existe */
  await supa.from('expert_profiles')
    .update({ avatar_url: publicUrl })
    .eq('user_id', user.id)

  return NextResponse.json({ url: publicUrl })
}
