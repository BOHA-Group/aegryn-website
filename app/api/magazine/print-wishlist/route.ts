import { NextRequest, NextResponse } from 'next/server'
import { z }                        from 'zod'
import { captureLead }              from '@/lib/leadCapture'

const schema = z.object({
  first_name:  z.string().min(1).max(100),
  last_name:   z.string().min(1).max(100),
  email:       z.string().email(),
  company:     z.string().max(150).optional(),
  address:     z.string().max(255).optional(),
  city:        z.string().max(100).optional(),
  postal_code: z.string().max(20).optional(),
  country:     z.string().max(100).optional(),
  interests:   z.array(z.string()).optional(),
  locale:      z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const data = schema.parse(await req.json())

    const fullName      = `${data.first_name} ${data.last_name}`
    const interestsList = (data.interests ?? []).join(', ') || '—'

    await captureLead(
      'print_wishlist',
      {
        first_name:  data.first_name,
        last_name:   data.last_name,
        name:        fullName,
        email:       data.email,
        company:     data.company  ?? null,
        address:     data.address  ?? null,
        city:        data.city     ?? null,
        postal_code: data.postal_code ?? null,
        country:     data.country  ?? null,
        interests:   interestsList,
        locale:      data.locale   ?? null,
      },
      {
        to:              data.email,
        subjectFounder:  'Aegryn — Liste d\'intérêt édition papier',
        textFounder:     `Bonjour ${data.first_name},\n\nNous avons bien enregistré votre intérêt pour l'édition papier du magazine Aegryn.\n\nCentres d'intérêt : ${interestsList}\n\nNous vous contacterons lors du lancement de la production.\n\nL'équipe Aegryn\nhttps://aegryn.com/magazine`,
        subjectInternal: `[Print Wishlist] ${fullName} — ${data.email}`,
        textInternal:    `Nouvelle entrée liste papier\nNom : ${fullName}\nEmail : ${data.email}\nEntreprise : ${data.company ?? '—'}\nAdresse : ${data.address ?? '—'}, ${data.postal_code ?? ''} ${data.city ?? ''}, ${data.country ?? ''}\nIntérêts : ${interestsList}\nLocale : ${data.locale ?? '—'}`,
      },
    )

    return NextResponse.json({ ok: true })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'validation', issues: err.issues }, { status: 400 })
    }
    console.error('[magazine/print-wishlist]', err)
    return NextResponse.json({ error: 'internal' }, { status: 500 })
  }
}
