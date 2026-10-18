/** Regression for the Members UI's cookie/session DELETE, without a database connection. */
import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'
import { createRequire } from 'node:module'
import ts from 'typescript'

const load = createRequire(import.meta.url)
const source = fs.readFileSync(new URL('../app/api/admin/members/[id]/route.ts', import.meta.url), 'utf8')
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText
const id = '00000000-0000-4000-8000-000000000001'

async function run({ configured = true, token = '', cookie = false, session = false, memberId = id, failure = null, status }) {
  const calls = []
  let clients = 0
  const query = table => {
    const q = {
      select: () => q,
      update: () => { calls.push([table, 'update']); return q },
      delete: () => { calls.push([table, 'delete']); return q },
      insert: () => q,
      eq: () => q,
      single: async () => ({ data: { email: 'member@example.invalid' }, error: null }),
      then: (resolve, reject) => Promise.resolve({ data: null, error: null }).then(resolve, reject),
    }
    return q
  }
  const exports = {}
  vm.runInNewContext(compiled, {
    exports, console,
    process: { env: { ADMIN_LEADS_TOKEN: configured ? 'fixture-token' : undefined } },
    require: name => {
      if (name === '@/lib/adminAuth') return {
        hasAdminTokenCookie: async () => cookie,
        getAdminUser: async () => session ? { id: 'fixture-admin' } : null,
      }
      if (name === '@/lib/supabase') return { createServiceClient: () => {
        clients++
        return { from: query, auth: { admin: { deleteUser: async userId => {
          calls.push(['auth', userId])
          return { error: failure ? { message: failure } : null }
        } } } }
      } }
      return load(name)
    },
  })
  const response = await exports.DELETE({ nextUrl: new URL(`https://example.invalid/api/admin/members/${memberId}?token=${token}`) }, { params: Promise.resolve({ id: memberId }) })
  assert.equal(response.status, status)
  if (status === 401 || status === 400) assert.equal(clients, 0, 'Reject before any database access')
  if (status === 200) {
    assert(calls.some(([table]) => table === 'auth'))
    assert(!calls.some(([table, action]) => ['nda_acceptances', 'nda_signatures'].includes(table) && action === 'delete'))
  }
  if (failure) assert.equal((await response.json()).error, failure)
}

await run({ session: true, status: 200 })
await run({ cookie: true, status: 200 })
await run({ token: 'fixture-token', status: 200 })
await run({ status: 401 })
await run({ configured: false, status: 401 })
await run({ token: 'wrong', status: 401 })
await run({ session: true, memberId: 'invalid', status: 400 })
await run({ session: true, failure: 'fixture database constraint', status: 500 })
console.log('Member deletion: session, cookie, token, unauthenticated, UUID and failure cases passed. No real accounts accessed.')
