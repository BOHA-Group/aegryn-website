import { NextRequest, NextResponse } from 'next/server'
import { z }                        from 'zod'
import { createServiceClient }      from '@/lib/supabase'
import { sendLeadEmails }           from '@/lib/leadCapture'

const PROFESSIONS = [
  'M&A Advisor', 'Lawyer', 'Accountant', 'CTO', 'Cybersecurity',
  'HR & Social', 'Insurance', 'Tax', 'Investor', 'Other',
] as const

const schema = z.object({
  prenom:       z.string().min(1).max(80),
  nom:          z.string().min(1).max(80),
  email:        z.string().email(),
  profession:   z.string().max(100).optional(),
  category:     z.string().max(60).optional(),
  domain:       z.string().max(60).optional(),
  specialties:  z.array(z.string().max(80)).max(10).optional(),
  city:         z.string().max(100).optional(),
  country:      z.string().max(4).optional(),
  bio:          z.string().max(1200).optional(),
  organization: z.string().max(150).optional(),
  website:      z.string().url().optional().or(z.literal('')),
})

export async function POST(req: NextRequest) {
  try {
    const data = schema.parse(await req.json())
    const supa = createServiceClient()

    const { error } = await supa.from('expert_applications').insert({
      prenom:       data.prenom,
      nom:          data.nom,
      email:        data.email.toLowerCase(),
      profession:   data.profession   ?? null,
      category:     data.category     ?? null,
      domain:       data.domain       ?? null,
      specialties:  data.specialties  ?? [],
      city:         data.city         ?? null,
      country:      data.country      ?? null,
      bio:          data.bio          ?? null,
      organization: data.organization ?? null,
      website:      data.website      || null,
      status:       'pending',
    })

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ error: 'duplicate' }, { status: 409 })
      }
      throw error
    }

    const { data: admins } = await supa
      .from('profiles')
      .select('id')
      .contains('roles', ['admin'])

    if (admins && admins.length > 0) {
      await supa.from('user_notifications').insert(
        admins.map(a => ({
          user_id: a.id,
          type:    'broadcast_action',
          title:   `Candidature réseau expert — ${data.prenom} ${data.nom}`,
          body:    `${data.profession ?? 'Profil inconnu'}${data.organization ? ` · ${data.organization}` : ''}. À traiter dans l'espace Experts réseau.`,
          link:    '/admin/experts',
        }))
      )
    }

    await sendLeadEmails({
      to:              data.email,
      subjectFounder:  'AEGRYN — Candidature réseau d\'experts reçue',
      textFounder:     `Bonjour ${data.prenom},\n\nVotre candidature au réseau d'experts AEGRYN a bien été reçue.\n\nProfil : ${data.profession}${data.organization ? ` · ${data.organization}` : ''}\n\nNos équipes examineront votre dossier et vous contacteront pour un entretien de qualification. L'accès au réseau se fait via un abonnement mensuel de référencement (89 € HT/mois).\n\nPour toute question : contact@boha-group.com\n\nL'équipe AEGRYN\nhttps://aegryn.com/experts`,
      subjectInternal: `[Réseau Experts] Candidature — ${data.prenom} ${data.nom} (${data.profession})`,
      textInternal:    `Nouvelle candidature réseau expert\n\nNom : ${data.prenom} ${data.nom}\nEmail : ${data.email}\nProfession : ${data.profession}\nOrganisation : ${data.organization ?? '—'}\nVille : ${data.city ?? '—'} ${data.country ?? ''}\nSite : ${data.website ?? '—'}\n\nBio :\n${data.bio ?? '—'}\n\nSpécialités : ${(data.specialties ?? []).join(', ') || '—'}\n\nGérer : /admin/experts`,
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'validation', issues: err.issues }, { status: 400 })
    }
    return NextResponse.json({ error: 'internal' }, { status: 500 })
  }
}

export { PROFESSIONS }
