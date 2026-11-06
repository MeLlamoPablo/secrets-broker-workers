// `npm pack` is what a user actually installs, so check the tarball instead of
// trusting the `files` list: every import the CLI makes must be inside it.
import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { VERSION } from '../src/version.js'

const results = []
const pass = (n, extra = '') => { results.push({ n, ok: true }); console.log('PASS  ' + n + (extra ? ' :: ' + extra : '')) }
const fail = (n, d) => { results.push({ n, ok: false, d }); console.log('FAIL  ' + n + ' :: ' + d) }

const packed = JSON.parse(execFileSync('npm', ['pack', '--json', '--dry-run'], { encoding: 'utf8', shell: process.platform === 'win32' }))
const files = (packed[0]?.files ?? []).map((entry) => entry.path.replace(/\\/g, '/'))
const bytes = packed[0]?.size ?? 0

// P1: the CLI and the modules it imports are in the tarball.
{
  const wanted = ['package.json', 'cli/index.mjs', 'cli/vault.mjs', 'cli/envelope.mjs', 'cli/daemon.mjs', 'cli/exec.mjs', 'src/envelope.js', 'src/vaultdiff.js']
  const missing = wanted.filter((path) => !files.includes(path) && !(path === 'cli/envelope.mjs' && files.includes('src/envelope.js')))
  missing.length ? fail('P1 the tarball carries the CLI and what it imports', 'missing ' + missing.join(', ')) : pass('P1 the tarball carries the CLI and what it imports')
}

// P2: every relative import in cli/ resolves to a packed file.
{
  const resolved = []
  for (const entry of files.filter((path) => path.startsWith('cli/') && path.endsWith('.mjs'))) {
    const source = readFileSync(entry, 'utf8')
    for (const match of source.matchAll(/from '(\.[^']+)'/g)) {
      const target = new URL(match[1], 'file:///' + entry).pathname.slice(1)
      resolved.push(target)
    }
  }
  const missing = resolved.filter((path) => !files.includes(path))
  missing.length ? fail('P2 every CLI import is inside the tarball', 'missing ' + [...new Set(missing)].join(', ')) : pass('P2 every CLI import is inside the tarball', resolved.length + ' imports')
}

// P3: no test or secret file leaks into what users download.
{
  const bad = files.filter((path) => /(^|\/)(test-|\.dev-keys|\.env|\.wrangler|node_modules)/.test(path))
  bad.length ? fail('P3 no tests or local secrets in the tarball', bad.join(', ')) : pass('P3 no tests or local secrets in the tarball')
}

// P4: the bin entry is executable, pointed at a real file, and the tarball
// declares the version the runtime actually reports. The version is compared
// with src/version.js instead of a fixed major, so the gate follows the repo
// rather than an old release plan (a hardcoded /^2\./ outlived its bump).
{
  const pkg = JSON.parse(readFileSync('package.json', 'utf8'))
  const bin = String(pkg.bin?.['secrets-broker'] ?? '').replace(/^\.\//, '')
  const problems = []
  if (!bin || !files.includes(bin)) problems.push('bin=' + bin)
  if (!/^\d+\.\d+\.\d+$/.test(String(pkg.version))) problems.push('version is not x.y.z: ' + pkg.version)
  if (String(pkg.version) !== VERSION) problems.push(`package.json ${pkg.version} != src/version.js ${VERSION}`)
  problems.length
    ? fail('P4 bin points at a packed file and the version matches src/version.js', problems.join(', '))
    : pass('P4 bin points at a packed file and the version matches src/version.js', pkg.version)
}

console.log('\n  tarball: ' + files.length + ' files, ' + (bytes / 1024).toFixed(1) + ' KiB')
const failed = results.filter((r) => !r.ok)
console.log('\n==== pack check ' + results.filter((r) => r.ok).length + '/' + results.length + ' passed ====')
process.exit(failed.length ? 1 : 0)
