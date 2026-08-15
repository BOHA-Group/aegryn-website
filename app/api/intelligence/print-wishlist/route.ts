import { NextRequest, NextResponse } from 'next/server'
import { z }                        from 'zod'
import { captureLead }              from '@/lib/leadCapture'

const schema = z.object({
  name:      z.string().min(1).max(150),
  email:     z.string().email(),
  company:   z.string().max(150).optional(),
  interests: z.array(z.string()).optional(),
  locale:    z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const data = schema.parse(await req.json())

    const interestsList = (data.interests ?? []).join(', ') || '—'

    await captureLead(
      'print_wishlist',
      {
        name:      data.name,
        email:     data.email,
        company:   data.company ?? null,
        interests: interestsList,
        locale:    data.locale ?? null,
      },
      {
        to:              data.email,
        subjectFounder:  'Aegryn \u2014 Liste d\u2019int\u00e9r\u00eat \u00e9dition papier',
        textFounder:     `Bonjour ${data.name},\n\nNous avons bien enregistr\u00e9 votre int\u00e9r\u00eat pour l\u2019\u00e9dition papier du rapport AEGRYN.\n\nCentres d\u2019int\u00e9r\u00eat : ${interestsList}\n\nNous vous contacterons lors du lancement de la production.\n\nL\u2019\u00e9quipe Aegryn\nhttps://aegryn.com/intelligence/report`,
        subjectInternal: `[Print Wishlist] ${data.name} \u2014 ${data.email}`,
        textInternal:    `Nouvelle entr\u00e9e liste papier\nNom : ${data.name}\nEmail : ${data.email}\nEntreprise : ${data.company ?? '\u2014'}\nInt\u00e9r\u00eats : ${interestsList}\nLocale : ${data.locale ?? '\u2014'}`,
      },
    )

    return NextResponse.json({ ok: true })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'validation', issues: err.issues }, { status: 400 })
    }
    console.error('[intelligence/print-wishlist]', err)
    return NextResponse.json({ error: 'internal' }, { status: 500 })
  }
}
