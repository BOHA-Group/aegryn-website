import { NextRequest, NextResponse } from 'next/server'
import { z }                        from 'zod'
import { captureLead }              from '@/lib/leadCapture'

const schema = z.object({
  name:             z.string().min(2).max(100),
  email:            z.string().email(),
  company:          z.string().max(100).optional(),
  preferred_city:   z.enum(['paris', 'geneve', 'amsterdam', 'online']).optional(),
  preferred_format: z.enum(['physical', 'video']).optional(),
  asset_type:       z.enum(['saas', 'marketplace', 'api', 'other']).optional(),
  arr_range:        z.enum(['pre_revenue', '<500k', '500k-2m', '2m-10m', '>10m']).optional(),
  message:          z.string().max(1000).optional(),
  locale:           z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const data = schema.parse(await req.json())

    await captureLead(
      'assessment_day_bookings',
      {
        name:             data.name,
        email:            data.email,
        company:          data.company,
        preferred_city:   data.preferred_city,
        preferred_format: data.preferred_format,
        asset_type:       data.asset_type,
        arr_range:        data.arr_range,
        message:          data.message,
        locale:           data.locale,
      },
      {
        to:              data.email,
        subjectFounder:  'AEGRYN — Votre demande d\'Assessment Day',
        textFounder:     `Bonjour ${data.name},\n\nVotre demande d'Assessment Day a bien été enregistrée.\n\nNos équipes vous contacteront dans les 48h pour confirmer un créneau.\n\nVille préférée : ${data.preferred_city ?? '—'}\nFormat : ${data.preferred_format ?? '—'}\n\nL'équipe AEGRYN\nhttps://aegryn.com/auction/assessment-days`,
        subjectInternal: `[Assessment Day] Nouvelle demande — ${data.name} (${data.email})`,
        textInternal:    `Nouvelle demande Assessment Day\nNom : ${data.name}\nEmail : ${data.email}\nEntreprise : ${data.company ?? '—'}\nVille : ${data.preferred_city ?? '—'}\nFormat : ${data.preferred_format ?? '—'}\nType actif : ${data.asset_type ?? '—'}\nARR : ${data.arr_range ?? '—'}\nMessage : ${data.message ?? '—'}\nLocale : ${data.locale ?? '—'}`,
      },
    )

    return NextResponse.json({ ok: true })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'validation', issues: err.issues }, { status: 400 })
    }
    console.error('[assessment/book]', err)
    return NextResponse.json({ error: 'internal' }, { status: 500 })
  }
}
