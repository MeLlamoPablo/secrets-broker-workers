// The overview card and its detail sheet must read one source. The card is
// /api/stats over the whole window; the sheet used to filter the 20-row
// /api/state slice, so it regularly said 暂无 while the card showed a number.
// This pins the server half: only secret.read counts as a read, and a write in
// the same window leaves totalReads alone.
import { HARNESS, makeEnv, FakeD1, legacyCipherRow, seedState, putSession, call, login, mcpCall, mcpText, tokenHash, makeReporter } from './test-support/broker-harness.mjs'
import { uiHtml } from './src/ui.js'

const { pass, fail, finish } = makeReporter()
const parse = (text) => { try { return JSON.parse(text) } catch { return {} } }

async function decidedState(env) {
  return (await env.BROKER_STATE.get().fetch('https://state/state')).json().then((payload) => payload.state)
}

async function stats(env, cookie) {
  return (await call(env, '/api/stats?range=24h', { headers: { cookie } })).json()
}

// ============ 1. A write does not move the reads number ============
{
  const env = makeEnv({ legacy: new FakeD1({ cipherRows: [await legacyCipherRow()] }) })
  await putSession(env)
  await seedState(env, {
    policies: { [HARNESS.ITEM]: { noApproval: true } }, pending: {}, writeTickets: {},
    agents: {
      [HARNESS.AGENT]: {
        hash: await tokenHash(), allow: [], groups: [], allowAll: true, write: true,
        legacy: true, account: HARNESS.ACCT, createdAt: '2024-01-01',
      },
    },
  })
  const read = await call(env, '/secret?name=' + encodeURIComponent(HARNESS.ITEM), { headers: { authorization: 'Bearer ' + HARNESS.AUTH } })
  if (read.status === 200) {
    pass('1a the harness performed a real secret.read')
  } else {
    fail('1a read', 'status=' + read.status)
  }
  const cookie = await login(env)
  const afterRead = await stats(env, cookie)
  if (afterRead.totalReads === 1) {
    pass('1b /api/stats counts the read in the window')
  } else {
    fail('1b reads after read', JSON.stringify(afterRead).slice(0, 220))
  }
  // Make the write allowed, then perform it through the same approval path the
  // console uses.
  const first = parse(mcpText(await mcpCall(env, 'put_secret', { name: 'written-item', value: 'VALUE-A' })))
  const pending = Object.values((await decidedState(env)).pending ?? {})[0]
  await call(env, '/api/pending/decide', {
    method: 'POST',
    headers: { 'content-type': 'application/json', cookie },
    body: JSON.stringify({ id: pending?.id, decision: '24h' }),
  })
  const write = parse(mcpText(await mcpCall(env, 'put_secret', { name: 'written-item', value: 'VALUE-A' })))
  if (first.status === 'pending-approval' && write.status === 'written') {
    pass('1c the write was approved and performed once')
  } else {
    fail('1c write', JSON.stringify({ first, write }).slice(0, 220))
  }
  const afterWrite = await stats(env, cookie)
  if (afterWrite.totalReads === 1) {
    pass('1d a secret.write in the same window leaves totalReads unchanged')
  } else {
    fail('1d reads after write', JSON.stringify({ afterRead: afterRead.totalReads, afterWrite: afterWrite.totalReads }))
  }
}

// ============ 2. The UI reads detail panels from /api/audit ============
// Every panel the report named must ask the paged trail, not the 20-row slice:
// the reads sheet, agent's five rows, item usage/refusals, agent detail, login
// history and 最近动态. A future edit that puts app.data.audit back fails here.
{
  const needles = [
    ["auditPage({ event: 'secret.read', from: rangeStartIso(), limit: 30 })", 'the reads KPI sheet asks the same window as /api/stats'],
    ["auditPage({ agent: name, limit: 5 })", 'the agent detail asks for its five latest events'],
    ["auditPage({ item: name, limit: 30 })", 'the item sheet asks for usage and refusals'],
    ["auditPage({ agent, item: name, limit: 15 })", 'the grant sheet asks for its own usage'],
    ["auditPage({ event: 'login', limit: 50 })", 'login history asks the login group'],
    ["auditPage({ limit: 8 })", '最近动态 asks the newest rows of the trail'],
    ["if (onOverview) { loadStats(); loadRecent() }", 'the 30s tick refreshes counts and recent activity on the overview'],
  ]
  for (const [needle, label] of needles) {
    if (uiHtml.includes(needle)) pass('2 ' + label)
    else fail('2 ' + label, 'missing: ' + needle)
  }
  // The reads branch must not fall back to the slice. Scope the check to the
  // branch itself so app.data.audit elsewhere (search fallbacks) is not counted.
  const readsBranch = uiHtml.slice(uiHtml.indexOf('async function openKpiModal'), uiHtml.indexOf("} else if (kind === 'agents')"))
  if (readsBranch.includes('auditPage(') && !readsBranch.includes('app.data.audit')) {
    pass('2h the reads sheet no longer filters app.data.audit')
  } else {
    fail('2h reads branch', readsBranch.slice(0, 200))
  }
}

finish()
