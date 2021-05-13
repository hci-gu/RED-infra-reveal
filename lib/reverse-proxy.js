require('dotenv').config()

const WebSocket = require('ws')
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

const messageFromBuffer = (b) => {
  const metadataSize = b.readInt32LE(0)
  const request = JSON.parse(b.toString('utf8', 4, 4 + metadataSize))
  console.log(request)
  return {
    ...request,
    headers: request.headers
      ? request.headers.reduce((acc, curr) => {
          acc[curr[0]] = curr[1]
          return acc
        }, {})
      : {},
  }
}

const start = async (packetCb) => {
  const wss = new WebSocket.Server({ port: 8765 })
  const session = await getLatestActive()
  if (!!session) currentSession = session

  wss.on('connection', (ws) => {
    ws.on('error', (e) => console.log(`WebSocket error: ${e}`))

    ws.on('message', (msg) => {
      const request = messageFromBuffer(msg)
      if (!currentSession) {
        return
      }
      packetCb(currentSession.id, {
        host: request.host,
        method: request.method,
        protocol: request.scheme,
        accept: request.headers['Accept'],
        userAgent: request.headers['User-Agent'],
      })
    })
  })

  wss.on('error', (e) => console.log(`WebSocket server error: ${e}`))
}

module.exports = {
  start,
}
