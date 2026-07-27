import { NextRequest, NextResponse } from 'next/server'
import { z }                        from 'zod'
import { createServiceClient }      from '@/lib/supabase'

const PROFESSIONS = [
  'M&A Advisor', 'Lawyer', 'Accountant', 'CTO', 'Cybersecurity',
  'HR & Social', 'Insurance', 'Tax', 'Investor', 'Other',
] as const

const schema = z.object({
  prenom:       z.string().min(1).max(80),
  nom:          z.string().min(1).max(80),
  email:        z.string().email(),
  profession:   z.string().min(1).max(100),
  specialties:  z.array(z.string().max(80)).max(10).optional(),
  city:         z.string().max(100).optional(),
  country:      z.string().max(80).optional(),
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
      profession:   data.profession,
      specialties:  data.specialties ?? [],
      city:         data.city         ?? null,
      country:      data.country      ?? 'CH',
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

    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL
    if (adminEmail) {
      const { Resend } = await import('resend')
      const resend = new Resend(process.env.RESEND_API_KEY)
      await resend.emails.send({
        from:    'AEGRYN <no-reply@aegryn.com>',
        to:      adminEmail,
        subject: `[Expert] Candidature — ${data.prenom} ${data.nom} (${data.profession})`,
        text:    `Nouvelle candidature réseau expert\n\nNom : ${data.prenom} ${data.nom}\nEmail : ${data.email}\nProfession : ${data.profession}\nOrganisation : ${data.organization ?? '—'}\nVille : ${data.city ?? '—'} ${data.country ?? ''}\nSite : ${data.website ?? '—'}\n\nBio :\n${data.bio ?? '—'}\n\nSpécialités : ${(data.specialties ?? []).join(', ') || '—'}\n\nGérer sur /admin/experts`,
      }).catch(console.error)
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'validation', issues: err.issues }, { status: 400 })
    }
    console.error('[experts/apply]', err)
    return NextResponse.json({ error: 'internal' }, { status: 500 })
  }
}

export { PROFESSIONS }
