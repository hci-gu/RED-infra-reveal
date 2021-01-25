require('dotenv').config()

const geoip = require('geoip-lite')
const dns = require('dns')
const Proxy = require('http-mitm-proxy')
const proxy = Proxy()
const axios = require('axios')
const client = axios.create({
  baseURL: 'http://localhost:4000',
  timeout: 5000,
})

const startProxy = (sessionId) => {
  proxy.onError(function (ctx, err) {
    console.error('proxy error:', err)
  })

  proxy.onRequest((ctx, callback) => {
    const host = ctx.proxyToServerRequestOptions.host

    try {
      client.post(`/session/${sessionId}/packet`, { host })
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

const start = async () => {
  try {
    const session = (await client.post('/session', {})).data
    console.log('session', session)
    startProxy(session.id)
  } catch (e) {
    console.log(e)
  }
}

start()
