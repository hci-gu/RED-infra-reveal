require('dotenv').config()

const express = require('express')
const fs = require('fs')
const bodyParser = require('body-parser')
const cors = require('cors')
const { Session, Packet } = require('./db')
const packetHandler = require('./packet')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
})
const reverseProxy = require('../reverse-proxy')
reverseProxy.start()

let connectedSockets = []

app.use(cors())
app.use(bodyParser.json({ limit: '10mb', extended: true }))
app.get('/', (req, res) => res.send('hello world'))

app.get('/cert', (req, res) => {
  const path = `${__dirname.replace('/lib', '')}/.http-mitm-proxy/certs/ca.pem`

  res.sendFile(path)
})

app.post('/session', async (_, res) => {
  const session = await Session.create({
    start: new Date(),
  })
  console.log('session', session)
  reverseProxy.startSession(session)
  res.send(session)
})
app.put('/session/:id', async (req, res) => {
  const { id } = req.params
  const { end } = req.body
  const session = await Session.findOne({ where: { id } })
  session.end = new Date(end)
  await session.save()
  reverseProxy.endSession(session)
  res.send(session)
})
app.get('/sessions', async (req, res) => {
  const sessions = await Session.findAll()
  res.send(sessions)
})

app.post('/session/:id/packet', async (req, res) => {
  const { id } = req.params
  const { host, method, protocol, accept } = req.body

  const packet = await packetHandler.save({
    host,
    method,
    protocol,
    accept,
    sessionId: id,
  })
  io.emit('packet', packet)

  res.sendStatus(200)
})
app.get('/session/:id/packets', async (req, res) => {
  const { id } = req.params
  console.log('GET packets for sesssion', id)

  const packets = await Packet.findAll({ where: { session_id: id } })

  fs.writeFileSync('./packets.json', JSON.stringify(packets, null, 2))

  res.send(packets)
})

http.listen(4000)

io.on('connection', (socket) => {
  connectedSockets.push(socket)
  console.log('a user connected', connectedSockets.length)

  socket.on('disconnect', () => {
    console.log('a user disconnected')
    connectedSockets = connectedSockets.filter((s) => s !== socket)
  })
})
