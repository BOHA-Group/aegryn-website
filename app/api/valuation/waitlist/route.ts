import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabaseServer'
import { sendEmail, emailCifsoWaitlistConfirmation } from '@/lib/sendEmail'

// POST /api/valuation/waitlist
// Inscrit un email à la liste d'attente CIFSO Valuation Index
// et envoie un email de confirmation via Resend
export async function POST(req: NextRequest) {
  try {
    const { email, org_type, sector, locale, source_url } = await req.json()

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'invalid_email' }, { status: 400 })
    }

    const normalizedEmail = email.trim().toLowerCase()
    const db = createServiceClient()
    const { error } = await db
      .from('cifso_index_waitlist')
      .upsert(
        { email: normalizedEmail, org_type, sector, locale, source_url },
        { onConflict: 'email', ignoreDuplicates: false }
      )

    if (error) throw error

    // Email de confirmation — fire-and-forget (ne bloque pas la réponse)
    const { subject, html } = emailCifsoWaitlistConfirmation({ locale })
    sendEmail(normalizedEmail, subject, html, 'cifso-waitlist').catch(e =>
      console.error('[waitlist] email error', e)
    )

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[/api/valuation/waitlist]', err)
    return NextResponse.json({ error: 'server_error' }, { status: 500 })
  }
}
