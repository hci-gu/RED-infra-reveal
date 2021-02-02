const { Text } = require('@keystonejs/fields')

let keystone
let listeners = []
const name = 'Domain'
const Domain = {
  fields: {
    name: {
      type: Text,
      isUnique: true,
      isRequired: true,
    },
  },
}

module.exports = {
  init: (instance) => {
    keystone = instance
    keystone.createList(name, Domain)
  },
  name,
  Domain,
  attach: (operation, callback) => {
    listeners.push({
      operation,
      callback,
    })
  },
}
