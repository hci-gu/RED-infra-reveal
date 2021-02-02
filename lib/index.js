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
const { runKeystone } = require('./keystone')
const { adminApp } = require('./adminUI')
reverseProxy.start(packetHandler.save)

let connectedSockets = []

app.use(cors())
app.use(bodyParser.json({ limit: '10mb', extended: true }))

runKeystone(app, [adminApp])

app.get('/cert', (req, res) => {
  const path = `${__dirname.replace('/lib', '')}/.http-mitm-proxy/certs/ca.pem`

  res.sendFile(path)
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
