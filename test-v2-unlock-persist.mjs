// The console used to ask for the vault password again after the Durable
// Object was evicted, because the unlocked data key lived only in the object's
// memory. It is now mirrored into DO storage wrapped with SESSION_KEK. These
// checks restart the object (a new instance over the same storage) and require
// the unlock to still be there, isolated per session and bounded by its TTL.
import { BrokerState } from './src/index.js'
import { HARNESS, makeReporter } from './test-support/broker-harness.mjs'

const { pass, fail, finish } = makeReporter()
const SESSION = 'session-a'
const OTHER = 'session-b'
const ACCOUNT = 'agent@example.com'
const DEK = Array.from({ length: 32 }, (_, i) => i + 1)
const LEGACY = Array.from({ length: 32 }, (_, i) => 255 - i)

function ctx(store) {
  const storage = {
    get: async (key) => store[key] ?? null,
    put: async (key, value) => { store[key] = structuredClone(value) },
    delete: async (keys) => { for (const key of Array.isArray(keys) ? keys : [keys]) delete store[key] },
    list: async ({ prefix = '' } = {}) => new Map(Object.entries(store).filter(([key]) => key.startsWith(prefix))),
  }
  return { storage }
}

const store = {}
const env = { SESSION_KEK: HARNESS.KEK }
const instance = () => new BrokerState(ctx(store), env)
const keyUrl = (session, account) => `/v2-key?account=${encodeURIComponent(account)}&session=${encodeURIComponent(session)}`
async function call(durable, path, method = 'GET', body) {
  const response = await durable.fetch(new Request('https://state' + path, { method, body: body ? JSON.stringify(body) : undefined }))
  return { status: response.status, body: await response.json().catch(() => ({})) }
}

// ============ 1. A new object instance still sees the unlock ============
{
  const first = instance()
  const put = await call(first, keyUrl(SESSION, ACCOUNT), 'PUT', { dek: DEK, legacyDek: LEGACY, ttlMs: 12 * 3600 * 1000 })
  const restarted = instance()
  const got = await call(restarted, keyUrl(SESSION, ACCOUNT))
  const ok = put.status === 200 && got.status === 200 && got.body.dek.join(',') === DEK.join(',') && got.body.legacyDek.join(',') === LEGACY.join(',')
  if (ok) pass('1a unlock survives a Durable Object restart (same session and account)')
  else fail('1a unlock after restart', `put=${put.status} get=${got.status} body=${JSON.stringify(got.body).slice(0, 160)}`)

  const stored = store[Object.keys(store).find((name) => name.startsWith('v2key:'))] ?? {}
  if (typeof stored.dek === 'string' && stored.dek.includes('.') && !JSON.stringify(stored).includes(DEK.join(','))) {
    pass('1b the durable copy is wrapped ciphertext, not the 32-byte key in the clear')
  } else {
    fail('1b durable copy encryption', JSON.stringify(stored).slice(0, 120))
  }
}

// ============ 2. Sessions stay isolated after a restart ============
{
  const restarted = instance()
  const other = await call(restarted, keyUrl(OTHER, ACCOUNT))
  const accountSlot = await call(restarted, keyUrl('', ACCOUNT))
  if (other.status === 401) pass('2a another session id cannot read this session’s key after a restart')
  else fail('2a session isolation', `status=${other.status}`)
  if (accountSlot.status === 200) pass('2b the account slot (console helpers) still answers after a restart')
  else fail('2b account slot after restart', `status=${accountSlot.status}`)
}

// ============ 3. The plaintext gate survives, but only for its session ============
{
  const restarted = instance()
  const marked = await call(restarted, `/v2-key/plain?account=${encodeURIComponent(ACCOUNT)}&session=${encodeURIComponent(SESSION)}`, 'POST')
  const sessionSlot = await call(restarted, keyUrl(SESSION, ACCOUNT))
  const accountSlot = await call(restarted, keyUrl('', ACCOUNT))
  if (marked.status === 200 && sessionSlot.body.plainOk === true) pass('3a the second-factor pass survives a restart for that session')
  else fail('3a plain pass after restart', `mark=${marked.status} plainOk=${sessionSlot.body.plainOk}`)
  if (accountSlot.body.plainOk === false) pass('3b the helper/account slot did not inherit the second-factor pass')
  else fail('3b plain isolation', `plainOk=${accountSlot.body.plainOk}`)

  const afterEviction = instance()
  const again = await call(afterEviction, keyUrl(SESSION, ACCOUNT))
  if (again.status === 200 && again.body.plainOk === true) pass('3c the pass is durable, not a one-request memory flag')
  else fail('3c durable plain pass', `status=${again.status} plainOk=${again.body.plainOk}`)
}

// ============ 4. Locking removes the durable copies ============
{
  const restarted = instance()
  const locked = await call(restarted, '/v2-key', 'DELETE')
  const afterRestart = instance()
  const got = await call(afterRestart, keyUrl(SESSION, ACCOUNT))
  const leftover = Object.keys(store).filter((name) => name.startsWith('v2key:'))
  if (locked.status === 200 && got.status === 401 && leftover.length === 0) pass('4a lock clears both memory and storage')
  else fail('4a lock durability', `lock=${locked.status} get=${got.status} leftover=${leftover.length}`)
}

// ============ 5. An expired durable entry is not treated as unlocked ============
{
  const first = instance()
  await call(first, keyUrl(SESSION, ACCOUNT), 'PUT', { dek: DEK, ttlMs: 12 * 3600 * 1000 })
  const name = Object.keys(store).find((key) => key.startsWith('v2key:') && key.includes(SESSION))
  store[name].expiresAt = Date.now() - 1
  const restarted = instance()
  const got = await call(restarted, keyUrl(SESSION, ACCOUNT))
  if (got.status === 401) pass('5a an expired entry is removed and reported as locked')
  else fail('5a expired entry', `status=${got.status}`)
  if (store[name] === undefined) pass('5b the expired entry is deleted from storage')
  else fail('5b expired cleanup', 'record still present')
}

finish()
