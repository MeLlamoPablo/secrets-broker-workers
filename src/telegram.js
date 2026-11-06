// Telegram command handler.
//
// The operator wants to answer approvals while away from the console. This adds a
// text interface on the SAME bot the notifications already use, so nothing has to
// be reconfigured.
//
// What it can do: list what is waiting, approve or deny a request, extend or
// revoke a grant, and answer questions about state.
//
// What it must never do: return a credential value, a username or a TOTP seed —
// not even to the operator who owns them. A chat is a copy on someone else's
// server and in a notification database; the value must stay behind a browser
// session. There is no command for it, and no fallback that could grow into one.
//
// Every mutation is authorised by the Shared Secret requirement (the webhook
// secret plus a chat-id allowlist) and recorded in the audit log with source
// 'telegram', so a change made from a phone is as traceable as one made in the
// console.

// Parse a command. Returns { verb, args } or null for free text.
export function parseCommand(text) {
  const raw = String(text ?? '').trim()
  if (!raw) return null
  const cleaned = raw.replace(/^\//, '')
  const [verb, ...rest] = cleaned.split(/\s+/)
  return { verb: String(verb || '').toLowerCase(), args: rest, text: raw }
}

// The help text. Deliberately states what it cannot do, so nobody asks it for a
// password and assumes a failure means the feature is broken.
export const TELEGRAM_HELP = [
  'Console commands (never return any secret values):',
  '/pending — list pending requests',
  '/approve <request#> [once|1h|24h|7d|always] — approve',
  '/deny <request#> — deny',
  '/grants — list grants and their status',
  '/extend <agent> <item> <days|permanent> — extend a grant',
  '/revoke <agent> <item> [action] — revoke a grant',
  '/status — overview',
  '/asksettings — show the auto-approval rule',
  '/auto <agent|*> <duration> <minutes> — auto-approve an Agent’s requests for N minutes',
  '/auto off — turn off auto-approval',
  '',
  'Any other text goes to the AI assistant (read-only).',
  'I can’t read, copy or share secret values; that’s outside what I can do.',
].join('\n')

// A short prefix for a pending entry, so /approve takes a number rather than a
// uuid the operator cannot type on a phone.
export function pendingHandle(entry, index) {
  return '#' + (index + 1)
}

export function formatPendingList(state) {
  const entries = Object.values(state.pending ?? {})
  if (!entries.length) return 'No pending requests.'
  const lines = entries.slice(0, 20).map((entry, index) => {
    const action = entry.action === 'secret.fill' ? 'web fill' : entry.action === 'secret.use' ? 'proxied call' : 'plaintext read'
    return pendingHandle(entry, index) + ' ' + entry.agent + ' → ' + entry.name + ' (' + action + ')'
  })
  return 'Pending:\n' + lines.join('\n') + (entries.length > 20 ? '\n…and ' + (entries.length - 20) + ' more' : '') + '\n\n/approve #1 or /deny #1 to answer.'
}

export function formatGrants(state) {
  const now = Date.now()
  const caps = Object.values(state.capabilities ?? {})
  if (!caps.length) return 'No grants yet.'
  const actionLabel = { 'secret.read': 'read', 'secret.use': 'proxied', 'secret.fill': 'fill' }
  const lines = caps.slice(-20).map((cap) => {
    const status = cap.revokedAt ? 'Revoked' : (cap.expiresAt && cap.expiresAt <= now ? 'Expired' : 'Active')
    const when = cap.expiresAt ? new Date(cap.expiresAt).toLocaleString('zh-CN', { hour12: false }) : 'Permanent'
    return cap.subjectId + ' → ' + cap.itemName + ' · ' + (actionLabel[cap.action] || cap.action) + ' · ' + status + ' · ' + when
  })
  return 'Grants (latest ' + lines.length + '):\n' + lines.join('\n')
}

export function formatStatus(state) {
  const now = Date.now()
  const pending = Object.keys(state.pending ?? {}).length
  const agents = Object.keys(state.agents ?? {}).length
  const items = Object.keys(state.itemIds ?? {}).length
  const expired = Object.values(state.capabilities ?? {}).filter((cap) => !cap.revokedAt && cap.expiresAt && cap.expiresAt <= now).length
  const denied = Object.keys(state.deniedAttempts ?? {}).length
  return ['Overview:', 'Agent count: ' + agents + ', item count: ' + items + '', 'Pending: ' + pending + '', 'Expired grants: ' + expired + '', 'Blocked request types: ' + denied + ''].join('\n')
}

// Resolve '#1' or a raw id to a pending entry.
export function resolvePending(state, handle) {
  const entries = Object.values(state.pending ?? {})
  const text = String(handle ?? '').trim()
  const numbered = /^#?(\d+)$/.exec(text)
  if (numbered) {
    const index = Number(numbered[1]) - 1
    return entries[index] ?? null
  }
  return entries.find((entry) => entry.id === text) ?? null
}

// The auto-approval rule: while it is live, a request from the named agent (or
// from anyone, for '*') is approved without asking. It is time-boxed because an
// unbounded one is a standing grant nobody remembers.
export function autoRuleActive(state, agent, now = Date.now()) {
  const rule = state.settings?.telegramAuto
  if (!rule || rule.until <= now) return null
  if (rule.agent !== '*' && rule.agent !== agent) return null
  return rule
}

export function describeAutoRule(state, now = Date.now()) {
  const rule = state.settings?.telegramAuto
  if (!rule || rule.until <= now) return 'Auto-approval: off'
  const minutesLeft = Math.max(0, Math.round((rule.until - now) / 60000))
  return 'Auto-approval: requests from ' + (rule.agent === '*' ? 'every Agent' : rule.agent) + ', ' + minutesLeft + ' min left'
}
