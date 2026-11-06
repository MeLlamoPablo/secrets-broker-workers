/**
 * http_request failure semantics: the upstream's own error text is audit-only,
 * and a timed-out non-idempotent request is reported as "may have already run"
 * instead of inviting a blind replay.
 *
 * Run: node --import ./test-support/register.mjs test-http-request-errors.mjs
 */
import {
  HARNESS, makeEnv, seedState, putSession, mcpCall, mcpText, legacyCipherRow, FakeD1, makeReporter,
} from './test-support/broker-harness.mjs'

const USE_KEY = `${HARNESS.AGENT}\u0000${HARNESS.ITEM_ID}\u0000secret.use`
const TARGET = 'https://api.example.test/v1/echo'
// A value that can only come from the thrown error's message.
const RAW = 'raw-upstream-detail-9f2c'

const report = makeReporter()
function check(name, condition, detail = '') {
  if (condition) report.pass(name)
  else report.fail(name, detail)
}

async function freshEnv() {
  const env = makeEnv({ legacy: new FakeD1({ cipherRows: [await legacyCipherRow()] }) })
  await seedState(env, {
    capabilities: {
      [USE_KEY]: {
        id: 'cap-use', subjectId: HARNESS.AGENT, accountId: HARNESS.ACCT,
        itemId: HARNESS.ITEM_ID, itemName: HARNESS.ITEM, action: 'secret.use',
        mode: 'preapproved', createdAt: '2024-01-01T00:00:00.000Z', createdBy: 'test',
        expiresAt: null, maxUses: null, usedCount: 0, revokedAt: null, policyVersion: 1,
        targets: ['https://api.example.test'],
      },
    },
    usePolicies: {
      [HARNESS.ITEM_ID]: {
        itemId: HARNESS.ITEM_ID, accountId: HARNESS.ACCT,
        hosts: ['api.example.test'], methods: ['GET', 'POST'], ports: ['443'], pathPrefixes: ['/'],
      },
    },
  })
  await putSession(env)
  return env
}

const realFetch = globalThis.fetch
function failUpstream(message, { name = 'TypeError', code } = {}) {
  globalThis.fetch = async () => {
    const error = new Error(message + ' ' + RAW)
    error.name = name
    if (code) error.code = code
    throw error
  }
}
function lastAudit(env, event) {
  return env._vault.auditRows.filter((row) => row.event === event).at(-1)
}
function upstream(env, method) {
  return mcpCall(env, 'http_request', { name: HARNESS.ITEM, url: TARGET, method }).then(mcpText)
}

async function main() {
  // 1: a timed-out write warns about a possible side effect and hides the raw text.
  {
    const env = await freshEnv()
    failUpstream('timeout while releasing order', { name: 'TimeoutError' })
    const text = await upstream(env, 'POST')
    const row = lastAudit(env, 'secret.use.error')
    check('POST 超时提示上游可能已执行', text.includes('may already have been executed upstream') && !text.includes(RAW), text)
    check('POST 超时文案不含原始错误', !text.includes('timeout while releasing order'), text)
    check('POST 超时写一条审计且带原始错误', Boolean(row) && row.timeout === true && row.idempotent === false && String(row.error).includes('timeout while releasing order'), JSON.stringify(row))
  }

  // 2: a timed-out read is a plain fixed timeout, still without the raw text.
  {
    const env = await freshEnv()
    failUpstream('timeout while listing rows', { name: 'TimeoutError' })
    const text = await upstream(env, 'GET')
    check('GET 超时返回固定文案', text === 'upstream request timed out (15s)', text)
    check('GET 超时文案不含原始错误', !text.includes(RAW), text)
  }

  // 3: a connection failure is a fixed message; the cause is audit-only.
  {
    const env = await freshEnv()
    failUpstream('connect ECONNREFUSED 10.0.0.5:443', { code: 'ECONNREFUSED' })
    const text = await upstream(env, 'GET')
    const row = lastAudit(env, 'secret.use.error')
    check('连接失败返回固定文案', text === 'upstream request failed', text)
    check('连接失败文案不含原始错误', !text.includes(RAW) && !text.includes('10.0.0.5'), text)
    check('连接失败写审计且带原始错误', Boolean(row) && row.timeout === false && String(row.error).includes('10.0.0.5'), JSON.stringify(row))
  }

  globalThis.fetch = realFetch
  report.finish()
}

main().catch((error) => {
  globalThis.fetch = realFetch
  console.log('FAIL  suite crashed :: ' + (error?.stack ?? error))
  process.exit(1)
})
