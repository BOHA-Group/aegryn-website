import { NextResponse } from 'next/server'

const KEY         = '8b3ea17a38d44e359f9c6ef44c18831a'
const HOST        = 'aegryn.com'
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`

const URLS_TO_SUBMIT = [
  'https://aegryn.com/fr',
  'https://aegryn.com/fr/assets',
  'https://aegryn.com/fr/assets/neediu',
  'https://aegryn.com/fr/assets/subblink',
  'https://aegryn.com/fr/assets/primiom',
  'https://aegryn.com/fr/assets/movtoo',
  'https://aegryn.com/fr/assets/hobconnect',
  'https://aegryn.com/fr/magazine',
  'https://aegryn.com/fr/magazine/issue-01',
  'https://aegryn.com/fr/transact',
  'https://aegryn.com/fr/grade',
  'https://aegryn.com/fr/valuation',
  'https://aegryn.com/fr/advisory',
  'https://aegryn.com/fr/blog',
  'https://aegryn.com/fr/about',
  'https://aegryn.com/fr/contact',
  'https://aegryn.com/en',
  'https://aegryn.com/en/assets/neediu',
  'https://aegryn.com/en/magazine',
]

export async function POST(req: Request) {
  const authHeader = req.headers.get('authorization')
  const secret = process.env.INDEXNOW_SECRET

  if (secret && authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = {
    host:        HOST,
    key:         KEY,
    keyLocation: KEY_LOCATION,
    urlList:     URLS_TO_SUBMIT,
  }

  const res = await fetch('https://api.indexnow.org/IndexNow', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body:    JSON.stringify(body),
  })

  return NextResponse.json(
    { status: res.status, submitted: URLS_TO_SUBMIT.length },
    { status: res.ok ? 200 : res.status }
  )
}

export async function GET() {
  return NextResponse.json({
    info:    'POST to this endpoint to submit URLs to IndexNow (Bing)',
    key:     KEY,
    urls:    URLS_TO_SUBMIT.length,
  })
}
