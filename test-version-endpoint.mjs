// /api/version is what the console shows in its About panel, and what an
// operator uses to prove which commit is live. It must answer without a
// session, must not leak anything, and must stay 200 when the optional
// version_metadata binding is missing.
import fs from 'node:fs'
import worker from './src/index.js'
import { NAME, VERSION } from './src/version.js'

let passed = 0
let failed = 0
function check(name, ok, detail = '') {
  if (ok) {
    passed += 1
    console.log(`PASS  ${name}`)
  } else {
    failed += 1
    console.log(`FAIL  ${name}${detail ? ' — ' + detail : ''}`)
  }
}

const pkg = JSON.parse(fs.readFileSync(new URL('./package.json', import.meta.url), 'utf8'))
check('1a src/version.js mirrors package.json name', NAME === pkg.name, `${NAME} != ${pkg.name}`)
check('1b src/version.js mirrors package.json version', VERSION === pkg.version, `${VERSION} != ${pkg.version}`)

const call = async (env, method = 'GET') => {
  const response = await worker.fetch(new Request('https://broker.example/api/version', { method }), env)
  const text = await response.text()
  return { status: response.status, headers: response.headers, body: text ? JSON.parse(text) : null }
}

const bare = await call({})
check('2a no binding still answers 200', bare.status === 200, `status ${bare.status}`)
check('2b response is not cacheable', bare.headers.get('cache-control') === 'no-store')
check('2c exactly the five documented fields', bare.body && Object.keys(bare.body).sort().join() === ['commit', 'deployedAt', 'name', 'version', 'workerVersion'].join(), Object.keys(bare.body || {}).join())
check('2d version is the package version', bare.body?.version === VERSION, bare.body?.version)
for (const field of ['commit', 'deployedAt', 'workerVersion']) {
  check(`2e ${field} degrades to unknown`, bare.body?.[field] === 'unknown', String(bare.body?.[field]))
}

const bound = await call({
  CF_VERSION_METADATA: {
    id: 'ab475c11-b8f6-4a5d-a35b-bcd0b6c609b1',
    tag: '4edd28e95e47b8dda0dae3ebbd8b1aea1b33000f',
    timestamp: '2026-11-05T12:34:56Z',
  },
})
check('3a binding fills workerVersion', bound.body?.workerVersion === 'ab475c11-b8f6-4a5d-a35b-bcd0b6c609b1', bound.body?.workerVersion)
check('3b binding fills commit from the deploy tag', bound.body?.commit === '4edd28e95e47b8dda0dae3ebbd8b1aea1b33000f', bound.body?.commit)
check('3c binding fills deployedAt', bound.body?.deployedAt === '2026-11-05T12:34:56Z', bound.body?.deployedAt)
check('3d binding does not change the version', bound.body?.version === VERSION, bound.body?.version)

const other = await call({}, 'POST')
check('4a only GET is served', other.status !== 200, `status ${other.status}`)

// The MCP handshake is the other place a client learns the version. It must
// report the same VERSION as /api/version; a hardcoded 0.1.0 shipped for a
// while and made every client see a version the console never showed. The
// handshake itself needs an agent token, so this suite guards the source line
// the same way it guards the package/version mirror.
const workerSource = fs.readFileSync(new URL('./src/index.js', import.meta.url), 'utf8')
check('5a MCP initialize reports src/version.js VERSION', workerSource.includes("serverInfo: { name: 'secrets-broker', version: VERSION }"))
check('5b MCP initialize has no hardcoded version', !workerSource.includes("serverInfo: { name: 'secrets-broker', version: '0.1.0' }"))

console.log(`\n==== ${passed}/${passed + failed} assertions passed ====`)
if (failed) process.exitCode = 1
