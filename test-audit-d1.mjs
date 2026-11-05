// Audit storage moved to D1: a failed audit write must not fail the read it
// describes, /api/audit must page past the old 500-entry cap using D1 totals,
// and the legacy state.audit migration must run exactly once under concurrency.
import { HARNESS, FakeD1, makeEnv, seedState, putSession, legacyCipherRow, call, login, makeReporter } from './test-support/broker-harness.mjs'

const { pass, fail, finish } = makeReporter()

// ============ 1. An audit write failure does not fail /secret ============
{
  const env = makeEnv({
    vault: new FakeD1({ failAuditInsert: true }),
    legacy: new FakeD1({ cipherRows: [await legacyCipherRow()] }),
  })
  await seedState(env)
  await putSession(env)
  const response = await call(env, '/secret?name=' + encodeURIComponent(HARNESS.ITEM), {
    headers: { authorization: 'Bearer ' + HARNESS.AUTH },
  })
  const body = await response.json().catch(() => ({}))
  if (response.status === 200 && body.value === HARNESS.PASSWORD) {
    pass('1a /secret returns 200 with the right value while audit_v2 rejects every INSERT')
  } else {
    fail('1a /secret with a failing audit write', 'status=' + response.status + ' body=' + JSON.stringify(body).slice(0, 160))
  }
  if (env._vault.inserts === 0 && env._vault.executed.some((entry) => /INSERT INTO audit_v2/.test(entry.sql))) {
    pass('1b the audit INSERT was really attempted and really failed (the assertion is not vacuous)')
  } else {
    fail('1b audit INSERT attempt', 'inserts=' + env._vault.inserts)
  }
}

// ============ 2. /api/audit pages past 500 with D1 totals ============
{
  const seeded = []
  for (let i = 0; i < 620; i += 1) seeded.push({ time: new Date(Date.now() - i * 1000).toISOString(), event: 'secret.read', agent: 'a', name: 'i' })
  const env = makeEnv({ vault: new FakeD1({ auditRows: seeded }), legacy: new FakeD1() })
  await seedState(env)
  const cookie = await login(env) // adds one admin.login row through addAudit
  const first = await call(env, '/api/audit?limit=200', { headers: { cookie } })
  const firstBody = await first.json()
  if (first.status === 200 && firstBody.total === 621 && firstBody.hasMore === true
    && firstBody.entries.length === 200 && first.headers.get('x-audit-total') === '621'
    && first.headers.get('x-audit-has-more') === 'true') {
    pass('2a /api/audit reports the real D1 total and hasMore beyond the old 500 cap')
  } else {
    fail('2a /api/audit beyond 500', 'status=' + first.status + ' total=' + firstBody.total + ' hasMore=' + firstBody.hasMore
      + ' entries=' + (firstBody.entries || []).length + ' header=' + first.headers.get('x-audit-total'))
  }
  const third = await call(env, '/api/audit?limit=200&offset=400', { headers: { cookie } })
  const thirdBody = await third.json()
  if (thirdBody.total === 621 && thirdBody.hasMore === true && thirdBody.firstPage === false
    && thirdBody.page === 3 && thirdBody.pageCount === 4 && thirdBody.offset === 400 && thirdBody.limit === 200) {
    pass('2b page 3 of 4 keeps total/hasMore/firstPage/page/pageCount consistent')
  } else {
    fail('2b page 3', JSON.stringify({
      total: thirdBody.total, hasMore: thirdBody.hasMore, firstPage: thirdBody.firstPage,
      page: thirdBody.page, pageCount: thirdBody.pageCount, offset: thirdBody.offset, limit: thirdBody.limit,
    }))
  }
}

// ============ 3. Two concurrent first requests migrate the legacy audit once ============
function legacyEntries() {
  return [
    { time: '2024-01-01T00:00:01.000Z', event: 'secret.read', agent: 'old', name: 'legacy', reason: 'one' },
    { time: '2024-01-01T00:00:02.000Z', event: 'secret.read', agent: 'old', name: 'legacy', reason: 'two' },
    { time: '2024-01-01T00:00:03.000Z', event: 'secret.read', agent: 'old', name: 'legacy', reason: 'three' },
  ]
}
async function stateOf(env) {
  return (await env.BROKER_STATE.get().fetch('https://state/state')).json().then((payload) => payload.state)
}
{
  const env = makeEnv({ vault: new FakeD1(), legacy: new FakeD1() })
  await seedState(env, { audit: legacyEntries() })
  const cookie = await login(env)
  // Both requests see the same state.audit and try to migrate it at once.
  await Promise.all([
    call(env, '/api/audit?limit=50', { headers: { cookie } }),
    call(env, '/api/audit?limit=50', { headers: { cookie } }),
  ])
  const after = await stateOf(env)
  const migrated = env._vault.auditRows.filter((entry) => entry.name === 'legacy')
  const unique = new Set(migrated.map((entry) => JSON.stringify(entry)))
  const marker = after.settings?.legacyAuditMigratingAt
  // skippedInserts staying at 0 is the part that proves the claim: a second
  // migrator that got past the claim would have attempted the same three rows
  // and the idempotent INSERT would have counted three skips.
  if (migrated.length === 3 && unique.size === 3 && (after.audit || []).length === 0
    && marker === undefined && env._vault.skippedInserts === 0) {
    pass('3a concurrent migration writes each legacy entry once and clears state.audit + the claim marker')
  } else {
    fail('3a concurrent migration', JSON.stringify({
      rows: migrated.length, unique: unique.size, stateAudit: (after.audit || []).length, marker, skipped: env._vault.skippedInserts,
    }))
  }
  // A later read sees the settled total, not a half-migrated one.
  const settled = await (await call(env, '/api/audit?limit=10', { headers: { cookie } })).json()
  if (settled.total === 4 && settled.entries.filter((entry) => entry.name === 'legacy').length === 3) {
    pass('3b total is correct after the migration settles (3 legacy + 1 login)')
  } else {
    fail('3b settled total', JSON.stringify({ total: settled.total, names: settled.entries.map((entry) => entry.name) }))
  }
}

// ============ 4. A failed migration releases its claim and can be retried ============
{
  const env = makeEnv({ vault: new FakeD1(), legacy: new FakeD1() })
  await seedState(env, { audit: legacyEntries() })
  const cookie = await login(env)
  env._vault.failNextBatch = true
  const failed = await call(env, '/api/audit?limit=10', { headers: { cookie } })
  const afterFailure = await stateOf(env)
  if (failed.status === 200 && env._vault.auditRows.every((entry) => entry.name !== 'legacy')
    && (afterFailure.audit || []).length === 3 && afterFailure.settings?.legacyAuditMigratingAt === undefined) {
    pass('4a a failed batch leaves state.audit intact but releases the claim (no stuck marker)')
  } else {
    fail('4a failed batch retry state', JSON.stringify({
      status: failed.status, audit: (afterFailure.audit || []).length, marker: afterFailure.settings?.legacyAuditMigratingAt,
    }))
  }
  const retried = await call(env, '/api/audit?limit=10', { headers: { cookie } })
  const afterRetry = await stateOf(env)
  const rows = env._vault.auditRows.filter((entry) => entry.name === 'legacy')
  if (retried.status === 200 && rows.length === 3 && (afterRetry.audit || []).length === 0) {
    pass('4b the very next request retries and completes the migration')
  } else {
    fail('4b migration retry', JSON.stringify({ rows: rows.length, audit: (afterRetry.audit || []).length }))
  }
}

finish()
