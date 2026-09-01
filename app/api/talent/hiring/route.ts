import { NextRequest, NextResponse } from 'next/server'
import { createAuthClient } from '@/lib/supabaseServer'
import { z } from 'zod'

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
