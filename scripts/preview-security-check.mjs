/**
 * Contrôle de sécurité « boîte noire » d'un déploiement aegryn (requêtes publiques uniquement).
 * Run: node scripts/preview-security-check.mjs <URL du déploiement>   (jeton de contournement de la protection Vercel : variable VERCEL_BYPASS)
 */
const base = (process.argv[2] ?? '').replace(/\/$/, '')
if (!base) { console.error('Usage : node scripts/preview-security-check.mjs <URL>'); process.exit(1) }
const bypass = process.env.VERCEL_BYPASS ? { 'x-vercel-protection-bypass': process.env.VERCEL_BYPASS } : {}
const f = (p, init = {}) => fetch(base + p, { redirect: 'manual', ...init, headers: { ...bypass, ...(init.headers ?? {}) } })
let ko = 0
const T = (n, c, d = '') => { if (!c) ko++; console.log(`${c ? 'OK     ' : 'ECHEC  '} ${n}${d ? ' :: ' + d : ''}`) }
const home = await f('/fr')
if (home.status >= 300 && home.status < 400 && /vercel\.com\/sso/.test(home.headers.get('location') ?? '')) { console.log('Déploiement protégé par Vercel : fournir VERCEL_BYPASS (jeton de contournement) ou désactiver la protection.'); process.exit(2) }
T('en-têtes : HSTS, nosniff, X-Frame-Options, CSP, Referrer-Policy', ['strict-transport-security', 'x-content-type-options', 'x-frame-options', 'content-security-policy', 'referrer-policy'].every((k) => home.headers.get(k)))
for (const p of ['/admin', '/admin/leads', '/admin/experts', '/admin/invoices', '/admin/kyc']) { const r = await f(p); T(`${p} sans connexion : redirigé vers la connexion`, r.status >= 300 && r.status < 400 && /\/admin\/login/.test(r.headers.get('location') ?? ''), String(r.status)) }
const post = (p, body = {}, headers = {}) => f(p, { method: 'POST', headers: { 'content-type': 'application/json', ...headers }, body: JSON.stringify(body) })
for (const p of ['/api/admin/experts', '/api/admin/invoices/00000000-0000-0000-0000-000000000000/pdf', '/api/client/account/password', '/api/data-room/documents', '/api/kyc/status']) { const r = await f(p); T(`${p} sans connexion : refusé`, !String(r.status).startsWith('2'), String(r.status)) }
let r = await post('/api/webhooks/stripe', { type: 'checkout.session.completed' }, { 'stripe-signature': 't=1,v1=deadbeef' }); T('webhook de paiement : fausse signature refusée (400)', r.status === 400, String(r.status))
const codes = []; for (let i = 0; i < 5; i++) codes.push((await post('/api/experts/apply', {}, { 'x-forwarded-for': '203.0.113.99' })).status)
T('formulaire public : refus 429 après 3 demandes par heure et par IP', codes.includes(429), codes.join(','))
r = await post('/api/neediu/waitlist', {}); T('préinscription : charge invalide refusée (400) ou fermée (404)', [400, 404].includes(r.status), String(r.status))
console.log(ko ? `RÉSULTAT : ${ko} échec(s)` : 'RÉSULTAT : tout est conforme'); process.exit(ko ? 1 : 0)
