// Approval decisions must write exactly the authority the operator approved:
// a refused decision writes nothing, a fill approval never mints a plaintext
// read, and an approved read is tagged with its action.
import { HARNESS, makeEnv, seedState, login, call, putSession, mcpCall, mcpText, tokenHash, makeReporter } from './test-support/broker-harness.mjs'
import { uiHtml } from './src/ui.js'

const { pass, fail, finish } = makeReporter()

async function decidedState(env) {
  return (await env.BROKER_STATE.get().fetch('https://state/state')).json().then((payload) => payload.state)
}

// ============ 1. A refused decision leaves no grant ============
{
  // The request carries no item id, so the action check refuses it. The old
  // code had already written a name-keyed read grant by this point.
  const env = makeEnv()
  await seedState(env, {
    policies: {},
    itemIds: {},
    pending: {
      'p-denied': {
        id: 'p-denied', agent: HARNESS.AGENT, name: 'denied-item', action: 'secret.read',
        itemId: '', account: HARNESS.ACCT, requestedAt: new Date().toISOString(),
      },
    },
  })
  const cookie = await login(env)
  const response = await call(env, '/api/pending/decide', {
    method: 'POST',
    headers: { 'content-type': 'application/json', cookie },
    body: JSON.stringify({ id: 'p-denied', decision: 'once' }),
  })
  const body = await response.json()
  const state = await decidedState(env)
  const grant = state.grants[HARNESS.AGENT + '\u0000denied-item']
  if (body.outcome?.error === 'no-item-id' && !grant) {
    pass('1a a refused approval writes no grant')
  } else {
    fail('1a refused approval grant', JSON.stringify({ outcome: body.outcome, grant }).slice(0, 200))
  }
  if ((state.capabilities || {}) && Object.keys(state.capabilities || {}).length === 0) {
    pass('1b a refused approval also mints no capability')
  } else {
    fail('1b refused approval capabilities', JSON.stringify(state.capabilities).slice(0, 200))
  }
}

// ============ 2. An approved read is tagged secret.read ============
{
  const env = makeEnv()
  await seedState(env, {
    policies: {},
    pending: {
      'p-ok': {
        id: 'p-ok', agent: HARNESS.AGENT, name: HARNESS.ITEM, action: 'secret.read',
        itemId: HARNESS.ITEM_ID, account: HARNESS.ACCT, requestedAt: new Date().toISOString(),
      },
    },
  })
  const cookie = await login(env)
  const response = await call(env, '/api/pending/decide', {
    method: 'POST',
    headers: { 'content-type': 'application/json', cookie },
    body: JSON.stringify({ id: 'p-ok', decision: 'once' }),
  })
  const body = await response.json()
  const state = await decidedState(env)
  const grant = state.grants[HARNESS.AGENT + '\u0000' + HARNESS.ITEM]
  if (!body.outcome?.error && grant && grant.action === 'secret.read' && grant.name === HARNESS.ITEM) {
    pass('2a an approved read writes one grant keyed by agent+name and tagged action secret.read')
  } else {
    fail('2a approved read grant', JSON.stringify({ outcome: body.outcome, grant }).slice(0, 220))
  }
}

// ============ 3. An approved fill never writes a read grant ============
{
  const env = makeEnv()
  await seedState(env, {
    policies: {},
    credentialKinds: { [HARNESS.ITEM_ID]: 'web' },
    fillPolicies: { [HARNESS.ITEM_ID]: { kind: 'web', origins: ['https://example.com'], actions: ['login'] } },
    pending: {
      'p-fill': {
        id: 'p-fill', agent: HARNESS.AGENT, name: HARNESS.ITEM, action: 'secret.fill',
        itemId: HARNESS.ITEM_ID, account: HARNESS.ACCT, targetOrigin: 'https://example.com',
        requestedAt: new Date().toISOString(),
      },
    },
  })
  const cookie = await login(env)
  const response = await call(env, '/api/pending/decide', {
    method: 'POST',
    headers: { 'content-type': 'application/json', cookie },
    body: JSON.stringify({ id: 'p-fill', decision: 'once' }),
  })
  const body = await response.json()
  const state = await decidedState(env)
  const readGrant = state.grants?.[HARNESS.AGENT + '\u0000' + HARNESS.ITEM]
  const readCapability = Object.values(state.capabilities || {}).find((capability) => (
    capability.itemId === HARNESS.ITEM_ID && capability.action === 'secret.read' && !capability.revokedAt
  ))
  if (!body.outcome?.error && !readGrant && !readCapability) {
    pass('3a an approved fill writes no read grant and mints no secret.read capability')
  } else {
    fail('3a approved fill scope', JSON.stringify({ outcome: body.outcome, readGrant, readCapability }).slice(0, 260))
  }
}

// ============ 4. Expired grants leave the list but stay in the audit ============
{
  // A grant whose window has closed used to keep its row and its "Expired"
  // badge forever. The next state read has to delete it while the audit keeps
  // the trace, so the operator can still explain what authority once existed.
  const env = makeEnv()
  const now = Date.now()
  const key = (name) => HARNESS.AGENT + '\u0000' + name
  const grant = (name, extra = {}) => ({
    agent: HARNESS.AGENT, name, mode: 'share', createdAt: '2024-01-01',
    expiresAt: now + 3600e3, reads: 0, maxReads: null, revokedAt: null, account: HARNESS.ACCT, ...extra,
  })
  await seedState(env, {
    grants: {
      [key('expired-item')]: grant('expired-item', { expiresAt: now - 60e3 }),
      [key('future-item')]: grant('future-item'),
      [key('permanent-item')]: grant('permanent-item', { expiresAt: 0 }),
      [key('revoked-item')]: grant('revoked-item', { revokedAt: '2024-01-02' }),
    },
    pending: {},
  })
  const cookie = await login(env)
  const response = await call(env, '/api/state', { headers: { cookie } })
  const view = await response.json()
  const listed = (view.grants || []).map((entry) => entry.name)
  if (!listed.includes('expired-item')) {
    pass('4a an expired grant is gone from the state list')
  } else {
    fail('4a expired grant still listed', JSON.stringify(listed).slice(0, 200))
  }
  if (['future-item', 'permanent-item', 'revoked-item'].every((name) => listed.includes(name))) {
    pass('4b future, permanent and revoked grants stay in the list')
  } else {
    fail('4b live grants dropped', JSON.stringify(listed).slice(0, 200))
  }
  const raw = await decidedState(env)
  if (!raw.grants?.[key('expired-item')] && raw.grants?.[key('future-item')]) {
    pass('4c the expired grant record is deleted from state, not only hidden')
  } else {
    fail('4c expired record survived', JSON.stringify(Object.keys(raw.grants || {})).slice(0, 200))
  }
  const audits = (env._vault.auditRows || []).filter((entry) => entry.event === 'grant.expire')
  const trace = audits.find((entry) => entry.name === 'expired-item' && entry.agent === HARNESS.AGENT)
  if (trace && trace.expiresAt === now - 60e3) {
    pass('4d the deletion writes a grant.expire audit line with the expiry that ended it')
  } else {
    fail('4d missing grant.expire audit', JSON.stringify(audits).slice(0, 240))
  }
  if (!(env._vault.auditRows || []).some((entry) => entry.event === 'grant.expire' && entry.name === 'future-item')) {
    pass('4e a live grant writes no expiry audit')
  } else {
    fail('4e live grant audited as expired', 'future-item')
  }
}

// ============ 5. A timed write approval stops asking on every write ============
{
  const env = makeEnv()
  await putSession(env)
  await seedState(env, {
    policies: {}, pending: {}, writeTickets: {},
    agents: {
      [HARNESS.AGENT]: {
        hash: await tokenHash(), allow: [], groups: [], allowAll: true, write: true,
        legacy: false, account: HARNESS.ACCT, createdAt: '2024-01-01',
      },
    },
  })
  const key = HARNESS.AGENT + '\u0000written-item'
  const parse = (text) => { try { return JSON.parse(text) } catch { return {} } }
  const first = parse(mcpText(await mcpCall(env, 'put_secret', { name: 'written-item', value: 'VALUE-A' })))
  const firstState = await decidedState(env)
  const pending = Object.values(firstState.pending ?? {})[0]
  if (first.status === 'pending-approval' && pending?.action === 'secret.write') {
    pass('5a an unauthorised write asks once and stores no value')
  } else {
    fail('5a first write', JSON.stringify({ first, pending }).slice(0, 240))
  }
  const cookie = await login(env)
  const before = Date.now()
  const decided = await call(env, '/api/pending/decide', {
    method: 'POST',
    headers: { 'content-type': 'application/json', cookie },
    body: JSON.stringify({ id: pending?.id, decision: '24h' }),
  })
  const decidedBody = await decided.json()
  const state = await decidedState(env)
  const ticket = state.writeTickets?.[key]
  const inDay = ticket && Math.abs((ticket.expiresAt - before) - 86400e3) < 5000
  if (decidedBody.outcome?.approved === true && ticket?.mode === '24h' && ticket?.singleUse === false && inDay) {
    pass('5b a 24h approval is a standing write authorisation for that item')
  } else {
    fail('5b ticket duration', JSON.stringify({ outcome: decidedBody.outcome, ticket }).slice(0, 240))
  }
  const once = parse(mcpText(await mcpCall(env, 'put_secret', { name: 'written-item', value: 'VALUE-A' })))
  const again = parse(mcpText(await mcpCall(env, 'put_secret', { name: 'written-item', value: 'VALUE-A' })))
  const after = await decidedState(env)
  const pendingLeft = Object.values(after.pending ?? {}).filter((entry) => entry.action === 'secret.write')
  if (once.status === 'written' && again.status === 'written' && pendingLeft.length === 0) {
    pass('5c the second and third writes reuse the authorisation instead of asking again')
  } else {
    fail('5c repeated writes', JSON.stringify({ once, again, pendingLeft }).slice(0, 260))
  }
  if (after.writeTickets?.[key] && after.writeTickets[key].mode === '24h') {
    pass('5d a timed authorisation survives the write that used it')
  } else {
    fail('5d timed ticket consumed', JSON.stringify(after.writeTickets ?? {}).slice(0, 200))
  }
  const writes = (env._vault.auditRows || []).filter((entry) => entry.event === 'secret.write')
  const valueLeaked = JSON.stringify(after).includes('VALUE-A')
  if (writes.length === 2 && writes.every((entry) => entry.source === 'authorisation') && writes.every((entry) => entry.mode === '24h') && !valueLeaked) {
    pass('5e both writes are audited as the timed authorisation, and no value enters state')
  } else {
    fail('5e write audit', JSON.stringify({ writes, valueLeaked }).slice(0, 300))
  }
  if (uiHtml.includes('Write grant: Just once still asks every time') && uiHtml.includes("['always', 'Permanent']")) {
    pass('5f the console offers Just once plus durations for a write approval')
  } else {
    fail('5f write duration UI', 'missing duration chips or hint')
  }
}

// ============ 6. Just once stays the per-call confirmation ============
{
  const env = makeEnv()
  await putSession(env)
  await seedState(env, {
    policies: {}, pending: {}, writeTickets: {},
    agents: {
      [HARNESS.AGENT]: {
        hash: await tokenHash(), allow: [], groups: [], allowAll: true, write: true,
        legacy: false, account: HARNESS.ACCT, createdAt: '2024-01-01',
      },
    },
  })
  const parse = (text) => { try { return JSON.parse(text) } catch { return {} } }
  const first = parse(mcpText(await mcpCall(env, 'put_secret', { name: 'once-item', value: 'VALUE-B' })))
  const state0 = await decidedState(env)
  const pending = Object.values(state0.pending ?? {})[0]
  const cookie = await login(env)
  const before = Date.now()
  await call(env, '/api/pending/decide', {
    method: 'POST',
    headers: { 'content-type': 'application/json', cookie },
    body: JSON.stringify({ id: pending?.id, decision: 'once' }),
  })
  const state1 = await decidedState(env)
  const ticket = state1.writeTickets?.[HARNESS.AGENT + '\u0000once-item']
  const tenMinutes = ticket && Math.abs((ticket.expiresAt - before) - 600e3) < 5000
  if (first.status === 'pending-approval' && ticket?.singleUse === true && ticket?.mode === 'once' && tenMinutes) {
    pass('6a Just once mints a single-use ten-minute ticket')
  } else {
    fail('6a once ticket', JSON.stringify({ first, ticket }).slice(0, 240))
  }
  const write = parse(mcpText(await mcpCall(env, 'put_secret', { name: 'once-item', value: 'VALUE-B' })))
  const retry = parse(mcpText(await mcpCall(env, 'put_secret', { name: 'once-item', value: 'VALUE-B' })))
  const state2 = await decidedState(env)
  const askedAgain = Object.values(state2.pending ?? {}).some((entry) => entry.action === 'secret.write')
  if (write.status === 'written' && retry.status === 'pending-approval' && askedAgain) {
    pass('6b the single-use ticket is spent, so the next write asks again')
  } else {
    fail('6b once replay', JSON.stringify({ write, retry, askedAgain }).slice(0, 240))
  }
  const audit = (env._vault.auditRows || []).filter((entry) => entry.event === 'secret.write')
  if (audit.length === 1 && audit[0].source === 'approval') {
    pass('6c the per-call write is audited as an approval, not a standing grant')
  } else {
    fail('6c once audit', JSON.stringify(audit).slice(0, 240))
  }
}

// ============ 7. An out-of-scope write is refused before anyone is asked ============
{
  const env = makeEnv()
  await putSession(env)
  await seedState(env, {
    policies: {}, pending: {}, writeTickets: {},
    agents: {
      [HARNESS.AGENT]: {
        hash: await tokenHash(), allow: [HARNESS.ITEM], groups: [], allowAll: false, write: true,
        legacy: false, account: HARNESS.ACCT, createdAt: '2024-01-01',
      },
    },
  })
  const raw = mcpText(await mcpCall(env, 'put_secret', { name: 'outside-item', value: 'VALUE-C' }))
  const state = await decidedState(env)
  if (raw.includes('outside the agent scope') && Object.keys(state.pending ?? {}).length === 0 && Object.keys(state.writeTickets ?? {}).length === 0) {
    pass('7a an out-of-scope write is denied without a pending approval')
  } else {
    fail('7a out-of-scope write', JSON.stringify({ raw: raw.slice(0, 180), pending: state.pending }).slice(0, 260))
  }
}

finish()
