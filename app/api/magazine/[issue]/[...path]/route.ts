import { readFile }        from 'fs/promises'
import path                from 'path'
import { NextRequest, NextResponse } from 'next/server'
import { canAccessIssue }  from '@/lib/magazineAccess'

/**
 * GET /api/magazine/[issue]/[...path]
 * Sert les assets privés d'un numéro (private/magazine/<issue>/) uniquement
 * si canAccessIssue() l'autorise — même règle que les pages Next :
 * admin connecté, flag public, ou early-access + cookie déverrouillé.
 * Quand l'admin publie (flag public), l'URL directe se débloque d'elle-même.
 * 404 (et non 403) pour ne pas révéler l'existence des fichiers.
 */

const ROOT = path.join(process.cwd(), 'private', 'magazine')

const MIME: Record<string, string> = {
  '.html':  'text/html; charset=utf-8',
  '.jpg':   'image/jpeg',
  '.jpeg':  'image/jpeg',
  '.png':   'image/png',
  '.webp':  'image/webp',
  '.avif':  'image/avif',
  '.gif':   'image/gif',
  '.svg':   'image/svg+xml',
  '.mp3':   'audio/mpeg',
  '.pdf':   'application/pdf',
  '.css':   'text/css; charset=utf-8',
  '.js':    'text/javascript; charset=utf-8',
  '.woff2': 'font/woff2',
}

const NOT_FOUND = new NextResponse('Not found', { status: 404 })

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ issue: string; path: string[] }> },
) {
  const { issue, path: segments } = await params

  const m = /^issue-(\d+)$/.exec(issue)
  if (!m || !segments?.length) return NOT_FOUND

  if (!(await canAccessIssue(m[1]))) return NOT_FOUND

  /* Anti path-traversal */
  if (segments.some((s) => s.includes('..'))) return NOT_FOUND
  const filePath = path.join(ROOT, issue, ...segments)
  if (!filePath.startsWith(ROOT + path.sep)) return NOT_FOUND

  let data: Buffer
  try {
    data = await readFile(filePath)
  } catch {
    return NOT_FOUND
  }

  return new NextResponse(new Uint8Array(data), {
    headers: {
      'Content-Type':           MIME[path.extname(filePath).toLowerCase()] ?? 'application/octet-stream',
      /* private : jamais de cache partagé CDN — navigateur seulement */
      'Cache-Control':          'private, max-age=3600',
      'X-Content-Type-Options': 'nosniff',
      'X-Robots-Tag':           'noindex',
    },
  })
}
