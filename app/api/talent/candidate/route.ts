import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabaseServer'
import { Resend } from 'resend'
import { z } from 'zod'
import { emailClientAck } from '@/lib/emailAck'
import { ack } from '@/content/emails/ack'
import TalentAdminNotification from '@/emails/TalentAdminNotification'

const resend = new Resend(process.env.RESEND_API_KEY)

const candidateSchema = z.object({
  fullName: z.string().min(2, 'Full name required'),
  email: z.string().email('Valid email required'),
  phone: z.string().optional(),
  linkedinUrl: z.string().url().optional().or(z.literal('')),
  cvUrl: z.string().optional(),
  cvFilename: z.string().optional(),
  motivation: z.string().optional().or(z.literal('')),
  functionFamily: z.string().optional(),
  lifecycleCycle: z.enum(['lancement','croissance','restructuration','acquisition','transmission']).optional().or(z.literal('')),
  profileType: z.enum(['permanent','transition']).optional().or(z.literal('')),
  country: z.string().optional(),
  availability: z.string().optional(),
  gdprConsent: z.boolean().refine((val) => val === true, {
    message: 'GDPR consent required',
  }),
  locale: z.string().default('fr'),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const validated = candidateSchema.parse(body)

    const supabase = createServiceClient()

    const { data, error } = await supabase
      .from('talent_candidates')
      .insert({
        full_name: validated.fullName,
        email: validated.email,
        phone: validated.phone || null,
        linkedin_url: validated.linkedinUrl || null,
        cv_url: validated.cvUrl || null,
        cv_filename: validated.cvFilename || null,
        motivation: validated.motivation || null,
        function_family: validated.functionFamily || null,
        lifecycle_cycle: validated.lifecycleCycle || null,
        profile_type: validated.profileType || null,
        country: validated.country || null,
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
      const a = ack('talentCandidate', validated.locale)
      const confirmation = emailClientAck({
        lang: validated.locale, subject: a.subject, kicker: a.kicker, title: a.title, name: validated.fullName, intro: a.intro,
        headerSubtitle: 'Talent',
        rows: [[a.availability, validated.availability], [a.linkedin, validated.linkedinUrl]],
        paragraphs: [a.next, a.confidential],
      })
      await resend.emails.send({
        from: 'Aegryn Talent <contact@boha-group.com>',
        to: validated.email,
        subject: confirmation.subject,
        html: confirmation.html,
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
            motivation: validated.motivation || null,
        function_family: validated.functionFamily || null,
        lifecycle_cycle: validated.lifecycleCycle || null,
        profile_type: validated.profileType || null,
        country: validated.country || null,
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
