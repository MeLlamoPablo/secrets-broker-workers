import { copyFileSync, cpSync, mkdirSync, readFileSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { VERSION } from '../src/version.js';

const root = dirname(fileURLToPath(import.meta.url)) + '/..';
const target = join(root, 'desktop/src-tauri/resources/sidecar');

rmSync(target, { recursive: true, force: true });
mkdirSync(join(target, 'src'), { recursive: true });
copyFileSync(process.execPath, join(target, 'node.exe'));
copyFileSync(join(root, 'package.json'), join(target, 'package.json'));
copyFileSync(join(root, 'src/envelope.js'), join(target, 'src/envelope.js'));
copyFileSync(join(root, 'src/vaultdiff.js'), join(target, 'src/vaultdiff.js'));
copyFileSync(join(root, 'src/redact.js'), join(target, 'src/redact.js'));
copyFileSync(join(root, 'src/version.js'), join(target, 'src/version.js'));
cpSync(join(root, 'cli'), join(target, 'cli'), { recursive: true });
// The staged copy is a build output, never a place to edit. Fail loudly if it
// would ship a version the runtime does not report (e.g. a stale 2.0.0 left in
// the resources folder). `npm run sync:version` fixes package.json/src drift.
const staged = JSON.parse(readFileSync(join(target, 'package.json'), 'utf8'));
if (staged.version !== VERSION) {
  throw new Error(`sidecar package.json is ${staged.version}, expected ${VERSION}; run npm run sync:version`);
}
console.log(`sidecar staged at ${target} (${staged.version})`);
