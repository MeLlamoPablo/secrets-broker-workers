# Gateway identity federation (Mcpboard → Secrets Broker)

This is the contract implemented by the broker side. Mcpboard must make the
changes listed below before enabling `identity_passthrough` for the broker
upstream.

## Broker configuration

Set these Worker secrets/variables on `secrets-broker-workers`:

| Name | Value |
|---|---|
| `BROKER_GATEWAY_JWT_SECRET` | Same value as Mcpboard's `BROKER_GATEWAY_JWT_SECRET` |
| `BROKER_GATEWAY_ID` | `mcpboard-main` |
| `BROKER_GATEWAY_ISSUER` | `Mcpboard` |
| `BROKER_GATEWAY_AUDIENCE` | `secrets-broker` |
| `BROKER_GATEWAY_ALLOWED_CLIENTS` | Optional CSV allowlist of `sub_client` values; include `mcpboard-service` if used |

The broker accepts only HS256 JWTs with:

- `alg: HS256`, `typ: JWT`
- exact `gw_id`, `iss`, `aud`
- `exp` in the future (`iat`/`nbf` allow 60s clock skew)
- `sub_client` non-empty, max 200 chars
- `sub_client_type` one of `api`, `oauth`, `service`

The downstream subject is always:

```text
mcpboard:<gw_id>:<sub_client>
```

This namespacing prevents a downstream client from inheriting a direct broker
agent's grants if both happen to be called `cli_1`.

## Broker behavior

- `/mcp` checks a JWT-shaped Bearer token through `src/federation.js` before the
  normal opaque-agent-token lookup. An invalid JWT gets 401; it never falls
  back to a token hash.
- Federated agents are synthetic, non-legacy subjects:
  - no legacy scope
  - no no-approval bypass
  - no auto-approval rule
  - explicit grant or approval still required
- `tools/list` works for a federated identity. A `sub_client_type=service`
  identity may only call `tools/list`; it cannot call tools.
- Pending approvals carry `gatewayId`, `downstreamClientId`,
  `downstreamClientName` and are displayed as
  `手机A (cli_x) via mcpboard-main`.
- Grants/capabilities use the namespaced subject, so revoking one downstream
  client does not affect another.

## Mcpboard changes required

### 1. Stop reusing a fixed JWT in a long-lived session

Current `getSession()` reuses a transport whose `requestInit.headers` were
created once. The JWT expires after 45s, and the request id is stale.

Use the SDK's custom `fetch` option, or create a per-call session. The simplest
correct MVP:

- for `identity_passthrough` upstreams, use a session key that includes the
  request id: `${identity.clientId}:${upstream.id}:${requestId}`;
- close that session after `callTool`;
- never reuse a passthrough session for a second tool call.

If you keep a session, the transport must sign a fresh JWT on every outbound
HTTP request and use the current call's `requestId`.

### 2. Do not run `authHeaders()` for passthrough

For a passthrough upstream:

- set `auth_type = 'none'`;
- do not read `secret_name`;
- do not merge old `authorization` / `x-api-key` headers;
- build only the JWT headers.

### 3. Tool discovery needs a service identity

`refreshUpstream()` currently calls `listUpstreamTools()` without an identity.
Broker `/mcp` requires authentication, so refresh fails.

Create a service assertion:

```ts
const serviceIdentity = {
  clientId: 'mcpboard-service',
  name: 'Mcpboard service',
  kind: 'service', // extend Identity kind or pass an explicit service flag
  scopes: null,
}
```

Sign it with `sub_client='mcpboard-service'` and
`sub_client_type='service'`. Broker allows only `tools/list` for this subject.
Use it in `listUpstreamTools` / `refreshUpstream`; do not use a user's identity
for discovery.

### 4. Add the D1 migration

`schema.sql` `CREATE TABLE IF NOT EXISTS` does not alter the existing
`upstreams` table. Apply:

```sql
ALTER TABLE upstreams ADD COLUMN identity_passthrough INTEGER NOT NULL DEFAULT 0;
ALTER TABLE upstreams ADD COLUMN gateway_id TEXT;
ALTER TABLE upstreams ADD COLUMN audience TEXT;
ALTER TABLE upstreams ADD COLUMN jwt_secret_name TEXT;
ALTER TABLE upstreams ADD COLUMN passthrough_ttl INTEGER DEFAULT 45;
```

### 5. Exact configuration

- `GATEWAY_NAME` (used as `iss`) must be `Mcpboard` — match broker
  `BROKER_GATEWAY_ISSUER`, including case.
- `gateway_id` on the upstream must be `mcpboard-main` — do not fall back to
  `GATEWAY_NAME` for the gateway id.
- `audience` must be `secrets-broker`.
- `jwt_secret_name` must resolve to the shared secret; default
  `BROKER_GATEWAY_JWT_SECRET`.
- `passthrough_ttl` 45 seconds.

### 6. Sanitize forwarded headers

Do not put raw client names into headers without stripping CR/LF and control
characters. Broker must ignore `x-mcpboard-*` headers for identity and use only
the JWT.

### 7. Tests to add

- valid JWT → broker sees `mcpboard:gw:client`;
- wrong secret / audience / gw_id / expired / tampered → 401;
- second call after 46s succeeds with a fresh JWT (this catches the session
  reuse bug);
- `tools/list` refresh succeeds with the service JWT;
- client A's grant cannot be used by client B;
- revoking A does not revoke B;
- `service` JWT can list tools but `tools/call` is refused.

## Broker env note

Store `BROKER_GATEWAY_JWT_SECRET` with `wrangler secret put`; never commit it to
`wrangler.jsonc`, D1, logs, or the Mcpboard repo. Rotate it by updating both
Workers together.
