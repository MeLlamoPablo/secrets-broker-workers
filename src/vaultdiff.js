/**
 * Comparing two brokers, stage 1.
 *
 * Both sides hand over the same Bitwarden blobs that sit in their databases
 * (`2.iv|ct|mac`), so this module never sees a credential and never needs the
 * master key. That is the whole reason sync is possible at all: the ciphertext
 * is portable, the key is not.
 *
 * Comparing is read-only by construction: the diff decides what a merge would
 * do and writes nothing. The panel's "Sync to local" is a separate step
 * (/api/sync/apply) that only ever inserts rows this vault can decrypt — a row
 * whose name does not decrypt here belongs to another vault, and is refused.
 *
 * No Node built-ins here: the worker imports this file too, so the panel can
 * show the same comparison the CLI prints.
 */

export const pullRemote = async (baseUrl, token, { timeoutMs = 15000 } = {}) => {
  const url = String(baseUrl ?? '').replace(/\/+$/, '')
  const response = await fetch(`${url}/sync/pull`, {
    method: 'GET',
    headers: token ? { authorization: `Bearer ${token}` } : {},
    signal: AbortSignal.timeout(timeoutMs),
  })
  const text = await response.text()
  if (!response.ok) {
    let message = text
    try {
      const parsed = JSON.parse(text)
      message = parsed?.error ?? parsed?.message ?? text
    } catch {}
    throw new Error(`${url}/sync/pull answered ${response.status}: ${String(message).slice(0, 200)}`)
  }
  const body = JSON.parse(text)
  if (!Array.isArray(body.items)) throw new Error(`${url}/sync/pull did not return items`)
  return body
}

const stamp = (item) => {
  const at = Date.parse(item.updatedAt ?? item.createdAt ?? '')
  return Number.isNaN(at) ? 0 : at
}

const same = (a, b) =>
  String(a.name ?? '') === String(b.name ?? '') &&
  String(a.data ?? '') === String(b.data ?? '') &&
  String(a.notes ?? '') === String(b.notes ?? '') &&
  String(a.key ?? '') === String(b.key ?? '') &&
  String(a.folderId ?? '') === String(b.folderId ?? '') &&
  (a.deletedAt ? 1 : 0) === (b.deletedAt ? 1 : 0)

/**
 * Work out what a merge would do, without doing it.
 *
 * Every entry is one of:
 *   push     only the local broker has it, or the local copy is newer
 *   pull     only the remote broker has it, or the remote copy is newer
 *   delete   one side is a tombstone (deletedAt set) and the other is not
 *   equal    same ciphertext, nothing to do
 *
 * Newer is decided per item on updatedAt (last write wins), never on the whole
 * vault: a stale snapshot from one side cannot roll the other side back.
 */
export function diffVaults(local, remote) {
  const byId = (items) => new Map((items ?? []).map((item) => [String(item.id), item]))
  const localById = byId(local)
  const remoteById = byId(remote)
  const out = { push: [], pull: [], delete: [], equal: 0, conflict: [], skipped: 0 }

  for (const [id, item] of localById) {
    const other = remoteById.get(id)
    if (!other) {
      // A tombstone on one side and nothing on the other is not a change: the
      // item is already gone everywhere it needs to be.
      if (item.deletedAt) out.skipped += 1
      else out.push.push({ id, item, why: 'local-only' })
      continue
    }
    const localDeleted = Boolean(item.deletedAt)
    const remoteDeleted = Boolean(other.deletedAt)
    if (localDeleted !== remoteDeleted) {
      // Delete beats an older edit; a newer edit beats the delete (resurrection).
      const deleted = localDeleted ? item : other
      if (stamp(deleted) >= stamp(localDeleted ? other : item)) {
        out.delete.push({ id, side: localDeleted ? 'remote' : 'local', item: deleted })
      } else if (localDeleted) {
        out.push.push({ id, item, why: 'local-newer' })
      } else {
        out.pull.push({ id, item: other, why: 'remote-newer' })
      }
      continue
    }
    if (same(item, other)) {
      out.equal += 1
      continue
    }
    const a = stamp(item)
    const b = stamp(other)
    if (a === b) out.conflict.push({ id, local: item, remote: other, why: 'same-timestamp-different-ciphertext' })
    else if (a > b) out.push.push({ id, item, why: 'local-newer' })
    else out.pull.push({ id, item: other, why: 'remote-newer' })
  }
  for (const [id, item] of remoteById) {
    if (localById.has(id)) continue
    if (item.deletedAt) out.skipped += 1
    else out.pull.push({ id, item, why: 'remote-only' })
  }
  return out
}

export const diffCounts = (diff) => ({
  push: diff.push.length,
  pull: diff.pull.length,
  delete: diff.delete.length,
  conflict: diff.conflict.length,
  equal: diff.equal,
  skipped: diff.skipped,
})

/** The same comparison, shaped for the panel: ids and timestamps, no blobs. */
export function diffSummary(diff, { limit = 20 } = {}) {
  const rows = [
    ...diff.push.map((entry) => ({ direction: 'push', id: entry.item.id, updatedAt: entry.item.updatedAt ?? entry.item.createdAt ?? '', why: entry.why })),
    ...diff.pull.map((entry) => ({ direction: 'pull', id: entry.item.id, updatedAt: entry.item.updatedAt ?? entry.item.createdAt ?? '', why: entry.why })),
    ...diff.delete.map((entry) => ({ direction: 'delete', id: entry.item.id, updatedAt: entry.item.updatedAt ?? entry.item.createdAt ?? '', why: entry.side === 'remote' ? 'remote-has-tombstone' : 'local-has-tombstone' })),
    ...diff.conflict.map((entry) => ({ direction: 'conflict', id: entry.local.id, updatedAt: entry.local.updatedAt ?? entry.local.createdAt ?? '', why: entry.why })),
  ]
  return { counts: diffCounts(diff), total: rows.length, rows: rows.slice(0, limit) }
}

const when = (item) => item?.updatedAt ?? item?.createdAt ?? '—'

export function formatDiff(diff, { localUrl, remoteUrl, verbose = false } = {}) {
  const lines = []
  const rowsTotal = diff.push.length + diff.pull.length + diff.delete.length + diff.conflict.length + diff.equal
  lines.push(`local:  ${localUrl}`)
  lines.push(`remote: ${remoteUrl}`)
  lines.push('')
  lines.push(`Compared ${rowsTotal} local items with the remote (deduplicated by id: ${rowsTotal})`)
  lines.push(`  To push (local only / newer locally):     ${diff.push.length}`)
  lines.push(`  To pull (remote only / newer remotely):   ${diff.pull.length}`)
  lines.push(`  To delete (tombstone on one side):        ${diff.delete.length}`)
  lines.push(`  Conflicts (same time, different content): ${diff.conflict.length}`)
  lines.push(`  Equal:                                    ${diff.equal}`)
  if (diff.skipped) lines.push(`  Skipped (tombstone only, the other side never had it): ${diff.skipped}`)
  if (!diff.push.length && !diff.pull.length && !diff.delete.length && !diff.conflict.length) {
    lines.push('')
    lines.push('Both sides already match; nothing to sync.')
    return lines.join('\n')
  }
  const rows = [
    ...diff.push.map((entry) => ['push', entry.item, entry.why]),
    ...diff.pull.map((entry) => ['pull', entry.item, entry.why]),
    ...diff.delete.map((entry) => ['delete', entry.item, entry.side === 'remote' ? 'remote tombstone' : 'local tombstone']),
    ...diff.conflict.map((entry) => ['conflict', entry.local, entry.why]),
  ]
  const shown = verbose ? rows : rows.slice(0, 20)
  lines.push('')
  lines.push('Dir    Item id    Updated                 Reason (ids are ciphertext; names need the master password)')
  for (const [direction, item, why] of shown) {
    const id = String(item.id ?? '').slice(0, 8)
    lines.push(`${direction.padEnd(6, ' ')} ${id.padEnd(10, ' ')} ${String(when(item)).padEnd(22, ' ')} ${why}`)
  }
  if (rows.length > shown.length) lines.push(`… ${rows.length - shown.length} more (add --verbose to show all)`)
  lines.push('')
  lines.push('This is a read-only preview: neither broker was written to.')
  return lines.join('\n')
}
