import { NextRequest, NextResponse } from 'next/server'
import { z }                        from 'zod'
import { captureLead }              from '@/lib/leadCapture'

const schema = z.object({
  organization_name: z.string().min(2).max(150),
  alliance_type:     z.enum(['certification', 'sequestre', 'dealflow', 'technique', 'assurance', 'other']),
  structure_type:    z.string().max(100).optional(),
  country:           z.string().max(100).optional(),
  description:       z.string().max(2000).optional(),
  email:             z.string().email(),
  website:           z.string().url().optional().or(z.literal('')),
  locale:            z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const data = schema.parse(await req.json())

    await captureLead(
      'alliance_applications',
      {
        organization_name: data.organization_name,
        alliance_type:     data.alliance_type,
        structure_type:    data.structure_type,
        country:           data.country,
        description:       data.description,
        email:             data.email,
        website:           data.website || null,
        locale:            data.locale,
      },
      {
        to:              data.email,
        subjectFounder:  'AEGRYN — Candidature Partenariat reçue',
        textFounder:     `Bonjour,\n\nNous avons bien reçu la candidature de ${data.organization_name} pour un partenariat de type "${data.alliance_type}".\n\nNos équipes examineront votre dossier et vous contacteront pour un entretien de qualification.\n\nL'équipe AEGRYN\nhttps://aegryn.com/alliances`,
        subjectInternal: `[Partenariat] Candidature ${data.alliance_type} — ${data.organization_name}`,
        textInternal:    `Nouvelle candidature Partenariat\nOrganisation : ${data.organization_name}\nStructure : ${data.structure_type ?? '—'}\nType : ${data.alliance_type}\nEmail : ${data.email}\nPays : ${data.country ?? '—'}\nSite : ${data.website ?? '—'}\nDescription : ${data.description ?? '—'}\nLocale : ${data.locale ?? '—'}`,
      },
    )

    return NextResponse.json({ ok: true })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'validation', issues: err.issues }, { status: 400 })
    }
    console.error('[alliances/apply]', err)
    return NextResponse.json({ error: 'internal' }, { status: 500 })
  }
}
