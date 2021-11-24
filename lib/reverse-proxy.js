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
    console.log('ws connected')
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
        accept: request.headers['accept'],
        userAgent: request.headers['user-agent'],
        contentType: request.headers['content-type'],
        contentLength: request.headers['content-length']
          ? parseInt(request.headers['content-length'])
          : 0,
        start: parseInt(request.timestamp.start * 1000),
        end: parseInt(request.timestamp.end * 1000),
        clientAddress: request.client.address
          ? request.client.address[0]
          : undefined,
      })
    })
  })

  wss.on('error', (e) => console.log(`WebSocket server error: ${e}`))
}

module.exports = {
  start,
}
