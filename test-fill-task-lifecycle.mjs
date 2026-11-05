// Fill task ledger lifecycle: tasks whose executor disappeared must stop
// holding a concurrency slot. countOpenTasks() reads /fill/task/list, so the
// sweep there is what actually frees the slot; /fill/task/expire is the cron
// caller and must stay callable on its own.
import { HARNESS, makeEnv, seedState, doFetch, makeReporter } from './test-support/broker-harness.mjs'

const { pass, fail, finish } = makeReporter()
const TERMINAL = new Set(['completed', 'denied', 'expired', 'cancelled', 'failed'])
const openTasks = (tasks) => (tasks || []).filter((task) => !TERMINAL.has(task.state) && task.cancelRequested !== true)

// ============ 1. Three abandoned tasks are swept and stop counting ============
{
  const env = makeEnv()
  await seedState(env)
  const old = Date.now() - 60 * 60 * 1000
  const ledger = {}
  for (let i = 0; i < 3; i += 1) {
    ledger['task-abandoned-' + i] = {
      taskId: 'task-abandoned-' + i, state: 'authorized', createdAt: old, updatedAt: old,
      itemId: HARNESS.ITEM_ID, itemName: HARNESS.ITEM, agent: HARNESS.AGENT, account: HARNESS.ACCT,
    }
  }
  // Before the sweep, all three are non-terminal: this is the state that used
  // to pin the credential's concurrency slot forever.
  const before = openTasks(Object.values(ledger))
  env._store.fillTasks = ledger
  const listed = await doFetch(env, '/fill/task/list')
  const expired = (listed.tasks || []).filter((task) => task.state === 'expired')
  if (before.length === 3 && expired.length === 3 && openTasks(listed.tasks).length === 0) {
    pass('1a the three abandoned tasks are three open slots before the read and zero after it')
  } else {
    fail('1a abandoned sweep', JSON.stringify({ before: before.length, expired: expired.length, open: openTasks(listed.tasks).length }))
  }
  if (expired.every((task) => task.updatedAt > old)) {
    pass('1b swept tasks were restamped, so the expiry is recorded rather than inferred later')
  } else {
    fail('1b swept timestamps', 'tasks=' + JSON.stringify(expired))
  }
}

// ============ 2. /fill/task/expire is callable as the cron entry point ============
{
  const env = makeEnv()
  await seedState(env)
  const old = Date.now() - 3 * 60 * 60 * 1000
  env._store.fillTasks = {
    'task-running-stale': {
      taskId: 'task-running-stale', state: 'running', createdAt: old, updatedAt: old, claimedBy: 'exec-1',
      itemId: HARNESS.ITEM_ID, itemName: HARNESS.ITEM, agent: HARNESS.AGENT, account: HARNESS.ACCT,
    },
  }
  const result = await doFetch(env, '/fill/task/expire')
  if (result.ok === true && Array.isArray(result.expired) && result.expired.includes('task-running-stale')) {
    pass('2a /fill/task/expire expires a stale running task and reports its id')
  } else {
    fail('2a /fill/task/expire', JSON.stringify(result))
  }
  const listed = await doFetch(env, '/fill/task/list')
  if (openTasks(listed.tasks).length === 0) {
    pass('2b after the cron pass no task still holds a slot')
  } else {
    fail('2b open after cron', JSON.stringify(listed.tasks))
  }
}

// ============ 3. The sweep does not expire a task that is still live ============
{
  const env = makeEnv()
  await seedState(env)
  env._store.fillTasks = {
    'task-live': {
      taskId: 'task-live', state: 'authorized', createdAt: Date.now() - 1000, updatedAt: Date.now() - 1000,
      itemId: HARNESS.ITEM_ID, itemName: HARNESS.ITEM, agent: HARNESS.AGENT, account: HARNESS.ACCT,
    },
  }
  const listed = await doFetch(env, '/fill/task/list')
  const live = listed.tasks.find((task) => task.taskId === 'task-live')
  if (live && live.state === 'authorized' && openTasks(listed.tasks).length === 1) {
    pass('3a a fresh authorized task still counts as open (the sweep is not over-eager)')
  } else {
    fail('3a live task after sweep', JSON.stringify(listed.tasks))
  }
}

finish()
