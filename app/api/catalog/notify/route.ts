import { NextRequest, NextResponse } from 'next/server'
import { z }                        from 'zod'
import { captureLead }              from '@/lib/leadCapture'

const schema = z.object({
  email:            z.string().email(),
  acquirer_type:    z.enum(['individual', 'company', 'fund']).optional(),
  sectors_interest: z.array(z.string()).optional(),
  capacity_range:   z.enum(['<500k', '500k-2m', '2m-10m', '>10m']).optional(),
  locale:           z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const data = schema.parse(await req.json())

    await captureLead(
      'catalog_waitlist',
      {
        email:            data.email,
        acquirer_type:    data.acquirer_type,
        sectors_interest: data.sectors_interest ?? [],
        capacity_range:   data.capacity_range,
        locale:           data.locale,
      },
      {
        to:              data.email,
        subjectFounder:  'AEGRYN — Vous serez notifié en priorité',
        textFounder:     `Bonjour,\n\nVotre inscription à la liste de notification du catalogue AEGRYN a bien été enregistrée.\n\nVous serez contacté en priorité dès l'ouverture du catalogue aux membres, avant tout listing public.\n\nPour toute question : contact@aegryn.com\n\nL'équipe AEGRYN`,
        subjectInternal: `[Catalogue] Nouveau waitlist — ${data.email}`,
        textInternal:    `Nouveau prospect catalogue\nEmail : ${data.email}\nType : ${data.acquirer_type ?? '—'}\nCapacité : ${data.capacity_range ?? '—'}\nSecteurs : ${(data.sectors_interest ?? []).join(', ') || '—'}\nLocale : ${data.locale ?? '—'}`,
      },
    )

    return NextResponse.json({ ok: true })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'validation', issues: err.issues }, { status: 400 })
    }
    console.error('[catalog/notify]', err)
    return NextResponse.json({ error: 'internal' }, { status: 500 })
  }
}
