// A first connection is an approval, so it has to reach the operator even with
// the console closed. This pins two things: the Worker now fans the request out
// to the configured channels (agent + time only, never an item name), and the
// service worker prefers the connection queue and falls back to item requests.
import { readFileSync } from 'node:fs'
import vm from 'node:vm'
import worker from './src/index.js'
import { HARNESS, makeEnv, seedState, putSession, tokenHash, makeReporter } from './test-support/broker-harness.mjs'

const { pass, fail, finish } = makeReporter()

// ============ 1. A pending connection notifies the operator ============
{
  const env = makeEnv()
  await seedState(env, {
    // Created after CONNECTION_ADMISSION_EPOCH, so the agent is not
    // grandfathered and the first call really does create a pending row.
    connectionPolicy: { required: true },
    agents: {
      [HARNESS.AGENT]: {
        hash: await tokenHash(), allow: [HARNESS.ITEM], groups: [], allowAll: false, write: true,
        legacy: true, account: HARNESS.ACCT, createdAt: '2027-01-01T00:00:00.000Z',
      },
    },
    settings: {
      notifications: { telegram: { botToken: 'TEST-BOT', chatId: 'TEST-CHAT' } },
      vaultEmail: HARNESS.ACCT,
    },
  })
  await putSession(env)
  const calls = []
  const realFetch = globalThis.fetch
  globalThis.fetch = async (url, init = {}) => {
    calls.push({ url: String(url), init })
    return new Response('{}', { status: 200 })
  }
  const waits = []
  try {
    const response = await worker.fetch(new Request('https://broker.test/secret?name=' + HARNESS.ITEM, {
      headers: { authorization: 'Bearer ' + HARNESS.AUTH, 'cf-connecting-ip': '203.0.113.9' },
    }), env, { waitUntil: (promise) => { waits.push(promise) } })
    const body = await response.json().catch(() => ({}))
    if (response.status === 202 && body.reasonCode === 'connection-pending') {
      pass('1a the agent gets the pending answer before any notification work')
    } else {
      fail('1a pending answer', JSON.stringify({ status: response.status, body }).slice(0, 200))
    }
    await Promise.all(waits)
  } finally {
    globalThis.fetch = realFetch
  }
  const telegram = calls.filter((entry) => entry.url.includes('api.telegram.org'))
  if (telegram.length === 1) {
    pass('1b the connection request fans out to the configured Telegram channel')
  } else {
    fail('1b telegram calls', JSON.stringify(calls.map((entry) => entry.url)).slice(0, 220))
  }
  const sent = telegram[0] ? JSON.parse(telegram[0].init.body) : {}
  // The agent and the request time are allowed; an item name or a secret would
  // turn a notification channel into a data leak.
  if (sent.text && sent.text.includes(HARNESS.AGENT) && sent.text.includes('申请首次连接')) {
    pass('1c the notification names the agent and the request')
  } else {
    fail('1c notification text', String(sent.text ?? '').slice(0, 200))
  }
  if (sent.text && !sent.text.includes(HARNESS.ITEM) && !sent.text.includes(HARNESS.PASSWORD)) {
    pass('1d the notification carries no item name and no plaintext')
  } else {
    fail('1d notification leaked an item', String(sent.text ?? '').slice(0, 200))
  }
  if (sent.text && sent.text.includes('https://broker.test/#pending')) {
    pass('1e the notification points at the pending panel')
  } else {
    fail('1e notification link', String(sent.text ?? '').slice(0, 200))
  }
  if (calls.every((entry) => !entry.url.includes('/push'))) {
    pass('1f no VAPID keys are minted for a deployment with no push subscriber')
  } else {
    fail('1f unexpected push work', JSON.stringify(calls.map((entry) => entry.url)).slice(0, 220))
  }
}

// ============ 2. The service worker prefers the connection queue ============
const SW = readFileSync(new URL('./public/sw.js', import.meta.url), 'utf8')
async function pushOnce({ ok = true, state = {} } = {}) {
  const listeners = {}
  const shown = []
  const self = {
    location: { origin: 'https://broker.test' },
    addEventListener: (type, handler) => { listeners[type] = handler },
    registration: { showNotification: async (title, options) => { shown.push({ title, options }) } },
  }
  const fetch = async () => ({ ok, json: async () => state })
  vm.runInNewContext(SW, { self, fetch, URL })
  let pending = Promise.resolve()
  listeners.push({ waitUntil: (promise) => { pending = promise } })
  await pending
  return shown[0]
}
{
  const notice = await pushOnce({
    state: {
      connections: { pending: [{ id: 'c1', agent: 'connecting-agent' }] },
      pending: [{ id: 'p1', agent: 'item-agent', name: 'secret-item' }],
    },
  })
  if (notice && notice.title === 'Secrets Broker 连接请求' && notice.options.body.includes('connecting-agent')) {
    pass('2a a waiting connection outranks a waiting item request')
  } else {
    fail('2a connection notice', JSON.stringify(notice).slice(0, 200))
  }
  if (notice && !notice.options.body.includes('secret-item')) {
    pass('2b the connection notice does not mention the item queue')
  } else {
    fail('2b connection notice leaked item', JSON.stringify(notice).slice(0, 200))
  }
  if (notice && notice.options.data?.url === '/#pending') {
    pass('2c clicking the notice opens the pending panel')
  } else {
    fail('2c click target', JSON.stringify(notice?.options?.data).slice(0, 160))
  }
}
{
  const notice = await pushOnce({ state: { connections: { pending: [] }, pending: [{ id: 'p1', agent: 'item-agent', name: 'secret-item' }] } })
  if (notice && notice.title === 'Secrets Broker 授权请求' && notice.options.body.includes('secret-item')) {
    pass('2d with no waiting connection the item request still produces its notice')
  } else {
    fail('2d item notice', JSON.stringify(notice).slice(0, 200))
  }
}
{
  // A logged-out browser gets 401: the worker keeps the generic copy instead of
  // rendering the agent or item that the session could not be checked against.
  const notice = await pushOnce({ ok: false, state: { connections: { pending: [{ agent: 'should-not-show' }] } } })
  if (notice && notice.options.body === '有新的授权请求，点击查看') {
    pass('2e a 401 keeps the generic copy and leaks no agent name')
  } else {
    fail('2e 401 copy', JSON.stringify(notice).slice(0, 200))
  }
}

finish()
