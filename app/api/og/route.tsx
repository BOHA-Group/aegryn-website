import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import type { NextRequest } from 'next/server'
import sharp from 'sharp'

export const runtime = 'nodejs'

const font = readFile(join(process.cwd(), 'node_modules/@fontsource/plus-jakarta-sans/files/plus-jakarta-sans-latin-600-normal.woff'))

/** Branded social card. Images are restricted to this site's public image folders. */
export async function GET(request: NextRequest) {
  const title = (request.nextUrl.searchParams.get('title') || 'Aegryn').slice(0, 180)
  const requested = request.nextUrl.searchParams.get('image') || '/og/default.jpg'
  const image = /^\/(images|og)\/[\w/ .-]+\.(jpg|jpeg|png|webp)$/i.test(requested) && !requested.includes('..')
    ? requested : '/og/default.jpg'
  // Never fetch a visitor-supplied host in production.
  const origin = process.env.NODE_ENV === 'development'
    ? request.nextUrl.origin
    : process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://aegryn.com'
  let photo: string | undefined
  try {
    const response = await fetch(new URL(image, origin), { cache: 'force-cache', signal: AbortSignal.timeout(8000) })
    if (response.ok && response.headers.get('content-type')?.startsWith('image/')) {
      const jpeg = await sharp(Buffer.from(await response.arrayBuffer()))
        .resize(470, 630, { fit: 'cover' }).jpeg({ quality: 85 }).toBuffer()
      photo = `data:image/jpeg;base64,${jpeg.toString('base64')}`
    }
  } catch { /* The wordmark and title remain readable if the photograph is unavailable. */ }
  const fontData = await font
  return new ImageResponse(
    <div style={{ display: 'flex', width: '100%', height: '100%', background: '#F8FAFC', color: '#050505', fontFamily: 'Jakarta' }}>
      <div style={{ display: 'flex', flexDirection: 'column', width: 730, padding: '46px 54px', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 120 }}>
          <svg width="54" height="60" viewBox="0 0 441.14 487.91">
            <polygon fill="#5ADDA5" points="297.96 171.32 266.09 100.56 220.57 0 191.6 64.14 254.09 127.04 297.96 171.32" />
            <polygon fill="#050505" points="317.41 214.36 246.64 143.18 184.15 80.28 175.05 100.56 0 487.91 90.63 487.91 220.57 201.12 350.51 487.91 441.14 487.91 317.41 214.36" />
          </svg>
          <span style={{ marginTop: 9, fontSize: 18, letterSpacing: 5 }}>AEGRYN</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ width: 52, height: 4, background: '#5ADDA5', marginBottom: 24 }} />
          <div style={{ fontSize: title.length > 115 ? 36 : title.length > 75 ? 42 : 50, lineHeight: 1.16, letterSpacing: -1.4 }}>{title}</div>
        </div>
        <span style={{ fontSize: 18, color: '#374151', letterSpacing: 1 }}>aegryn.com</span>
      </div>
      <div style={{ display: 'flex', width: 470, height: 630, background: '#0A1D2E', position: 'relative' }}>
        {/* ImageResponse renders this server-side; next/image is not applicable. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {photo && <img src={photo} alt="" width={470} height={630} style={{ objectFit: 'cover' }} />}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg, rgba(10,29,46,.4), rgba(10,29,46,.05))' }} />
      </div>
    </div>,
    {
      width: 1200, height: 630,
      fonts: [{ name: 'Jakarta', data: fontData.buffer.slice(fontData.byteOffset, fontData.byteOffset + fontData.byteLength) as ArrayBuffer, weight: 600, style: 'normal' }],
      headers: { 'Cache-Control': 'public, max-age=86400, s-maxage=86400' },
    },
  )
}
