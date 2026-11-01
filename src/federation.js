// Gateway federation: Mcpboard signs a short-lived HS256 JWT for the original
// downstream client. Broker verifies it before treating the caller as an agent.
// The JWT is an assertion, not a bearer token for the gateway itself: only the
// configured gateway id, issuer and audience are accepted.

const encoder = new TextEncoder()
const decoder = new TextDecoder()

const text = (value) => String(value ?? '')
const isObject = (value) => Boolean(value) && typeof value === 'object' && !Array.isArray(value)
const clean = (value) => text(value).replace(/[\u0000-\u001f\u007f]/g, '').trim()

function base64urlBytes(part) {
  const value = String(part ?? '').replace(/-/g, '+').replace(/_/g, '/')
  const padded = value + '='.repeat((4 - (value.length % 4)) % 4)
  const binary = atob(padded)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i)
  return bytes
}

function base64urlJson(part) {
  return JSON.parse(decoder.decode(base64urlBytes(part)))
}

function configured(env, key, fallback) {
  return clean(env?.[key] ?? '') || fallback
}

/**
 * Verify a gateway JWT. Returns the normalized payload, or null for anything
 * that is not a valid assertion for this broker. A malformed JWT never falls
 * through to the ordinary agent-token path.
 */
export async function verifyGatewayJwt(token, env, now = Date.now()) {
  const secret = configured(env, 'BROKER_GATEWAY_JWT_SECRET', '')
  if (!secret) return null
  const raw = text(token).trim()
  const parts = raw.split('.')
  if (parts.length !== 3) return null

  let header
  let payload
  let signature
  try {
    header = base64urlJson(parts[0])
    payload = base64urlJson(parts[1])
    signature = base64urlBytes(parts[2])
  } catch {
    return null
  }
  if (!isObject(header) || !isObject(payload)) return null
  if (header.alg !== 'HS256' || (header.typ && header.typ !== 'JWT')) return null

  const gatewayId = configured(env, 'BROKER_GATEWAY_ID', 'mcpboard-main')
  const issuer = configured(env, 'BROKER_GATEWAY_ISSUER', 'Mcpboard')
  const audience = configured(env, 'BROKER_GATEWAY_AUDIENCE', 'secrets-broker')
  if (payload.gw_id !== gatewayId) return null
  if (payload.iss !== issuer || payload.aud !== audience) return null

  const nowSeconds = Math.floor(now / 1000)
  if (!Number.isFinite(payload.exp) || payload.exp <= nowSeconds) return null
  if (!Number.isFinite(payload.iat) || payload.iat > nowSeconds + 60) return null
  if (payload.nbf !== undefined && (!Number.isFinite(payload.nbf) || payload.nbf > nowSeconds + 60)) return null

  const sub = clean(payload.sub_client)
  if (!sub || sub.length > 200) return null
  const type = clean(payload.sub_client_type || 'api')
  if (!['api', 'oauth', 'service'].includes(type)) return null
  const scopes = payload.scopes == null ? null : (Array.isArray(payload.scopes) ? payload.scopes.map(clean).filter(Boolean).slice(0, 50) : null)
  if (payload.scopes != null && scopes === null) return null
  const allowed = configured(env, 'BROKER_GATEWAY_ALLOWED_CLIENTS', '')
    .split(',').map(clean).filter(Boolean)
  if (allowed.length && !allowed.includes(sub)) return null

  let key
  try {
    key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['verify'])
    const ok = await crypto.subtle.verify('HMAC', key, signature, encoder.encode(parts[0] + '.' + parts[1]))
    if (!ok) return null
  } catch {
    return null
  }

  return {
    iss: issuer,
    aud: audience,
    gw_id: gatewayId,
    gw_name: clean(payload.gw_name) || gatewayId,
    sub_client: sub,
    sub_client_name: clean(payload.sub_client_name) || sub,
    sub_client_type: type,
    scopes,
    rid: clean(payload.rid) || '',
    iat: payload.iat,
    exp: payload.exp,
  }
}

/**
 * Build the synthetic agent used by the existing grant/capability code.
 *
 * The subject is deliberately namespaced: a downstream client named `cli_1`
 * must never inherit grants from a direct broker agent also named `cli_1`.
 * Federated agents are never legacy agents, so no-approval and group scope
 * cannot silently widen their access.
 */
export function federatedAgent(payload) {
  const subject = 'mcpboard:' + payload.gw_id + ':' + payload.sub_client
  const display = payload.sub_client_name || payload.sub_client
  return {
    name: subject,
    agent: {
      allow: [],
      groups: [],
      allowAll: false,
      write: false,
      tools: null,
      oauth: payload.sub_client_type === 'oauth',
      account: '',
      alias: display,
      note: payload.sub_client,
      legacy: false,
      muted: false,
      federated: true,
      service: payload.sub_client_type === 'service',
      gatewayId: payload.gw_id,
      downstreamClientId: payload.sub_client,
      downstreamClientName: display,
      downstreamClientType: payload.sub_client_type,
      federationRequestId: payload.rid,
    },
  }
}
