import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabaseServer'

const MAX_SIZE = 10 * 1024 * 1024 // 10 Mo
const ALLOWED = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData()
    const file = form.get('file') as File | null
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'file_too_large' }, { status: 400 })
    }
    if (!ALLOWED.includes(file.type)) {
      return NextResponse.json({ error: 'invalid_file_type' }, { status: 400 })
    }

    const supabase = createServiceClient()
    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'pdf'
    const path = `${crypto.randomUUID()}.${ext}`

    const { error } = await supabase.storage
      .from('talent-cvs')
      .upload(path, file, { contentType: file.type })

    if (error) {
      console.error('CV upload error:', error)
      return NextResponse.json({ error: 'upload_failed' }, { status: 500 })
    }

    return NextResponse.json({ path, filename: file.name }, { status: 201 })
  } catch (err) {
    console.error('CV upload error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
