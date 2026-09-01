import { NextRequest, NextResponse } from 'next/server'
import { createAuthClient } from '@/lib/supabaseServer'
import { Resend } from 'resend'
import { z } from 'zod'
import TalentHiringConfirmation from '@/emails/TalentHiringConfirmation'
import TalentAdminNotification from '@/emails/TalentAdminNotification'

const resend = new Resend(process.env.RESEND_API_KEY)

const hiringSchema = z.object({
  company: z.string().min(2, 'Company name required'),
  contactName: z.string().min(2, 'Contact name required'),
  email: z.string().email('Valid email required'),
  phone: z.string().optional(),
  roleTitle: z.string().min(2, 'Role title required'),
  roleDescription: z.string().min(20, 'Role description too short'),
  location: z.string().min(2, 'Location required'),
  budgetAnnualChf: z.string().optional(),
  urgency: z.enum(['immediate', 'month', 'quarter', 'flexible']),
  gdprConsent: z.boolean().refine((val) => val === true, {
    message: 'GDPR consent required',
  }),
  locale: z.string().default('fr'),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const validated = hiringSchema.parse(body)

    const supabase = await createAuthClient()

    const { data, error } = await supabase
      .from('talent_hiring_requests')
      .insert({
        company: validated.company,
        contact_name: validated.contactName,
        email: validated.email,
        phone: validated.phone || null,
        role_title: validated.roleTitle,
        role_description: validated.roleDescription,
        location: validated.location,
        budget_annual_chf: validated.budgetAnnualChf || null,
        urgency: validated.urgency,
        status: 'new',
        locale: validated.locale,
        source: 'website',
      })
      .select()
      .single()

    if (error) {
      console.error('Supabase insert error:', error)
      return NextResponse.json(
        { error: 'Failed to submit hiring request' },
        { status: 500 }
      )
    }

    try {
      await resend.emails.send({
        from: 'Aegryn Talent <contact@boha-group.com>',
        to: validated.email,
        subject: validated.locale === 'fr' ? 'Votre mandat de recrutement Aegryn Talent' : 'Your Aegryn Talent recruitment mandate',
        react: TalentHiringConfirmation({
          company: validated.company,
          contactName: validated.contactName,
          email: validated.email,
          phone: validated.phone,
          roleTitle: validated.roleTitle,
          location: validated.location,
          urgency: validated.urgency,
          locale: validated.locale,
        }),
      })

      await resend.emails.send({
        from: 'Aegryn Talent <contact@boha-group.com>',
        to: 'contact@boha-group.com',
        subject: `[Talent] Nouveau mandat - ${validated.company} - ${validated.roleTitle}`,
        react: TalentAdminNotification({
          type: 'hiring',
          data: {
            company: validated.company,
            contactName: validated.contactName,
            email: validated.email,
            phone: validated.phone,
            roleTitle: validated.roleTitle,
            roleDescription: validated.roleDescription,
            location: validated.location,
            budgetAnnualChf: validated.budgetAnnualChf,
            urgency: validated.urgency,
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
