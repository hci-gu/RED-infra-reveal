import { Server as SocketIO, Socket } from 'socket.io'
import { createServer } from 'http'
import { addListener as addPacketListener } from './schema/Packet'
import reverseProxy from './reverse-proxy'
import handlePacket from './packet'
import { KeystoneContext } from '@keystone-6/core/types'

export default (app: any, context: KeystoneContext) => {
  const http = createServer(app)
  const io = new SocketIO(http, {})

  // let connectedSockets: Socket[] = []
  // io.on('connection', (socket) => {
  //   connectedSockets.push(socket)

  //   socket.on('disconnect', () => {
  //     connectedSockets = connectedSockets.filter((s) => s !== socket)
  //   })
  // })

  let packetsToSend: any[] = []
  addPacketListener('create', (packet: any) => {
    packetsToSend.push(packet)
  })
  // attachPacket('create', (packet) => {
  //   packetsToSend.push(packet)
  // })
  setInterval(() => {
    if (packetsToSend.length) {
      io.emit('packets', packetsToSend)
      packetsToSend = []
    }
  }, 1000)

  setTimeout(() => {
    try {
      reverseProxy(context, (sessionId, packet) =>
        handlePacket(context, sessionId, packet)
      )
    } catch (e) {
      console.log('proxyError', e)
    }
  }, 1000)

  http.listen(4000)
}
