const { init: initUser } = require('./User.js')
const { init: initPacket } = require('./Packet.js')
const { init: initSession } = require('./Session.js')
const { init: initDomain } = require('./Domain.js')
const { init: initTag } = require('./Tag.js')

module.exports = (keystone) => {
  initUser(keystone)
  initPacket(keystone)
  initSession(keystone)
  initDomain(keystone)
  initTag(keystone)
}
