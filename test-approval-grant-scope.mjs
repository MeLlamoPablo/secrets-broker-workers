// Approval decisions must write exactly the authority the operator approved:
// a refused decision writes nothing, a fill approval never mints a plaintext
// read, and an approved read is tagged with its action.
import { HARNESS, makeEnv, seedState, login, call, makeReporter } from './test-support/broker-harness.mjs'

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
  // A grant whose window has closed used to keep its row and its "已过期"
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

finish()
