/**
 * `secrets-broker materialize <item> --path <file> --key <NAME>`
 *
 * Asks the broker for a one-shot approval to write a credential into a file,
 * waits for the human to approve it in the browser, redeems the job once and
 * writes the line locally. The value never enters the agent's context: this
 * process is the one holding the tool result, and it spends it on disk.
 */
import { log, openBrowser } from './approval.mjs'
import { writeSecretToFile } from './write.mjs'
import path from 'node:path'

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function callTool(bridge, toolName, args) {
  const text = await bridge.request({
    jsonrpc: '2.0',
    id: `cli-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    method: 'tools/call',
    params: { name: toolName, arguments: args },
  })
  const payload = JSON.parse(text)
  if (payload.error) throw new Error(payload.error.message || 'tool call failed')
  const content = payload.result?.content?.[0]?.text ?? ''
  return { text: content, isError: payload.result?.isError === true }
}

/**
 * @param {{bridge: {request: Function}, name: string, path: string, key: string,
 *          open?: (url: string) => void, pollMs?: number, waitMs?: number}} options
 */
export async function runMaterialize({ bridge, name, path: targetPath, key, open = openBrowser, pollMs = 2000, waitMs = 300000 }) {
  const request = await callTool(bridge, 'materialize', { name, path: targetPath, key })
  if (request.isError) throw new Error(request.text)

  let job = JSON.parse(request.text)
  if (job.status === 'pending') {
    log('approval needed for', name, '→', job.path)
    log(job.approvalUrl)
    open(job.approvalUrl)

    const deadline = Date.now() + waitMs
    let redeemed = null
    while (Date.now() < deadline) {
      await sleep(pollMs)
      const attempt = await callTool(bridge, 'materialize_redeem', { id: job.id })
      if (!attempt.isError) {
        redeemed = JSON.parse(attempt.text)
        break
      }
      // Still pending is the expected answer until someone clicks; anything
      // else is a real failure and should not be retried in a loop.
      if (!/unknown materialize request|already redeemed|expired/.test(attempt.text)) throw new Error(attempt.text)
      if (/already redeemed|expired/.test(attempt.text)) throw new Error(attempt.text)
    }
    if (!redeemed) throw new Error('approval timed out')
    job = redeemed
  } else {
    const redeemed = await callTool(bridge, 'materialize_redeem', { id: job.id })
    if (redeemed.isError) throw new Error(redeemed.text)
    job = JSON.parse(redeemed.text)
  }

  // Never write where the broker says instead of where the user asked: a
  // compromised or buggy broker response must not be able to redirect the
  // materialised secret to another file.
  const target = path.resolve(targetPath)
  if (path.resolve(String(job.path ?? '')) !== target) {
    throw new Error(`broker returned a different target path (${job.path || '(none)'}); refusing to write`)
  }
  if (String(job.key ?? '') !== key) {
    throw new Error(`broker returned a different key name (${job.key || '(none)'}); refusing to write`)
  }
  const written = writeSecretToFile({ path: target, key, value: job.value })
  return { ...written, key }
}
