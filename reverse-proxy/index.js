require('dotenv').config()

const Proxy = require('http-mitm-proxy')
const proxy = Proxy()
const axios = require('axios')
const client = axios.create({
  baseURL: 'http://localhost:4000',
  timeout: 5000,
})

let currentSession

const start = (packetCb) => {
  proxy.onError((ctx, err) => {
    console.error('proxy error:', err)
  })

  proxy.onRequest((ctx, callback) => {
    // if (!currentSession) return callback()
    const { host, agent, method, headers } = ctx.proxyToServerRequestOptions
    const { protocol } = agent
    const { accept } = headers

    try {
      packetCb(1, {
        host,
        method,
        protocol,
        accept,
      })
    } catch (e) {
      console.log(e)
    }

    try {
      return callback()
    } catch (e) {
      console.log(e)
    }
  })

  proxy.listen({ port: 8888 })
}

const startSession = async (session) => {
  currentSession = session
}

const endSession = () => {
  currentSession = null
}

module.exports = {
  start,
  startSession,
  endSession,
}
