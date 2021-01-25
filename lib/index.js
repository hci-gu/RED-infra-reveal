require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const geoip = require('geoip-lite')
const dns = require('dns')
const { Session } = require('./db')
const packetHandler = require('./packet')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
})

let connectedSockets = []

app.use(cors())
app.use(bodyParser.json({ limit: '10mb', extended: true }))
app.get('/', (req, res) => res.send('hello world'))

app.post('/session', async (_, res) => {
  const session = await Session.create({
    start: new Date(),
  })
  res.send(session)
})

app.put('/session/:id', async (req, res) => {
  const { id } = req.params
  const { end } = req.body
  const session = await Session.findOne({ where: { id } })
  session.end = new Date(end)
  await session.save()
  res.send(session)
})

app.post('/session/:id/packet', async (req, res) => {
  const { id } = req.params
  const { host } = req.body

  const packet = await packetHandler.save({ host, sessionId: id })
  io.emit('packet', packet)

  res.sendStatus(200)
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

setTimeout(() => {
  packetHandler.save({ host: 'google.com', sessionId: 1 })
}, 1000)
