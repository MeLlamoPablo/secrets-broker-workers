// Local, offline backup of the broker's state directory.
//
// The files are already protected at rest: the paired-device key and local
// agent tokens are DPAPI/Keychain blobs, and the cache holds sealed rows. A
// backup is therefore only restorable by the same OS user; that is the point,
// not a limitation to work around with a plaintext export.
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

const SENTINEL = 'backup.json'

export function brokerHome() {
  return process.env.BROKER_HOME || path.join(os.homedir(), '.secrets-broker')
}

function assertOutside(source, target) {
  const relative = path.relative(source, target)
  if (relative && !relative.startsWith('..') && !path.isAbsolute(relative)) {
    throw new Error('backup destination must be outside the broker state directory')
  }
}

export function backup({ out, home = brokerHome(), now = () => new Date() } = {}) {
  const source = path.resolve(home)
  if (!fs.existsSync(source)) throw new Error('no broker state yet: ' + source)
  const target = path.resolve(out || path.join(os.homedir(), 'secrets-broker-backup-' + now().toISOString().replace(/[:.]/g, '-')))
  assertOutside(source, target)
  if (fs.existsSync(target)) throw new Error('backup destination already exists: ' + target)

  fs.mkdirSync(path.dirname(target), { recursive: true })
  // Match "tmp" against the path relative to the state directory, not the
  // absolute one. On Linux the temp root is /tmp, so an absolute match excludes
  // every entry, copies nothing and leaves the destination missing; the sentinel
  // write then fails with ENOENT.
  const keep = (file) => {
    const relative = path.relative(source, file)
    return !relative || !relative.split(path.sep).includes('tmp')
  }
  fs.cpSync(source, target, {
    recursive: true,
    errorOnExist: true,
    filter: keep,
  })
  fs.writeFileSync(path.join(target, SENTINEL), JSON.stringify({
    format: 'secrets-broker-local-backup-v1',
    createdAt: now().toISOString(),
    source,
    restore: 'same OS user only; the device key and local tokens are DPAPI/Keychain protected',
  }, null, 2) + '\n')
  return { target, files: fs.readdirSync(target).length }
}

export function restore({ from, home = brokerHome(), force = false } = {}) {
  const source = path.resolve(from || '')
  const target = path.resolve(home)
  if (!from || !fs.existsSync(path.join(source, SENTINEL))) throw new Error('not a secrets-broker backup: ' + source)
  if (!force && fs.existsSync(target) && fs.readdirSync(target).length) {
    throw new Error('broker state already exists at ' + target + '; pass --force to replace it')
  }
  fs.mkdirSync(target, { recursive: true })
  // Same relative-path rule as backup, so a backup restored from /tmp is not
  // mistaken for a directory that contains a "tmp" entry.
  const keep = (file) => {
    const relative = path.relative(source, file)
    if (!relative) return true
    return !relative.endsWith(SENTINEL) && !relative.split(path.sep).includes('tmp')
  }
  fs.cpSync(source, target, {
    recursive: true,
    force: true,
    filter: keep,
  })
  return { target }
}
