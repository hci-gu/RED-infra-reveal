const { Text } = require('@keystonejs/fields')

let keystone
let listeners = []
const name = 'DomainFilter'
const DomainFilter = {
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
    keystone.createList(name, DomainFilter)
  },
  name,
  DomainFilter,
  attach: (operation, callback) => {
    listeners.push({
      operation,
      callback,
    })
  },
}
