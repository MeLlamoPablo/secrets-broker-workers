// Empty Web Push payload: read the waiting approval with the operator's
// existing session instead of carrying encrypted data in the push message.
self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()))

self.addEventListener('push', (event) => {
  event.waitUntil((async () => {
    let title = 'Secrets Broker'
    let body = 'New access request. Click to view'
    try {
      const response = await fetch('/api/state', { cache: 'no-store', headers: { accept: 'application/json' } })
      if (response.ok) {
        const state = await response.json()
        // A first connection is an approval too, and it used to be invisible
        // here because only item requests were read. Prefer the connection
        // queue; fall back to the item queue when none is waiting.
        const connection = ((state.connections || {}).pending || [])[0]
        const pending = (state.pending || [])[0]
        if (connection) {
          title = 'Secrets Broker connection request'
          body = `${connection.agent || 'Agent'} is requesting its first connection. Click to open pending requests`
        } else if (pending) {
          title = 'Secrets Broker access request'
          body = `${pending.agent || 'Agent'} is requesting to read “${pending.name || ''}”`
        }
      }
      // A 401 or any other failure keeps the generic text above: the session is
      // gone, so naming an agent or item would leak to the lock screen.
    } catch {}
    await self.registration.showNotification(title, {
      body,
      icon: '/logo.png',
      tag: 'secrets-broker-pending',
      data: { url: '/#pending' },
    })
    // An open console must not wait for its next poll to show the new row:
    // tell every tab to refresh the queue now.
    const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true })
    for (const client of clients) client.postMessage({ type: 'secrets-broker:pending' })
  })())
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const target = new URL(event.notification.data?.url || '/', self.location.origin).href
  event.waitUntil((async () => {
    const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true })
    const existing = windows.find((client) => new URL(client.url).origin === self.location.origin)
    if (existing) {
      await existing.focus()
      if ('navigate' in existing) await existing.navigate(target)
      return
    }
    await self.clients.openWindow(target)
  })())
})
