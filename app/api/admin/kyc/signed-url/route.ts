/**
 * GET /api/admin/kyc/signed-url?path=kyc/uid/doc_type/file.pdf
 * Génère une signed URL temporaire (60s) pour un document KYC stocké
 * dans le bucket privé kyc-documents. Réservé aux admins.
 */
import { NextRequest, NextResponse } from 'next/server'
import { checkAdminAccess }          from '@/lib/adminAuth'
import { createServiceClient }       from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const token = searchParams.get('token') ?? undefined
  const path  = searchParams.get('path')

  try {
    await checkAdminAccess(token)
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!path) return NextResponse.json({ error: 'Missing path' }, { status: 400 })

  /* Sanity check : le chemin doit commencer par kyc/ */
  if (!path.startsWith('kyc/')) {
    return NextResponse.json({ error: 'Invalid path' }, { status: 400 })
  }

  const supa = createServiceClient()
  const { data, error } = await supa.storage
    .from('kyc-documents')
    .createSignedUrl(path, 60) /* 60 secondes */

  if (error || !data?.signedUrl) {
    console.error('[admin/kyc/signed-url]', error)
    return NextResponse.json({ error: 'Could not generate signed URL' }, { status: 500 })
  }

  return NextResponse.json({ url: data.signedUrl })
}
