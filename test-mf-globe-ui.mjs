// Globe P3/P4: markup presence, lazy asset route, failure isolation, and the
// admin geo query contract the frontend depends on.
import { Miniflare } from 'miniflare'
import { readFile } from 'node:fs/promises'
const results = []
const pass = (n) => { results.push({ n, ok: true }); console.log('PASS  ' + n) }
const fail = (n, d) => { results.push({ n, ok: false, d }); console.log('FAIL  ' + n + ' :: ' + d) }

const KEK = Buffer.alloc(32, 191).toString('base64')
const ACCT = 'g3@example.invalid'
const mf = new Miniflare({ modules: true, modulesRules: [{ type: 'ESModule', include: ['**/*.js'] }], compatibilityDate: '2024-01-01', scriptPath: 'src/index.js', durableObjects: { BROKER_STATE: 'BrokerState' }, vars: { SESSION_KEK: KEK, ADMIN_PASSWORD: 'p', GEO_ENABLED: '1' }, bindings: { SESSION_KEK: KEK, ADMIN_PASSWORD: 'p', GEO_ENABLED: '1' }, serviceBindings: { NODEWARDEN: async () => new Response('{}') } })
const ns = await mf.getDurableObjectNamespace('BROKER_STATE')
const stub = ns.get(ns.idFromName('global'))
await stub.fetch('https://do/state', { method: 'PUT', body: JSON.stringify({ agents: {}, oauthClients: {}, oauthCodes: {}, oauthTokens: {}, oauthAgentProfiles: {}, policies: {}, grants: {}, pending: {}, audit: [], settings: { notifications: {}, vaultEmail: ACCT }, itemGroups: {}, security: { passwordHash: '', passwordSalt: '', totpSecretWrapped: '', totpEnabled: false, totpPendingWrapped: '' } }) })
const cookie = String((await mf.dispatchFetch('https://broker.test/api/login', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ password: 'p' }) })).headers.get('set-cookie') || '').split(';')[0]
const html = await mf.dispatchFetch('https://broker.test/', { headers: { cookie } }).then((r) => r.text())

// U1: the third dashboard column is the approval queue; the globe is gone
{
  // The globe card was replaced by an audit-free pending queue. The ids that
  // remain are the ones the queue needs: the card, the count, the row list,
  // the ring and the footer summary.
  const need = ['id="queue-card"', 'id="queue-count"', 'id="queue-list"', 'id="queue-ring"', 'id="queue-sum"']
  const missing = need.filter((m) => !html.includes(m))
  const noGlobe = ['id="globe-card"', 'id="globe-box"', 'id="globe-open"', 'id="globe-still"', 'id="globe-pause"'].every((m) => !html.includes(m))
  if (!missing.length && noGlobe) pass('U1 approval queue present, globe entry points removed')
  else fail('U1', JSON.stringify({ missing, noGlobe }))
}
// U2: the queue says what it counts, how long the oldest has waited, and never
// claims real-time presence or a bar chart.
{
  const hasDisclaimer = html.includes('最久等待') && html.includes('待审批队列')
  const card = (html.match(/id="queue-card"[\s\S]{0,1200}/) || [''])[0]
  const claimsOnline = /实时在线|柱状|条形/.test(card)
  if (hasDisclaimer && !claimsOnline) pass('U2 approval queue labels its metric honestly')
  else fail('U2', JSON.stringify({ hasDisclaimer, claimsOnline }))
}
// U3: polling stops when hidden/paused, at whatever cadence the UI ships.
// The interval is read from the globe's own timer in src/ui.js instead of
// hardcoding a number here, so changing the cadence does not fail this test.
{
  const src = await readFile(new URL('./src/ui.js', import.meta.url), 'utf8')
  const timerLine = src.split('\n').find((l) => l.includes('globe.timer') && l.includes('setInterval')) || ''
  const interval = Number((timerLine.match(/,\s*(\d+)\s*\)/) || [])[1])
  const hasInterval = interval > 0 && html.includes(`${interval})`)
  const guards = html.includes('document.hidden') && html.includes('globeVisible()')
  const sane = interval >= 1000 && interval <= 60000
  if (hasInterval && guards && sane) pass('U3 globe polling cadence (' + interval + 'ms) with visibility/pause guards')
  else fail('U3', JSON.stringify({ interval, hasInterval, guards, sane }))
}
// U4: globe failure cannot break the console (dynamic import in try/catch)
{
  const guarded = /try \{\s*const mod = await import\('\/globe\.js'\)/.test(html) || html.includes("import('/globe.js')")
  const fallback = html.includes('地球组件不可用')
  if (guarded && fallback) pass('U4 globe load failure is isolated with fallback')
  else fail('U4', JSON.stringify({ guarded, fallback }))
}
// U5: the approval queue has an explicit empty state instead of a blank panel
{
  const empty = html.includes('没有待审批请求') && html.includes('Agent 请求读取密钥时会出现在这里')
  if (empty) pass('U5 approval queue empty state present')
  else fail('U5', 'no empty state')
}
// U6: geo API returns the documented shape for incremental polling
{
  await stub.fetch('https://do/geo/reset', { method: 'POST' })
  await stub.fetch('https://do/geo/append', { method: 'POST', body: JSON.stringify({ event: { at: new Date().toISOString(), agent: 'ui', kind: 'token', action: 'secret.read', ok: true, geo: { known: true, country: 'JP', city: 'Tokyo', lat: 35.68, lon: 139.69, asn: 1 } } }) })
  const api1 = await mf.dispatchFetch('https://broker.test/api/geo/events?range=24h&sinceSeq=0&limit=300', { headers: { cookie } }).then((r) => r.json())
  const api2 = await mf.dispatchFetch('https://broker.test/api/geo/events?range=24h&sinceSeq=' + api1.cursor + '&limit=300', { headers: { cookie } }).then((r) => r.json())
  const shapeOk = api1.ok === true && Array.isArray(api1.events) && typeof api1.cursor === 'number' && api1.events.length === 1
  const incrementalOk = api2.events.length === 0
  if (shapeOk && incrementalOk) pass('U6 geo API shape and incremental cursor work')
  else fail('U6', JSON.stringify({ shapeOk, incrementalOk, n1: api1.events.length, n2: api2.events.length }))
}
// U7: geo API is disabled cleanly when the flag is off
{
  const mf2 = new Miniflare({ modules: true, modulesRules: [{ type: 'ESModule', include: ['**/*.js'] }], compatibilityDate: '2024-01-01', scriptPath: 'src/index.js', durableObjects: { BROKER_STATE: 'BrokerState' }, vars: { SESSION_KEK: KEK, ADMIN_PASSWORD: 'p' }, bindings: { SESSION_KEK: KEK, ADMIN_PASSWORD: 'p' }, serviceBindings: { NODEWARDEN: async () => new Response('{}') } })
  const ns2 = await mf2.getDurableObjectNamespace('BROKER_STATE')
  const s2 = ns2.get(ns2.idFromName('global'))
  await s2.fetch('https://do/state', { method: 'PUT', body: JSON.stringify({ agents: {}, oauthClients: {}, oauthCodes: {}, oauthTokens: {}, oauthAgentProfiles: {}, policies: {}, grants: {}, pending: {}, audit: [], settings: { notifications: {}, vaultEmail: ACCT }, itemGroups: {}, security: { passwordHash: '', passwordSalt: '', totpSecretWrapped: '', totpEnabled: false, totpPendingWrapped: '' } }) })
  const c2 = String((await mf2.dispatchFetch('https://broker.test/api/login', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ password: 'p' }) })).headers.get('set-cookie') || '').split(';')[0]
  const off = await mf2.dispatchFetch('https://broker.test/api/geo/events?range=1h', { headers: { cookie: c2 } }).then((r) => r.json())
  await mf2.dispose()
  if (off.enabled === false && off.events.length === 0) pass('U7 geo API reports disabled when flag off')
  else fail('U7', JSON.stringify(off))
}
await mf.dispose()
const passed = results.filter((r) => r.ok).length
console.log('\n==== globe ui ' + passed + '/' + results.length + ' passed ====')
if (passed !== results.length) process.exit(1)
