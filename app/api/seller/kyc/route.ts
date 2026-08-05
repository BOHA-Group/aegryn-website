/**
 * POST /api/seller/kyc — upload d'un document KYC par un cédant.
 * Identique à /api/buyer/kyc mais avec label "Cédant" dans la notif admin.
 */
import { NextRequest, NextResponse } from 'next/server'
import { getUser }                   from '@/lib/supabaseServer'
import { createServiceClient }       from '@/lib/supabase'
import { sendEmail, emailKycDocSubmitted } from '@/lib/sendEmail'

const ALLOWED_TYPES = [
  'id_card', 'proof_of_address', 'kbis', 'articles_of_association',
  'director_id', 'ubo', 'asset_ownership', 'professional_insurance',
]
const MAX_SIZE_BYTES = 10 * 1024 * 1024

export async function POST(req: NextRequest) {
  const user = await getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const form = await req.formData().catch(() => null)
  if (!form) return NextResponse.json({ error: 'Invalid form data' }, { status: 400 })

  const file    = form.get('file') as File | null
  const docType = form.get('doc_type') as string | null

  if (!file || !docType) return NextResponse.json({ error: 'Missing file or doc_type' }, { status: 400 })
  if (!ALLOWED_TYPES.includes(docType)) return NextResponse.json({ error: 'Invalid doc_type' }, { status: 400 })
  if (file.size > MAX_SIZE_BYTES) return NextResponse.json({ error: 'File too large (max 10 MB)' }, { status: 413 })

  const supa   = createServiceClient()
  const ext    = file.name.split('.').pop() ?? 'bin'
  const path   = `kyc/${user.id}/${docType}/${Date.now()}.${ext}`
  const buffer = Buffer.from(await file.arrayBuffer())

  const { error: uploadError } = await supa.storage
    .from('kyc-documents')
    .upload(path, buffer, { contentType: file.type, upsert: false })

  if (uploadError) return NextResponse.json({ error: 'Upload failed' }, { status: 500 })

  const { data: { publicUrl } } = supa.storage.from('kyc-documents').getPublicUrl(path)

  const { data: doc, error: insertError } = await supa
    .from('kyc_documents')
    .insert({ user_id: user.id, doc_type: docType, file_url: publicUrl, status: 'pending' })
    .select('id')
    .single()

  if (insertError) return NextResponse.json({ error: 'Failed to record document' }, { status: 500 })

  const { data: profile } = await supa
    .from('profiles')
    .select('full_name')
    .eq('id', user.id)
    .single()

  const DOC_LABELS: Record<string, string> = {
    id_card: 'Pièce d\'identité', proof_of_address: 'Justificatif de domicile',
    kbis: 'Extrait KBIS / RC', articles_of_association: 'Statuts',
    director_id: 'Identité co-dirigeants', ubo: 'UBO — Bénéficiaire effectif',
    asset_ownership: 'Justificatif de propriété', professional_insurance: 'RC Pro / Assurance',
  }

  const adminEmail = process.env.ADMIN_KYC_EMAIL ?? process.env.RESEND_REPLY_TO ?? 'contact@boha-group.com'
  const { subject, html } = emailKycDocSubmitted({
    memberName: (profile?.full_name ?? user.email ?? user.id) + ' (Cédant)',
    memberId:   user.id,
    docLabel:   DOC_LABELS[docType] ?? docType,
  })
  await sendEmail(adminEmail, subject, html, 'kyc-admin')

  return NextResponse.json({ id: doc.id }, { status: 201 })
}
