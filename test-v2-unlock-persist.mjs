// The console used to ask for the vault password again after the Durable
// Object was evicted, because the unlocked data key lived only in the object's
// memory. It is now mirrored into DO storage wrapped with SESSION_KEK. These
// checks restart the object (a new instance over the same storage) and require
// the unlock to still be there, isolated per session and bounded by its TTL.
import { createHmac } from 'node:crypto'
import { BrokerState } from './src/index.js'
import { wrapWithKek } from './src/crypto.js'
import { wrapDekPassword } from './src/envelope.js'
import { HARNESS, makeReporter, makeEnv, seedState, login, call as workerCall, FakeD1 } from './test-support/broker-harness.mjs'

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

// ============ 6. A Vault 2.0 unlock is enough for the console helpers ============
// The live vault has no account:<email> keyring (migration never ran) and its
// only unlock is /api/v2/unlock, which writes a key slot and never the legacy
// session. "Extend authorization" answered 423 forever because its gate asked
// getSession() for that session. Either unlock must now satisfy the gate.
{
  const LIVE = 'agent@otscup.com'
  const web = makeEnv({ extra: { VAULT_EMAIL: LIVE } })
  await seedState(web, { settings: { vaultEmail: LIVE } })
  // Mirror the live vault: the agent belongs to the deployment account.
  const seeded = (await (await web.BROKER_STATE.get().fetch('https://state/state')).json()).state
  seeded.agents[HARNESS.AGENT].account = LIVE
  await web.BROKER_STATE.get().fetch('https://state/state', { method: 'PUT', body: JSON.stringify(seeded) })

  const cookie = await login(web)
  const extend = (headers = {}) => workerCall(web, '/api/agents/extend', {
    method: 'POST',
    headers: { 'content-type': 'application/json', cookie, ...headers },
    body: JSON.stringify({ name: HARNESS.AGENT, days: 1 }),
  })

  const locked = await extend()
  if (locked.status === 423) pass('6a before unlocking, extend still refuses with 423')
  else fail('6a locked baseline', `status=${locked.status}`)

  // Exactly what /api/v2/unlock does after vault2Unlock returns: one key slot.
  await web.BROKER_STATE.get().fetch('https://state/v2-key?account=' + encodeURIComponent(LIVE) + '&session=' + encodeURIComponent('console'), {
    method: 'PUT',
    body: JSON.stringify({ dek: DEK, ttlMs: 12 * 3600 * 1000 }),
  })
  const slots = Object.keys(web._store).filter((name) => name.startsWith('v2key:'))
  const legacySession = (await (await web.BROKER_STATE.get().fetch('https://state/session')).json()).session
  console.log('      slots=' + slots.join(', ') + ' legacySession=' + (legacySession ? 'present' : 'null'))

  const unlocked = await extend()
  if (unlocked.status === 200) pass('6b a v2 unlock alone lets extend through (no legacy session exists)')
  else fail('6b extend after v2 unlock', `status=${unlocked.status} body=${await unlocked.text().catch(() => '')}`)
  if (legacySession === null) pass('6c the unlock wrote no legacy session, which is why the old gate failed')
  else fail('6c legacy session should be absent', JSON.stringify(legacySession))
}

// ============ 7. One unlock is enough when the account has a second factor ============
// The panel used to ask for the code a second time on the first plaintext
// listing, right after the unlock, which read as "my unlock did not count".
// /api/v2/unlock now takes the same code and grants both in one request; a
// client that sends no code keeps the old two-step behaviour.
{
  const LIVE = 'agent@otscup.com'
  const MASTER = 'correct horse battery staple'
  // A fixed RFC 4648 secret so the code is derived, not hard-coded.
  const SECRET = 'JBSWY3DPEHPK3PXP'
  const B32 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
  const base32 = (text) => {
    let bits = 0
    let value = 0
    const bytes = []
    for (const char of String(text).replace(/=+$/, '').toUpperCase()) {
      const index = B32.indexOf(char)
      if (index < 0) continue
      value = (value << 5) | index
      bits += 5
      if (bits >= 8) { bytes.push((value >>> (bits - 8)) & 0xff); bits -= 8 }
    }
    return Buffer.from(bytes)
  }
  const totp = (secret, at = Date.now()) => {
    const counter = Math.floor(at / 30000)
    const buf = Buffer.alloc(8)
    buf.writeUInt32BE(Math.floor(counter / 2 ** 32), 0)
    buf.writeUInt32BE(counter >>> 0, 4)
    const mac = createHmac('sha1', base32(secret)).update(buf).digest()
    const offset = mac[mac.length - 1] & 15
    const binary = ((mac[offset] & 0x7f) << 24) | (mac[offset + 1] << 16) | (mac[offset + 2] << 8) | mac[offset + 3]
    return String(binary % 1e6).padStart(6, '0')
  }
  // The live vault never ran migrate: the only keyring is the legacy password
  // one, so this fake answers that row and reports no account keyring.
  const keyringD1 = (inner, envelope) => ({
    prepare(sql) {
      if (/FROM keyrings/.test(sql) && /SELECT/i.test(sql)) {
        return {
          params: [],
          bind(...params) { this.params = params; return this },
          async first() {
            return /WHERE id = \?/.test(sql) && this.params[0] === 'password' ? { envelope } : null
          },
          async all() { return { results: [] } },
          async run() { return { success: true } },
        }
      }
      return inner.prepare(sql)
    },
    batch: (statements) => inner.batch(statements),
  })

  const envelope = await wrapDekPassword(Uint8Array.from(DEK), MASTER)
  const mount = async (enrolled) => {
    const web = makeEnv({ vault: keyringD1(new FakeD1(), envelope), extra: { VAULT_EMAIL: LIVE } })
    const security = enrolled
      ? { totpEnabled: true, totpSecretWrapped: await wrapWithKek(new TextEncoder().encode(SECRET), Buffer.from(HARNESS.KEK, 'base64')) }
      : {}
    await seedState(web, { settings: { vaultEmail: LIVE }, security })
    return web
  }
  const signIn = async (web, code) => {
    const response = await workerCall(web, '/api/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(code ? { password: 'p', code } : { password: 'p' }),
    })
    return String(response.headers.get('set-cookie') || '').split(';')[0]
  }
  const unlock = (web, cookie, extra = {}) => workerCall(web, '/api/v2/unlock', {
    method: 'POST',
    headers: { 'content-type': 'application/json', cookie },
    body: JSON.stringify({ password: MASTER, duration: '12h', ttlMs: 12 * 3600 * 1000, ...extra }),
  })
  const plain = (web, cookie) => workerCall(web, '/api/v2/items?plain=1', { headers: { cookie } })

  // 7a/7b: enrolled account, no code. The unlock itself still succeeds, but the
  // names stay behind the old prompt.
  const enrolled = await mount(true)
  const enrolledCookie = await signIn(enrolled, totp(SECRET))
  const noCode = await unlock(enrolled, enrolledCookie)
  const noCodeBody = await noCode.json()
  const noCodePlain = await plain(enrolled, enrolledCookie)
  if (noCode.status === 200 && noCodeBody.plainOk === false && noCodePlain.status === 428) {
    pass('7a an enrolled account that sends no code still unlocks, and names still answer 428')
  } else {
    fail('7a no-code compatibility', `unlock=${noCode.status} plainOk=${noCodeBody.plainOk} plain=${noCodePlain.status}`)
  }

  // 7c: a wrong code must not grant the names, and must not unlock either.
  const wrong = await unlock(enrolled, enrolledCookie, { code: '000000' })
  const afterWrong = await plain(enrolled, enrolledCookie)
  if (wrong.status === 401 && afterWrong.status === 428) pass('7c a wrong code grants nothing and reports 401')
  else fail('7c wrong code', `unlock=${wrong.status} plain=${afterWrong.status}`)

  // 7d/7e: the same code in the unlock request covers the names as well.
  const oneStep = await unlock(enrolled, enrolledCookie, { code: totp(SECRET) })
  const oneStepBody = await oneStep.json()
  const afterOneStep = await plain(enrolled, enrolledCookie)
  if (oneStep.status === 200 && oneStepBody.plainOk === true && afterOneStep.status === 200) {
    pass('7d one unlock with the code also opens the plaintext names (no second prompt)')
  } else {
    fail('7d one-step unlock', `unlock=${oneStep.status} plainOk=${oneStepBody.plainOk} plain=${afterOneStep.status}`)
  }
  if (oneStepBody.plainOk === true) pass('7e the unlock response tells the console the names are already open')
  else fail('7e plainOk in the unlock response', JSON.stringify(oneStepBody))

  // 7f: an account without a second factor never sees the prompt at all.
  const open = await mount(false)
  const openCookie = await signIn(open)
  const openUnlock = await unlock(open, openCookie)
  const openBody = await openUnlock.json()
  const openPlain = await plain(open, openCookie)
  if (openUnlock.status === 200 && openBody.plainOk === true && openPlain.status === 200) {
    pass('7f an account with no second factor unlocks straight into the names')
  } else {
    fail('7f no second factor', `unlock=${openUnlock.status} plainOk=${openBody.plainOk} plain=${openPlain.status}`)
  }
}

finish()
