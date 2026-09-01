import { NextRequest, NextResponse } from 'next/server'
import { createAuthClient } from '@/lib/supabaseServer'
import { Resend } from 'resend'
import { z } from 'zod'
import TalentCandidateConfirmation from '@/emails/TalentCandidateConfirmation'
import TalentAdminNotification from '@/emails/TalentAdminNotification'

const resend = new Resend(process.env.RESEND_API_KEY)

const candidateSchema = z.object({
  fullName: z.string().min(2, 'Full name required'),
  email: z.string().email('Valid email required'),
  phone: z.string().optional(),
  linkedinUrl: z.string().url().optional().or(z.literal('')),
  cvUrl: z.string().optional(),
  cvFilename: z.string().optional(),
  motivation: z.string().min(50, 'Motivation letter too short'),
  availability: z.string().optional(),
  locale: z.string().default('fr'),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const validated = candidateSchema.parse(body)

    const supabase = await createAuthClient()

    const { data, error } = await supabase
      .from('talent_candidates')
      .insert({
        full_name: validated.fullName,
        email: validated.email,
        phone: validated.phone || null,
        linkedin_url: validated.linkedinUrl || null,
        cv_url: validated.cvUrl || null,
        cv_filename: validated.cvFilename || null,
        motivation: validated.motivation,
        availability: validated.availability || null,
        status: 'new',
        locale: validated.locale,
        source: 'website',
      })
      .select()
      .single()

    if (error) {
      console.error('Supabase insert error:', error)
      return NextResponse.json(
        { error: 'Failed to submit candidate application' },
        { status: 500 }
      )
    }

    try {
      await resend.emails.send({
        from: 'Aegryn Talent <contact@boha-group.com>',
        to: validated.email,
        subject: validated.locale === 'fr' ? 'Votre candidature Aegryn Talent' : 'Your Aegryn Talent application',
        react: TalentCandidateConfirmation({
          fullName: validated.fullName,
          email: validated.email,
          phone: validated.phone,
          linkedinUrl: validated.linkedinUrl,
          availability: validated.availability,
          locale: validated.locale,
        }),
      })

      await resend.emails.send({
        from: 'Aegryn Talent <contact@boha-group.com>',
        to: 'contact@boha-group.com',
        subject: `[Talent] Nouvelle candidature - ${validated.fullName}`,
        react: TalentAdminNotification({
          type: 'candidate',
          data: {
            fullName: validated.fullName,
            email: validated.email,
            phone: validated.phone,
            linkedinUrl: validated.linkedinUrl,
            motivation: validated.motivation,
            availability: validated.availability,
            locale: validated.locale,
          },
        }),
      })
    } catch (emailError) {
      console.error('Email sending error:', emailError)
    }

    return NextResponse.json({ success: true, data }, { status: 201 })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: err.errors },
        { status: 400 }
      )
    }

    console.error('Unexpected error:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
