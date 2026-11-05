// Reading one credential by id: get_credential and materialize_redeem must use
// the approved item id instead of scanning (and decrypting) the whole vault.
// A materialize job written before itemId existed still falls back to the name
// lookup rather than failing.
import { HARNESS, FakeD1, makeEnv, seedState, putSession, legacyCipherRow, login, call, mcpCall, mcpText, makeReporter } from './test-support/broker-harness.mjs'

const { pass, fail, finish } = makeReporter()
const TARGET = { path: 'C:/tmp/harness.env', key: 'HARNESS_KEY' }

function resetCipherCounters(env) {
  env._legacy.cipherQueries = 0
  env._legacy.cipherRowsRead = 0
  env._legacy.executed = []
}

function cipherStatements(env) {
  return env._legacy.executed.filter((entry) => /FROM ciphers/.test(entry.sql))
}

// ============ 1. get_credential reads one row, one decrypt ============
{
  const env = makeEnv({ legacy: new FakeD1({ cipherRows: [await legacyCipherRow()] }) })
  await seedState(env)
  await putSession(env)
  resetCipherCounters(env)
  const result = await mcpCall(env, 'get_credential', { name: HARNESS.ITEM })
  const text = mcpText(result)
  const statements = cipherStatements(env)
  let parsed = {}
  try { parsed = JSON.parse(text) } catch {}
  if (parsed.password === HARNESS.PASSWORD && parsed.username === 'alice') {
    pass('1a get_credential returns the credential')
  } else {
    fail('1a get_credential value', 'text=' + text.slice(0, 200))
  }
  if (statements.length === 1 && /WHERE id = \?/.test(statements[0].sql)
    && env._legacy.cipherRowsRead === 1) {
    pass('1b get_credential issued one WHERE id = ? statement and decrypted one row')
  } else {
    fail('1b get_credential reads', JSON.stringify({
      statements: statements.map((entry) => entry.sql.slice(0, 120)), rowsRead: env._legacy.cipherRowsRead,
    }).slice(0, 320))
  }
  if (!statements.some((entry) => /WHERE user_id = \?/.test(entry.sql) && !/WHERE id = \?/.test(entry.sql))) {
    pass('1c no whole-vault scan ran during the read')
  } else {
    fail('1c whole-vault scan', JSON.stringify(statements.map((entry) => entry.sql.slice(0, 120))))
  }
}

// ============ 2. materialize_redeem uses the approved item id ============
{
  const env = makeEnv({ legacy: new FakeD1({ cipherRows: [await legacyCipherRow()] }) })
  await seedState(env, {
    settings: { materializePaths: [TARGET.path] },
    pending: {
      'p-materialize': {
        id: 'p-materialize', agent: HARNESS.AGENT, name: HARNESS.ITEM, action: 'secret.materialize',
        itemId: HARNESS.ITEM_ID, account: HARNESS.ACCT, target: TARGET,
        requestedAt: new Date().toISOString(),
      },
    },
  })
  await putSession(env)
  const cookie = await login(env)
  const decided = await call(env, '/api/pending/decide', {
    method: 'POST',
    headers: { 'content-type': 'application/json', cookie },
    body: JSON.stringify({ id: 'p-materialize', decision: 'once' }),
  })
  const decidedBody = await decided.json()
  const job = (await env.BROKER_STATE.get().fetch('https://state/state')).json()
    .then((payload) => payload.state.materializeJobs?.['p-materialize'])
  const approvedJob = await job
  if (decidedBody.outcome?.error || !approvedJob?.itemId) {
    fail('2 setup: approved materialize job', JSON.stringify(decidedBody.outcome).slice(0, 200))
  }
  resetCipherCounters(env)
  const redeemed = await mcpCall(env, 'materialize_redeem', { id: 'p-materialize' })
  const text = mcpText(redeemed)
  const statements = cipherStatements(env)
  let parsed = {}
  try { parsed = JSON.parse(text) } catch {}
  // The path comes back normalised (drive letter lowercased), which is the
  // documented behaviour of the allowlist comparison.
  if (parsed.value === HARNESS.PASSWORD && String(parsed.path).toLowerCase() === TARGET.path.toLowerCase()
    && parsed.key === TARGET.key) {
    pass('2a materialize_redeem still returns the value it always returned')
  } else {
    fail('2a materialize_redeem value', 'text=' + text.slice(0, 200))
  }
  if (statements.length === 1 && /WHERE id = \?/.test(statements[0].sql) && env._legacy.cipherRowsRead === 1) {
    pass('2b materialize_redeem read the approved item id, not a whole-vault scan')
  } else {
    fail('2b materialize_redeem reads', JSON.stringify({
      statements: statements.map((entry) => entry.sql.slice(0, 120)), rowsRead: env._legacy.cipherRowsRead,
    }).slice(0, 320))
  }
}

// ============ 3. A job without itemId falls back to the name lookup ============
{
  const env = makeEnv({ legacy: new FakeD1({ cipherRows: [await legacyCipherRow()] }) })
  await seedState(env, {
    settings: { materializePaths: [TARGET.path] },
    materializeJobs: {
      'job-without-item-id': {
        id: 'job-without-item-id', agent: HARNESS.AGENT, name: HARNESS.ITEM, account: HARNESS.ACCT,
        target: TARGET, createdAt: new Date().toISOString(), expiresAt: Date.now() + 10 * 60 * 1000, redeemedAt: null,
      },
    },
  })
  await putSession(env)
  resetCipherCounters(env)
  const redeemed = await mcpCall(env, 'materialize_redeem', { id: 'job-without-item-id' })
  const text = mcpText(redeemed)
  const statements = cipherStatements(env)
  let parsed = {}
  try { parsed = JSON.parse(text) } catch {}
  if (redeemed.status === 200 && parsed.value === HARNESS.PASSWORD) {
    pass('3a a job without itemId is not a 500: it falls back and returns the value')
  } else {
    fail('3a job without itemId', 'status=' + redeemed.status + ' text=' + text.slice(0, 200))
  }
  if (statements.length === 1 && /WHERE user_id = \?/.test(statements[0].sql) && !/WHERE id = \?/.test(statements[0].sql)) {
    pass('3b the fallback really is the name path (the id fast path needs an id)')
  } else {
    fail('3b fallback statement', JSON.stringify(statements.map((entry) => entry.sql.slice(0, 140))))
  }
}

finish()
