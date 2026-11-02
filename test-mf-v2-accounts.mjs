// Per-account data keys: rows written before accounts existed still open, the
// one-shot migration converges when it is interrupted, and an account key cannot
// open another account's row. Runs the real worker against a real D1.
import { Miniflare } from 'miniflare'
import { readFileSync, readdirSync } from 'node:fs'
import { openItem, sealItem, unwrapDekPassword, dekFingerprint, newDeviceKeypair, unwrapDekDevice } from './src/envelope.js'

const results = []
const pass = (n) => { results.push({ n, ok: true }); console.log('PASS  ' + n) }
const fail = (n, d) => { results.push({ n, ok: false, d }); console.log('FAIL  ' + n + ' :: ' + d) }

const KEK = Buffer.alloc(32, 19).toString('base64')
const ADMIN = 'accounts-admin-password'
const MASTER = 'accounts master password'
const A = 'alpha@example.invalid'
const B = 'beta@example.invalid'
const BASE = 'https://broker.test'

const mf = new Miniflare({
  modules: true,
  modulesRules: [{ type: 'ESModule', include: ['**/*.js'] }],
  compatibilityDate: '2024-01-01',
  scriptPath: 'src/index.js',
  durableObjects: { BROKER_STATE: 'BrokerState' },
  d1Databases: { VAULT_DB: 'v2-accounts-test' },
  vars: { SESSION_KEK: KEK, ADMIN_PASSWORD: ADMIN },
  bindings: { SESSION_KEK: KEK, ADMIN_PASSWORD: ADMIN },
  serviceBindings: { NODEWARDEN: async () => new Response('{}') },
})

const db = await mf.getD1Database('VAULT_DB')
for (const file of readdirSync('migrations').filter((name) => name.endsWith('.sql')).sort()) {
  const schema = readFileSync('migrations/' + file, 'utf8').split('\n').filter((line) => !line.trim().startsWith('--')).join('\n')
  for (const statement of schema.split(';').map((part) => part.trim()).filter(Boolean)) {
    await db.prepare(statement).run().catch((error) => { if (!/duplicate column/i.test(String(error.message))) throw error })
  }
}

const ns = await mf.getDurableObjectNamespace('BROKER_STATE')
const stub = ns.get(ns.idFromName('global'))
const getState = () => stub.fetch('https://state/state').then((r) => r.json()).then((p) => p.state)
const putState = (state) => stub.fetch('https://state/state', { method: 'PUT', body: JSON.stringify(state) })
// Deliberately start with no account: that is the legacy single-key vault the
// migration has to keep readable.
await putState({ agents: {}, policies: {}, grants: {}, pending: {}, audit: [], itemGroups: {}, security: {}, settings: { notifications: {}, vaultEmail: '' } })

const login = await mf.dispatchFetch(BASE + '/api/login', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ password: ADMIN }) })
const cookie = String(login.headers.get('set-cookie') || '').split(';')[0]
if (!cookie) { console.log('FAIL  could not log in as admin'); process.exit(1) }

const call = async (path, options = {}) => {
  const response = await mf.dispatchFetch(BASE + path, {
    method: options.method || 'GET',
    headers: { cookie, 'content-type': 'application/json', ...(options.headers ?? {}) },
    ...(options.body ? { body: JSON.stringify(options.body) } : {}),
  })
  const text = await response.text()
  let body = null
  try { body = JSON.parse(text) } catch { body = text }
  return { status: response.status, body }
}
const setAccount = async (account) => {
  const state = await getState()
  state.settings = { ...(state.settings ?? { notifications: {} }), vaultEmail: account }
  await putState(state)
}
const ringEnvelope = async (id) => (await db.prepare('SELECT envelope FROM keyrings WHERE id = ?').bind(id).first())?.envelope ?? null
const rowOf = async (id) => db.prepare('SELECT id, ciphertext, account_id, revision FROM vault_items WHERE id = ?').bind(id).first()

// G1: an account-less vault keeps the original single keyring, and its rows
// carry no owner.
let legacyId = ''
{
  const init = await call('/api/v2/init', { method: 'POST', body: { password: MASTER } })
  const created = await call('/api/v2/items', { method: 'POST', body: { kind: 'api', payload: { name: 'legacy-one', secret: 'legacy-value-1' } } })
  legacyId = created.body.id || ''
  const rows = await call('/api/v2/items?plain=1')
  const row = (rows.body.items || []).find((item) => item.id === legacyId)
  const ring = await db.prepare('SELECT id, account_id FROM keyrings').all()
  const ok = init.status === 200 && ring.results?.length === 1 && ring.results[0].id === 'password' && row?.payload?.secret === 'legacy-value-1'
  if (ok) pass('G1 an account-less vault still uses the single password keyring and leaves rows unowned')
  else fail('G1', JSON.stringify({ init: init.status, ring: ring.results, row: row?.payload }))
}

// G2: switching to a named account falls back to the legacy key, so the old
// credential stays readable before anything is migrated.
{
  await setAccount(A)
  const unlocked = await call('/api/v2/unlock', { method: 'POST', body: { password: MASTER } })
  const rows = await call('/api/v2/items?plain=1')
  const row = (rows.body.items || []).find((item) => item.id === legacyId)
  const status = await call('/api/v2/status')
  const ok = unlocked.status === 200 && unlocked.body.legacy === true && unlocked.body.account === A &&
    row?.payload?.secret === 'legacy-value-1' && status.body.account === A
  if (ok) pass('G2 an unmigrated account unlocks through the legacy key and reads the old row')
  else fail('G2', JSON.stringify({ unlocked, row: row?.payload, account: status.body.account }))
}

// G3: the migration mints the account key, converts the legacy rows and keeps
// them readable.
{
  const migrated = await call('/api/v2/migrate', { method: 'POST', body: { password: MASTER } })
  const row = await rowOf(legacyId)
  const read = await call('/api/v2/items/' + legacyId)
  const ring = await ringEnvelope('account:' + A)
  const ok = migrated.status === 200 && migrated.body.minted === true && migrated.body.converted >= 1 &&
    migrated.body.remaining === 0 && row?.account_id === A && read.body.payload?.secret === 'legacy-value-1' && Boolean(ring)
  if (ok) pass('G3 the migration mints the account key, tags the rows and keeps them readable')
  else fail('G3', JSON.stringify({ migrated, row, read: read.body, hasRing: Boolean(ring) }).slice(0, 500))
}

// G4: legacy rows are sealed under the account key now; the legacy key no longer
// opens them (it stays behind for rollback only).
{
  const legacyDek = await unwrapDekPassword(await ringEnvelope('password'), MASTER)
  const accountDek = await unwrapDekPassword(await ringEnvelope('account:' + A), MASTER)
  const row = await rowOf(legacyId)
  const opensWithLegacy = await openItem(legacyDek, row.id, row.ciphertext).then(() => true, () => false)
  const opensWithAccount = await openItem(accountDek, row.id, row.ciphertext).then(() => true, () => false)
  const ok = opensWithAccount && !opensWithLegacy
  if (ok) pass('G4 a migrated row opens with the account key and not with the legacy key')
  else fail('G4', JSON.stringify({ opensWithAccount, opensWithLegacy }))
}

// G5: a second run changes nothing — that is what makes an interrupted run safe
// to retry.
{
  const before = await rowOf(legacyId)
  const again = await call('/api/v2/migrate', { method: 'POST', body: { password: MASTER } })
  const after = await rowOf(legacyId)
  const read = await call('/api/v2/items/' + legacyId)
  const ok = again.status === 200 && again.body.minted === false && again.body.converted === 0 &&
    again.body.tagged === 0 && after.ciphertext === before.ciphertext && after.revision === before.revision &&
    read.body.payload?.secret === 'legacy-value-1'
  if (ok) pass('G5 a second migration is a no-op and does not re-encrypt anything')
  else fail('G5', JSON.stringify({ again: again.body, same: after.ciphertext === before.ciphertext, revision: [before.revision, after.revision] }).slice(0, 400))
}

// G6: a row left on the legacy key by an interrupted run is converted on the
// retry, and only that row.
{
  const legacyDek = await unwrapDekPassword(await ringEnvelope('password'), MASTER)
  const payload = await openItem(await unwrapDekPassword(await ringEnvelope('account:' + A), MASTER), legacyId, (await rowOf(legacyId)).ciphertext)
  await db.prepare('UPDATE vault_items SET ciphertext = ?, account_id = NULL WHERE id = ?')
    .bind(await sealItem(legacyDek, legacyId, payload), legacyId).run()
  // While a conversion is flagged, item routes stay closed so no peer caches a
  // row it cannot open.
  await db.prepare('INSERT OR REPLACE INTO meta (key, value) VALUES (?, ?)')
    .bind('migrate:' + A, JSON.stringify({ account: A, startedAt: new Date().toISOString() })).run()
  const blocked = await call('/api/v2/items/' + legacyId)
  await db.prepare('DELETE FROM meta WHERE key = ?').bind('migrate:' + A).run()
  const retried = await call('/api/v2/migrate', { method: 'POST', body: { password: MASTER } })
  const row = await rowOf(legacyId)
  const read = await call('/api/v2/items/' + legacyId)
  const opensWithLegacy = await openItem(legacyDek, row.id, row.ciphertext).then(() => true, () => false)
  const ok = blocked.status === 503 && retried.status === 200 && retried.body.converted === 1 &&
    row.account_id === A && !opensWithLegacy && read.body.payload?.secret === payload.secret
  if (ok) pass('G6 an interrupted run blocks reads, and a retry converts just the row it missed')
  else fail('G6', JSON.stringify({ blocked: blocked.status, retried: retried.body, row, opensWithLegacy, read: read.status }).slice(0, 400))
}

// G7: account B gets its own key, and it cannot open A's row even though the
// ciphertext travels to it.
{
  await setAccount(B)
  const unlocked = await call('/api/v2/unlock', { method: 'POST', body: { password: MASTER } })
  const migrated = await call('/api/v2/migrate', { method: 'POST', body: { password: MASTER } })
  const direct = await call('/api/v2/items/' + legacyId)
  const listed = await call('/api/v2/items?plain=1')
  const sync = await call('/api/v2/items?since=0')
  const dekA = await unwrapDekPassword(await ringEnvelope('account:' + A), MASTER)
  const dekB = await unwrapDekPassword(await ringEnvelope('account:' + B), MASTER)
  const row = await rowOf(legacyId)
  const withB = await openItem(dekB, row.id, row.ciphertext).then(() => true, () => false)
  const withA = await openItem(dekA, row.id, row.ciphertext).then(() => true, () => false)
  const ok = unlocked.status === 200 && migrated.status === 200 && direct.status === 404 &&
    !(listed.body.items ?? []).some((item) => item.id === legacyId) &&
    !(sync.body.items ?? []).some((item) => item.id === legacyId) &&
    !withB && withA && (await dekFingerprint(dekA)) !== (await dekFingerprint(dekB))
  if (ok) {
    pass('G7 account B cannot read or even list account A\'s row, and its key does not open it')
  } else {
    fail('G7', JSON.stringify({ unlocked: unlocked.status, migrated: migrated.body, direct: direct.status, withA, withB, listed: listed.body.items?.length }).slice(0, 400))
  }
}

// G8: the key cache is per session+account. Switching accounts invalidates it, so
// the previous account's key is not silently reused under the new name.
{
  await setAccount(A)
  await call('/api/v2/unlock', { method: 'POST', body: { password: MASTER } })
  const open = await call('/api/v2/status')
  const switched = await call('/api/settings', { method: 'POST', body: { vaultEmail: B } })
  const afterSwitch = await call('/api/v2/status')
  const oldItem = await call('/api/v2/items/' + legacyId)
  const relocked = await call('/api/v2/lock', { method: 'POST' })
  const afterLock = await call('/api/v2/status')
  const ok = open.body.unlocked === true && switched.status === 200 && afterSwitch.body.unlocked === false &&
    oldItem.status === 423 && relocked.status === 200 && afterLock.body.unlocked === false
  if (ok) pass('G8 switching account (or locking) drops the cached key for the session')
  else fail('G8', JSON.stringify({ open: open.body.unlocked, switched: switched.status, afterSwitch: afterSwitch.body.unlocked, oldItem: oldItem.status, afterLock: afterLock.body.unlocked }))
}

// G9: a device paired under B is stamped with B, so its pull never carries A's
// row.
let betaDeviceId = ''
{
  const unlock = await call('/api/v2/unlock', { method: 'POST', body: { password: MASTER } })
  const keypair = await newDeviceKeypair()
  const paired = await call('/api/v2/pair', { method: 'POST', body: { name: 'beta-laptop', publicKey: keypair.publicJwk } })
  betaDeviceId = paired.body.id || ''
  const deviceRow = await db.prepare('SELECT account_id FROM devices WHERE id = ?').bind(paired.body.id).first()
  const pull = await mf.dispatchFetch(BASE + '/api/v2/items?since=0', { headers: { authorization: 'Bearer ' + paired.body.token } })
  const pulled = await pull.json().catch(() => ({}))
  let deviceKey = null
  try { deviceKey = await unwrapDekDevice(paired.body.envelope, keypair.privateJwk) } catch { deviceKey = null }
  const ok = unlock.status === 200 && paired.status === 201 && deviceRow?.account_id === B &&
    !(pulled.items ?? []).some((item) => item.id === legacyId) && Boolean(deviceKey)
  if (ok) pass('G9 a paired device is stamped with its account and pulls only that account\'s rows')
  else fail('G9', JSON.stringify({ unlock: unlock.status, paired: paired.body, device: deviceRow, pulled: pulled.items?.length }).slice(0, 300))
}

// G10: device management follows the account. A device paired under B is
// invisible to A and cannot be changed there; a device with no owner is the
// legacy case and stays visible and revocable for both.
{
  const legacyDeviceId = 'legacy-device-00'
  await db.prepare('INSERT OR REPLACE INTO devices (id, name, public_jwk, token_hash, created_at, can_write, account_id) VALUES (?, ?, ?, NULL, ?, 1, NULL)')
    .bind(legacyDeviceId, 'old-laptop', JSON.stringify({ kty: 'EC' }), new Date().toISOString()).run()
  await setAccount(A)
  const listedA = await call('/api/v2/devices')
  const aDevices = listedA.body.devices ?? []
  const hiddenFromA = !aDevices.some((device) => device.id === betaDeviceId)
  const legacyForA = aDevices.find((device) => device.id === legacyDeviceId)
  const patchBeta = await call('/api/v2/devices/' + betaDeviceId, { method: 'PATCH', body: { canWrite: false } })
  const revokeBeta = await call('/api/v2/devices/' + betaDeviceId, { method: 'DELETE' })
  const patchLegacy = await call('/api/v2/devices/' + legacyDeviceId, { method: 'PATCH', body: { canWrite: false } })
  await setAccount(B)
  const revokeLegacy = await call('/api/v2/devices/' + legacyDeviceId, { method: 'DELETE' })
  const legacyRow = await db.prepare('SELECT revoked_at FROM devices WHERE id = ?').bind(legacyDeviceId).first()
  const betaRow = await db.prepare('SELECT revoked_at FROM devices WHERE id = ?').bind(betaDeviceId).first()
  const ok = hiddenFromA && legacyForA?.legacy === true && patchBeta.status === 404 && revokeBeta.status === 404 &&
    patchLegacy.status === 200 && revokeLegacy.status === 200 && Boolean(legacyRow?.revoked_at) && !betaRow?.revoked_at
  if (ok) pass('G10 a foreign device is invisible and immutable, a legacy device stays manageable')
  else fail('G10', JSON.stringify({ hiddenFromA, legacyForA, patchBeta: patchBeta.status, revokeBeta: revokeBeta.status, patchLegacy: patchLegacy.status, revokeLegacy: revokeLegacy.status, legacyRevoked: legacyRow?.revoked_at }).slice(0, 400))
}

await mf.dispose()
const passed = results.filter((r) => r.ok).length
console.log('\n==== v2 accounts ' + passed + '/' + results.length + ' passed ====')
if (passed !== results.length) process.exit(1)
