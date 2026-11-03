// Legacy / malformed session cookies must be cleared, otherwise they shadow a
// freshly issued cookie and the login <-> authorize bounce never terminates.
import { Miniflare } from 'miniflare'
const results = []
const pass = (n) => { results.push({ n, ok: true }); console.log('PASS  ' + n) }
const fail = (n, d) => { results.push({ n, ok: false, d }); console.log('FAIL  ' + n + ' :: ' + d) }

const KEK = Buffer.alloc(32, 241).toString('base64')
const PASS = 'p'
const RED = 'https://manus.im/api/webhook/mcp/callback'
const mf = new Miniflare({ modules: true, modulesRules: [{ type: 'ESModule', include: ['**/*.js'] }], compatibilityDate: '2024-01-01', scriptPath: 'src/index.js', durableObjects: { BROKER_STATE: 'BrokerState' }, vars: { SESSION_KEK: KEK, ADMIN_PASSWORD: PASS }, bindings: { SESSION_KEK: KEK, ADMIN_PASSWORD: PASS }, serviceBindings: { NODEWARDEN: async () => new Response('{}') } })
const ns = await mf.getDurableObjectNamespace('BROKER_STATE')
const stub = ns.get(ns.idFromName('global'))
await stub.fetch('https://do/state', { method: 'PUT', body: JSON.stringify({ agents: {}, oauthClients: {}, oauthCodes: {}, oauthTokens: {}, oauthAgentProfiles: {}, policies: {}, grants: {}, pending: {}, audit: [], settings: { notifications: {}, vaultEmail: 'p@example.invalid' }, itemGroups: {}, security: { passwordHash: '', passwordSalt: '', totpSecretWrapped: '', totpEnabled: false, totpPendingWrapped: '' } }) })
const reg = await mf.dispatchFetch('https://broker.test/oauth/register', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ client_name: 'Manus', redirect_uris: [RED] }) })
const id = (await reg.json()).client_id
const q = '?response_type=code&client_id=' + id + '&redirect_uri=' + encodeURIComponent(RED) + '&scope=secrets.read&state=st&code_challenge_method=S256&code_challenge=F3siqvmfNJl2t82cMVUfoylc43Lw0Z5MLFbImNsqt38'

// A clear has to cover both names: the prefixed one this deploy issues and the
// legacy one an older session still presents.
const setCookies = (response) => String(response.headers.get('set-cookie') || '').split(/,(?=\s*(?:__Host-)?[A-Za-z_]+=)/).map((part) => part.trim())
const cleared = (cookies, name) => cookies.some((cookie) => cookie.split(';')[0] === name + '=' && cookie.includes('Max-Age=0'))

// L1: a v1 legacy cookie is rejected AND cleared, under both possible names
{
  const r = await mf.dispatchFetch('https://broker.test/oauth/authorize' + q, { headers: { cookie: 'broker_admin=v1.99999999999999.abc' }, redirect: 'manual' })
  const sc = setCookies(r)
  if (r.status === 302 && cleared(sc, '__Host-broker_admin') && cleared(sc, 'broker_admin')) pass('L1 v1 cookie rejected and cleared under both names')
  else fail('L1', JSON.stringify({ status: r.status, sc: sc.join(' | ').slice(0, 140) }))
}
// L2: a malformed v2 cookie is cleared too
{
  const r = await mf.dispatchFetch('https://broker.test/oauth/authorize' + q, { headers: { cookie: 'broker_admin=v2.garbage' }, redirect: 'manual' })
  const sc = setCookies(r)
  if (r.status === 302 && cleared(sc, '__Host-broker_admin') && cleared(sc, 'broker_admin')) pass('L2 malformed v2 cookie cleared')
  else fail('L2', JSON.stringify({ status: r.status, sc: sc.join(' | ').slice(0, 140) }))
}
// L3: no cookie -> redirect to login (no clear header needed)
{
  const r = await mf.dispatchFetch('https://broker.test/oauth/authorize' + q, { redirect: 'manual' })
  if (r.status === 302 && String(r.headers.get('location') || '').includes('/login')) pass('L3 no cookie redirects to login')
  else fail('L3', 'status=' + r.status)
}
// L4: a real session cookie is accepted and renders consent
{
  const cookie = String((await mf.dispatchFetch('https://broker.test/api/login', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ password: PASS }) })).headers.get('set-cookie') || '').split(';')[0]
  const r = await mf.dispatchFetch('https://broker.test/oauth/authorize' + q, { headers: { cookie }, redirect: 'manual' })
  const html = await r.text()
  if (r.status === 200 && html.includes('decision')) pass('L4 valid session renders consent')
  else fail('L4', JSON.stringify({ status: r.status }))
}
// L5: over https the panel cookie is the __Host- form, Lax, Path=/ and without
// Domain; the /oauth-scoped companion stays None and keeps its plain name.
{
  const r = await mf.dispatchFetch('https://broker.test/api/login', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ password: PASS }) })
  const cookies = setCookies(r)
  const panel = cookies.find((cookie) => cookie.startsWith('__Host-broker_admin=')) || ''
  const consent = cookies.find((cookie) => cookie.startsWith('broker_consent=')) || ''
  const hostOk = panel.includes('Secure') && panel.includes('Path=/') && panel.includes('SameSite=Lax') && !panel.includes('Domain')
  const consentOk = consent.includes('SameSite=None') && consent.includes('Path=/oauth') && !consent.startsWith('__Host-')
  if (hostOk && consentOk) pass('L5 https login sets __Host-broker_admin (Secure, Path=/, no Domain) and leaves consent unprefixed')
  else fail('L5', cookies.join(' | ').slice(0, 160))
}
// L6: plain http (wrangler dev) falls back to the unprefixed name, because a
// browser will not store a __Host- cookie it cannot prove came over https.
{
  const r = await mf.dispatchFetch('http://localhost/api/login', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ password: PASS }) })
  const cookies = setCookies(r)
  const panel = cookies.find((cookie) => cookie.startsWith('broker_admin=')) || ''
  if (panel && !cookies.some((cookie) => cookie.startsWith('__Host-broker_admin='))) pass('L6 plain http login falls back to the unprefixed cookie')
  else fail('L6', cookies.join(' | ').slice(0, 160))
}
// L7: after clearing, a fresh login works end to end (approve yields a code)
{
  const cookie = String((await mf.dispatchFetch('https://broker.test/api/login', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ password: PASS }) })).headers.get('set-cookie') || '').split(';')[0]
  const r = await mf.dispatchFetch('https://broker.test/oauth/authorize', { method: 'POST', redirect: 'manual', headers: { 'content-type': 'application/x-www-form-urlencoded', cookie }, body: q.slice(1) + '&decision=allow' })
  const loc = r.headers.get('location') || ''
  if (r.status === 302 && loc.startsWith(RED) && loc.includes('code=')) pass('L7 approve issues a code to the client callback')
  else fail('L7', JSON.stringify({ status: r.status, loc: loc.slice(0, 70) }))
}

await mf.dispose()
const passed = results.filter((r) => r.ok).length
console.log('\n==== stale cookie clearing ' + passed + '/' + results.length + ' passed ====')
if (passed !== results.length) process.exit(1)
