import geoip from 'geoip-lite'
import dns from 'dns'
import { create as createPacket } from './schema/Packet'
import crypto from 'crypto'
import { KeystoneContext } from '@keystone-6/core/types'

const getIpFromHost = (host: string): Promise<string> => {
  return new Promise((resolve) => {
    dns.lookup(host, (err, ip, family) => {
      resolve(ip)
    })
  })
}

const handlePacket = async (
  context: KeystoneContext,
  sessionId: string,
  {
    host,
    method,
    protocol,
    accept,
    contentType,
    userAgent,
    clientAddress,
    contentLength,
    start,
    end,
  }: any
) => {
  const ip = await getIpFromHost(host)
  const geo = geoip.lookup(ip)
  let userId
  if (clientAddress) {
    userId = crypto.createHash('md5').update(clientAddress).digest('hex')
  }
  const data: any = {
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
    contentLength,
    responseTime: end - start,
  }
  if (geo && geo.ll) {
    data.lat = geo.ll[0]
    data.lon = geo.ll[1]
    data.country = geo.country
    data.region = geo.region
    data.city = geo.city
  }

  try {
    await createPacket(context, data)
  } catch (e) {
    console.log(e)
  }

  return data
}

export default handlePacket
