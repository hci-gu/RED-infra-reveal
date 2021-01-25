const geoip = require('geoip-lite')
const dns = require('dns')
const { DB } = process.env
const { Packet } = require('./db')

const getIpFromHost = (host) => {
  return new Promise((resolve) => {
    dns.lookup(host, (err, ip, family) => {
      resolve(ip)
    })
  })
}

const save = async ({ host, sessionId }) => {
  const ip = await getIpFromHost(host)
  const geo = geoip.lookup(ip)

  const data = {
    timestamp: new Date(),
    host,
    ip,
    sessionId,
    location: {
      type: 'Point',
      coordinates: [geo.ll[1], geo.ll[0]],
    },
    country: geo.country,
    timezone: geo.timezone,
    city: geo.city,
  }

  if (DB) {
    await Packet.create(data)
  }

  return data
}

module.exports = {
  save,
}
