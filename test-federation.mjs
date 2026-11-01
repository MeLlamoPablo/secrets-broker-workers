// Gateway federation tests. These are pure WebCrypto tests: no Worker, no
// network, no broker token. A JWT is only accepted for the configured gateway,
// issuer, audience and time window.
import { verifyGatewayJwt, federatedAgent } from './src/federation.js'

const encoder = new TextEncoder()
const secret = 'test-gateway-secret-not-real'
const env = {
  BROKER_GATEWAY_JWT_SECRET: secret,
  BROKER_GATEWAY_ID: 'mcpboard-main',
  BROKER_GATEWAY_ISSUER: 'Mcpboard',
  BROKER_GATEWAY_AUDIENCE: 'secrets-broker',
}
const results = []
const pass = (name) => { results.push({ name, ok: true }); console.log('PASS  ' + name) }
const fail = (name, detail) => { results.push({ name, ok: false }); console.error('FAIL  ' + name + ' :: ' + detail) }

function b64url(bytes) {
  let s = ''
  for (const byte of bytes) s += String.fromCharCode(byte)
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}
function json64(value) { return b64url(encoder.encode(JSON.stringify(value))) }
async function sign(payload, header = { alg: 'HS256', typ: 'JWT' }, key = secret) {
  const keyObject = await crypto.subtle.importKey('raw', encoder.encode(key), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const data = json64(header) + '.' + json64(payload)
  const signature = await crypto.subtle.sign('HMAC', keyObject, encoder.encode(data))
  return data + '.' + b64url(new Uint8Array(signature))
}
const now = 1_700_000_000_000
const payload = {
  iss: 'Mcpboard',
  aud: 'secrets-broker',
  gw_id: 'mcpboard-main',
  gw_name: 'Mcpboard',
  sub_client: 'cli_phone_a',
  sub_client_name: '手机A',
  sub_client_type: 'api',
  scopes: null,
  rid: 'req_abc',
  iat: Math.floor(now / 1000),
  exp: Math.floor(now / 1000) + 45,
}

try {
  const token = await sign(payload)
  const verified = await verifyGatewayJwt(token, env, now)
  verified?.sub_client === 'cli_phone_a' && verified?.rid === 'req_abc'
    ? pass('F1 valid gateway JWT verifies')
    : fail('F1', JSON.stringify(verified))

  const subject = federatedAgent(verified)
  subject.name === 'mcpboard:mcpboard-main:cli_phone_a' && subject.agent.federated === true && subject.agent.legacy === false
    ? pass('F2 downstream client gets a namespaced, non-legacy subject')
    : fail('F2', JSON.stringify(subject))

  const wrongSecret = await sign(payload, undefined, 'wrong-secret')
  ;(await verifyGatewayJwt(wrongSecret, env, now)) === null
    ? pass('F3 wrong secret is rejected')
    : fail('F3', 'accepted wrong secret')

  const wrongAudience = await sign({ ...payload, aud: 'another-broker' })
  ;(await verifyGatewayJwt(wrongAudience, env, now)) === null
    ? pass('F4 wrong audience is rejected')
    : fail('F4', 'accepted wrong audience')

  const wrongGateway = await sign({ ...payload, gw_id: 'other-gateway' })
  ;(await verifyGatewayJwt(wrongGateway, env, now)) === null
    ? pass('F5 wrong gateway id is rejected')
    : fail('F5', 'accepted wrong gateway')

  const expired = await sign({ ...payload, exp: Math.floor(now / 1000) - 1 })
  ;(await verifyGatewayJwt(expired, env, now)) === null
    ? pass('F6 expired token is rejected')
    : fail('F6', 'accepted expired token')

  const noneAlg = await sign(payload, { alg: 'none', typ: 'JWT' })
  ;(await verifyGatewayJwt(noneAlg, env, now)) === null
    ? pass('F7 non-HS256 header is rejected')
    : fail('F7', 'accepted alg none')

  const tamperedParts = token.split('.')
  tamperedParts[1] = tamperedParts[1].slice(0, -1) + (tamperedParts[1].endsWith('a') ? 'b' : 'a')
  const tampered = tamperedParts.join('.')
  ;(await verifyGatewayJwt(tampered, env, now)) === null
    ? pass('F8 tampered signature is rejected')
    : fail('F8', 'accepted tampered token')

  const servicePayload = { ...payload, sub_client: 'mcpboard-service', sub_client_type: 'service' }
  const service = federatedAgent(await verifyGatewayJwt(await sign(servicePayload), env, now))
  service.agent.service === true && service.agent.write === false
    ? pass('F9 gateway service is non-writing')
    : fail('F9', JSON.stringify(service.agent))
} catch (error) {
  fail('unexpected exception', String(error?.stack ?? error))
}

const failed = results.filter((row) => !row.ok)
console.log('\n==== federation ' + (results.length - failed.length) + '/' + results.length + ' passed ====')
process.exit(failed.length ? 1 : 0)
