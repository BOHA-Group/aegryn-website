import { NextRequest, NextResponse } from 'next/server'
import { z }                        from 'zod'
import { captureLead }              from '@/lib/leadCapture'
import { emailClientAck } from '@/lib/emailAck'
import { ack } from '@/content/emails/ack'

const schema = z.object({
  applicant_type:    z.enum(['expert', 'auditeur', 'apporteur']),
  metier:            z.enum(['strategie', 'risques', 'technologie', 'talent', 'ma']).optional(),
  dimension:         z.enum(['C', 'I', 'F', 'S', 'O']).optional(),
  applicant_name:    z.string().min(2).max(150),
  organization_name: z.string().min(2).max(150),
  country:           z.string().max(100).optional(),
  experience:        z.string().max(2000).optional(),
  website:           z.string().max(300).optional().or(z.literal('')),
  email:             z.string().email(),
  consent:           z.literal(true),
  locale:            z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const data = schema.parse(await req.json())

    const ackA = ack('alliance', data.locale)
    await captureLead(
      'alliance_applications',
      {
        organization_name: data.organization_name,
        alliance_type:     data.applicant_type,
        applicant_name:    data.applicant_name,
        metier:            data.metier ?? null,
        dimension:         data.dimension ?? null,
        country:           data.country,
        description:       data.experience,
        email:             data.email,
        website:           data.website || null,
        consent:           data.consent,
        locale:            data.locale,
      },
      {
        to:              data.email,
        subjectFounder:  ackA.subject,
        htmlFounder:     emailClientAck({ lang: data.locale, subject: ackA.subject, kicker: ackA.kicker, title: ackA.title, intro: ackA.intro,
          rows: [[ackA.org, data.organization_name], [ackA.type, data.applicant_type], [ackA.country, data.country]], paragraphs: [ackA.next] }).html,
        textFounder:     `Bonjour,\n\nNous avons bien reçu la candidature de ${data.organization_name} pour un partenariat de type "${data.applicant_type}".\n\nNos équipes examineront votre dossier et vous contacteront pour un entretien de qualification.\n\nL'équipe Aegryn\nhttps://aegryn.com/alliances`,
        subjectInternal: `[Partenariat] Candidature ${data.applicant_type} — ${data.organization_name}`,
        textInternal:    `Nouvelle candidature Partenariat\nType : ${data.applicant_type}\nMétier : ${data.metier ?? '—'}\nDimension : ${data.dimension ?? '—'}\nNom : ${data.applicant_name}\nOrganisation : ${data.organization_name}\nEmail : ${data.email}\nPays : ${data.country ?? '—'}\nSite : ${data.website || '—'}\nExpérience : ${data.experience ?? '—'}\nLocale : ${data.locale ?? '—'}`,
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
