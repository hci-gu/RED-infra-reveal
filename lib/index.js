require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})
const reverseProxy = require('./reverse-proxy')
const { runKeystone } = require('./keystone')
const { adminApp } = require('./adminUI')
const packetHandler = require('./packet')

const { attach: attachPacket } = require('./db/Packet')

require('./listeners/domainCreator')

let connectedSockets = []

app.use(cors())
app.use(bodyParser.json({ limit: '10mb', extended: true }))

runKeystone(app, [adminApp])

http.listen(4000)

io.on('connection', (socket) => {
  connectedSockets.push(socket)

  socket.on('disconnect', () => {
    connectedSockets = connectedSockets.filter((s) => s !== socket)
  })
})

let packetsToSend = []
attachPacket('create', (packet) => {
  packetsToSend.push(packet)
})
setInterval(() => {
  if (packetsToSend.length) {
    io.emit('packets', packetsToSend)
    packetsToSend = []
  }
}, 1250)

setTimeout(() => {
  const startProxy = () => {
    try {
      reverseProxy.start(packetHandler.save)
    } catch (e) {
      console.log('proxyError', e)
    }
  }

  startProxy()
}, 1000)
