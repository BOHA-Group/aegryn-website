import { NextResponse } from 'next/server'
import { readFile }     from 'fs/promises'
import path             from 'path'

const PDF_PATH = path.resolve('public/reports/aegryn-report-2027.pdf')

export async function GET() {
  try {
    const file = await readFile(PDF_PATH)
    return new NextResponse(file, {
      headers: {
        'Content-Type':           'application/pdf',
        'Content-Disposition':    'inline; filename="aegryn-magazine-january-2027.pdf"',
        'Cache-Control':          'public, max-age=604800, immutable',
        'X-Content-Type-Options': 'nosniff',
      },
    })
  } catch {
    return NextResponse.json(
      { error: 'Report not yet available.' },
      { status: 404 },
    )
  }
}
