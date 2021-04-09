require('dotenv').config()

const Proxy = require('http-mitm-proxy')
const net = require('net')
const { attach: attachSession, getLatestActive } = require('./db/Session')

let currentSession
attachSession('create', (session) => {
  currentSession = session
})
attachSession('update', (session) => {
  if (session.id === currentSession.id && !!session.end) {
    currentSession = null
  }
})

const start = async (packetCb) => {
  const proxy = Proxy()
  const session = await getLatestActive()
  if (!!session) currentSession = session

  proxy.onRequestEnd((ctx, callback) => {
    if (!currentSession) return callback()

    try {
      const { host, agent, method, headers } = ctx.proxyToServerRequestOptions
      const { protocol } = agent
      const { accept } = headers
      packetCb(currentSession.id, {
        host,
        method,
        protocol,
        accept,
      })
    } catch (e) {}
    return callback()
  })

  proxy.onError((ctx, err) => filterSocketConnReset(err))

  proxy.listen({ port: 8888, keepAlive: true })
}

function filterSocketConnReset(err) {
  if (err.errno !== 'ECONNRESET') {
    console.log('Got unexpected error: ', err)
  }
}

module.exports = {
  start,
}
