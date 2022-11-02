import { KeystoneContext } from '@keystone-6/core/types'
import WebSocket from 'ws'
import {
  addListener as addSessionListener,
  getLatestActive,
} from './schema/Session'

// const { attach: attachSession, getLatestActive } = require('./db/Session')

let currentSession: any
addSessionListener('create', (session: any) => {
  currentSession = session
})
addSessionListener('update', (session: any) => {
  if (session.id === currentSession.id && !!session.end) {
    currentSession = null
  }
})

const messageFromBuffer = (b: Buffer): any => {
  const metadataSize = b.readInt32LE(0)
  const request = JSON.parse(b.toString('utf8', 4, 4 + metadataSize))
  return {
    ...request,
    headers: request.headers
      ? request.headers.reduce((acc: any, curr: any) => {
          acc[curr[0]] = curr[1]
          return acc
        }, {})
      : {},
  }
}

export default async (
  context: KeystoneContext,
  packetCb: (sid: string, p: any) => void
) => {
  const wss = new WebSocket.Server({ port: 8765 })
  const session = await getLatestActive(context)
  if (!!session) currentSession = session

  wss.on('connection', (ws) => {
    console.log('ws connected')
    ws.on('error', (e) => console.log(`WebSocket error: ${e}`))

    ws.on('message', (msg) => {
      const request = messageFromBuffer(msg as Buffer)
      if (!currentSession) {
        return
      }
      let host =
        request.headers['host'] ||
        request.headers['Host'] ||
        request.headers['origin'] ||
        request.headers['referer']
      if (host)
        host = host
          .replace('http://', '')
          .replace('https://', '')
          .replace('/', '')

      packetCb(currentSession.id, {
        host: host ? host : request.host,
        method: request.method,
        protocol: request.scheme,
        accept: request.headers['accept'],
        userAgent: request.headers['user-agent'],
        contentType: request.headers['content-type'],
        contentLength: request.headers['content-length']
          ? parseInt(request.headers['content-length'])
          : 0,
        start: Math.round(request.timestamp.start * 1000),
        end: Math.round(request.timestamp.end * 1000),
        clientAddress: request.client.address
          ? request.client.address[0]
          : undefined,
      })
    })
  })

  wss.on('error', (e) => console.log(`WebSocket server error: ${e}`))
}
