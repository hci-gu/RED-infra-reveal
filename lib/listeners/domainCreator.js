const { attach: attachPacket } = require('../db/Packet')
const { createFromName, attach: attachDomain } = require('../db/Domain')
const {
  create: createMainDomain,
  get: getMainDomain,
  update: updateMainDomain,
} = require('../db/MainDomain')

const { parseDomain, ParseResultType } = require('parse-domain')

attachPacket('create', (packet) => {
  try {
    createFromName(packet.host)
  } catch (e) {
    console.log(e)
  }
})

const fixEdgeCases = (domain, topLevelDomains) => {
  if (domain.indexOf('.') !== -1) {
    const parts = domain.split('.')
    return `${parts[parts.length - 1]}.${topLevelDomains.join('.')}`
  }
  if (topLevelDomains.indexOf('googleapis') !== -1) {
    return topLevelDomains.join('.')
  }

  return `${domain}.${topLevelDomains.join('.')}`
}

attachDomain('create', async ({ name, id }) => {
  try {
    const parseResult = parseDomain(name)
    if (parseResult.type === ParseResultType.Listed) {
      const { subDomains, domain, topLevelDomains } = parseResult
      let host
      if (!subDomains.length) {
        host = fixEdgeCases(domain, topLevelDomains)
      } else {
        host = `${domain}.${topLevelDomains.join('.')}`
      }
      const mainDomain = await getMainDomain(host)
      if (mainDomain) {
        await updateMainDomain(mainDomain.id, id)
      } else {
        createMainDomain({ name: host, domainId: id })
      }
    }
  } catch (e) {
    console.log(e)
  }
})
