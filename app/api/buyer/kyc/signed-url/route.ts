/**
 * GET /api/buyer/kyc/signed-url?doc_id=xxx
 * Génère une signed URL temporaire (5min) pour un document KYC appartenant
 * à l'utilisateur connecté. Bucket privé kyc-documents.
 */
import { NextRequest, NextResponse } from 'next/server'
import { getUser }              from '@/lib/supabaseServer'
import { createServiceClient } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const user = await getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const docId = req.nextUrl.searchParams.get('doc_id')
  if (!docId) return NextResponse.json({ error: 'Missing doc_id' }, { status: 400 })

  const supa = createServiceClient()

  /* Vérifier que le document appartient bien à cet utilisateur */
  const { data: doc, error: docErr } = await supa
    .from('kyc_documents')
    .select('id, file_url')
    .eq('id', docId)
    .eq('user_id', user.id)
    .maybeSingle()

  if (docErr || !doc) {
    return NextResponse.json({ error: 'Document introuvable.' }, { status: 404 })
  }

  if (!doc.file_url) {
    return NextResponse.json({ error: 'Aucun fichier associé.' }, { status: 404 })
  }

  /* Extraire le chemin relatif depuis l'URL complète stockée en DB
   * Format: https://<project>.supabase.co/storage/v1/object/public/kyc-documents/kyc/<uid>/...
   * ou déjà juste le chemin: kyc/<uid>/...
   */
  let storagePath = doc.file_url
  const marker = '/object/public/kyc-documents/'
  const markerPriv = '/object/sign/kyc-documents/'
  if (storagePath.includes(marker)) {
    storagePath = storagePath.split(marker)[1]
  } else if (storagePath.includes(markerPriv)) {
    storagePath = storagePath.split(markerPriv)[1].split('?')[0]
  }

  /* Générer la signed URL — valide 5 minutes */
  const { data, error } = await supa.storage
    .from('kyc-documents')
    .createSignedUrl(storagePath, 300)

  if (error || !data?.signedUrl) {
    console.error('[buyer/kyc/signed-url]', error)
    return NextResponse.json({ error: 'Impossible de générer le lien.' }, { status: 500 })
  }

  return NextResponse.json({ url: data.signedUrl })
}
