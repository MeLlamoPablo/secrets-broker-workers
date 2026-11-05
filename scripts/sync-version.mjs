// Rewrites src/version.js from package.json so the runtime copy cannot drift.
// Run by `npm version`, `npm run deploy`, or by hand after an edit.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'))
const target = path.join(root, 'src/version.js')

const source = `// The worker's version, mirrored from package.json "version".
//
// The obvious alternative — importing ../package.json — works when wrangler
// bundles for deploy but not in the Miniflare suites: their module loader only
// supports ESModule/CommonJS/CompiledWasm/Text/Data rules, so a JSON import
// fails with ERR_MODULE_RULE before any test runs. This file is therefore the
// runtime copy, and test-version-endpoint.mjs fails the build if it drifts from
// package.json. Bump package.json, then run:
//
//   npm run sync:version
export const NAME = ${JSON.stringify(pkg.name)}
export const VERSION = ${JSON.stringify(pkg.version)}
`

const previous = fs.existsSync(target) ? fs.readFileSync(target, 'utf8') : null
if (previous !== source) {
  fs.writeFileSync(target, source)
  console.log(`src/version.js -> ${pkg.name} ${pkg.version}`)
} else {
  console.log(`src/version.js already at ${pkg.version}`)
}
