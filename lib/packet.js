const geoip = require('geoip-lite')
const dns = require('dns')
const { create: createPacket } = require('./db/Packet')
const crypto = require('crypto')

const getIpFromHost = (host) => {
  return new Promise((resolve) => {
    dns.lookup(host, (err, ip, family) => {
      resolve(ip)
    })
  })
}

const save = async (
  sessionId,
  { host, method, protocol, accept, contentType, userAgent, clientAddress }
) => {
  const ip = await getIpFromHost(host)
  const geo = geoip.lookup(ip)
  let userId
  let clientGeo
  if (clientAddress) {
    userId = crypto.createHash('md5').update(clientAddress).digest('hex')
    clientGeo = geoip.lookup(clientAddress)
  }
  const data = {
    session: { connect: { id: sessionId } },
    timestamp: new Date().toISOString(),
    host,
    ip,
    method,
    protocol,
    accept,
    contentType,
    userId,
    userAgent,
  }
  if (geo && geo.ll) {
    data.lat = geo.ll[0]
    data.lon = geo.ll[1]
  }
  if (clientGeo && clientGeo.ll) {
    data.clientLat = clientGeo.ll[0]
    data.clientLon = clientGeo.ll[1]
  }

  try {
    await createPacket(data)
  } catch (e) {
    console.log(e)
  }

  return data
}

module.exports = {
  save,
}
