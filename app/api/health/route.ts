import { NextResponse } from 'next/server'

export const runtime = 'edge'

export function GET() {
  return NextResponse.json(
    {
      status:    'ok',
      service:   'aegryn-website',
      timestamp: new Date().toISOString(),
      version:   process.env.npm_package_version ?? '0.1.0',
    },
    {
      status:  200,
      headers: { 'Cache-Control': 'no-store' },
    },
  )
}
