require('dotenv').config()

const Proxy = require('http-mitm-proxy')
const proxy = Proxy()
const { attach: attachSession } = require('./db/Session')

let currentSession

attachSession('create', (session) => {
  currentSession = session
})

const start = (packetCb) => {
  proxy.onError((ctx, err) => {
    console.error('proxy error:', err)
  })

  proxy.onRequest((ctx, callback) => {
    if (!currentSession) return callback()
    const { host, agent, method, headers } = ctx.proxyToServerRequestOptions
    const { protocol } = agent
    const { accept } = headers

    try {
      packetCb(currentSession.id, {
        host,
        method,
        protocol,
        accept,
      })
    } catch (e) {}

    try {
      return callback()
    } catch (e) {}
  })

  proxy.listen({ port: 8888 })
}

module.exports = {
  start,
}
