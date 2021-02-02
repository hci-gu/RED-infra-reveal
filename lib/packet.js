const geoip = require('geoip-lite')
const dns = require('dns')
const { create: createPacket } = require('./db/Packet')

const getIpFromHost = (host) => {
  return new Promise((resolve) => {
    dns.lookup(host, (err, ip, family) => {
      resolve(ip)
    })
  })
}

const save = async (sessionId, { host, method, protocol, accept }) => {
  const ip = await getIpFromHost(host)
  const geo = geoip.lookup(ip)

  const data = {
    session: { connect: { id: sessionId } },
    timestamp: new Date().toISOString(),
    host,
    ip,
    method,
    protocol,
    accept,
    lat: geo.ll[1],
    lon: geo.ll[0],
  }
  console.log(data)

  // if (DB) {
  await createPacket(data)
  // }

  return data
}

module.exports = {
  save,
}
