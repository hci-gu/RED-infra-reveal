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
  }
  if (geo && geo.ll) {
    data.lon = geo.ll[0]
    data.lat = geo.ll[1]
  }

  try {
    await createPacket(data)
  } catch (e) {}

  return data
}

module.exports = {
  save,
}
