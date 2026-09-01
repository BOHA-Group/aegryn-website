import { NextRequest, NextResponse } from 'next/server'
import { createAuthClient } from '@/lib/supabaseServer'
import { z } from 'zod'

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
