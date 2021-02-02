const { init: initUser } = require('./User.js')
const { init: initPacket } = require('./Packet.js')
const { init: initSession } = require('./Session.js')

module.exports = (keystone) => {
  initUser(keystone)
  initPacket(keystone)
  initSession(keystone)
}
