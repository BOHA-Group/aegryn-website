import { NextResponse } from 'next/server'
import { readFile }     from 'fs/promises'
import path             from 'path'

const PDF_PATH = path.resolve('public/reports/aegryn-report-2026.pdf')

export async function GET() {
  try {
    const file = await readFile(PDF_PATH)
    return new NextResponse(file, {
      headers: {
        'Content-Type':           'application/pdf',
        'Content-Disposition':    'inline; filename="aegryn-report-2026.pdf"',
        'Cache-Control':          'public, max-age=604800, immutable',
        'X-Content-Type-Options': 'nosniff',
      },
    })
  } catch {
    return NextResponse.json(
      { error: 'Report not yet available. Check back in Autumn 2026.' },
      { status: 404 },
    )
  }
}
